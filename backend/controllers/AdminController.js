import User from "../models/User.js";
import Professor from "../models/Professores.js";
import Aluno from "../models/Aluno.js";
import bcrypt from "bcryptjs";
import Logger from "../db/logger.js";
import createUserToken from "../helpers/create-user-token.js";
import getToken from "../helpers/get-token.js";
import jwt from "jsonwebtoken";
import getUserByToken from "../helpers/get-user-by-token.js";
import Turma from "../models/Turma.js";
import sequelize from "../db/db.js";

export default class AdminController {
  static async register(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    const typeUser = req.body.typeuser;

    // validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório!" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória!" });
      return;
    }

    if (!confirmpassword) {
      res
        .status(422)
        .json({ message: "A confirmação de senha é obrigatória!" });
      return;
    }

    if (!typeUser) {
      res.status(422).json({ message: "O tipo de usuário é obrigatório" });
      return;
    }

    if (password != confirmpassword) {
      res
        .status(422)
        .json({ message: "A senha e a confirmação precisam ser iguais!" });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ where: { email: email } });

    if (userExists) {
      res.status(422).json({
        message: "Por favor, utilize outro e-mail. Este já foi cadastrado!",
      });
      return;
    }

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // create user
    const user = new User({
      email: email,
      senha_hash: passwordHash,
      nome: name,
      tipo: typeUser,
    });

    // save user on db
    try {
      const newUser = await user.save();

      // check type user
      if (typeUser == "professor") {
        const user_id = newUser.ID;
        const departamento = req.body.departamento;

        // validation
        if (!departamento) {
          await User.destroy({ where: { ID: user_id } });
          res.status(422).json({ message: "O departamento é obrigatório!" });
          return;
        }

        // check if professor exists
        const professorExists = await Professor.findOne({
          where: { usuario_id: user_id },
        });
        if (professorExists) {
          await User.destroy({ where: { ID: user_id } });
          res.status(422).json({
            message: "Erro ao cadastrar professor!",
          });
          Logger.error(`Usuario_id já utilizado: ${user_id}`);
          return;
        }
        const professor = new Professor({
          usuario_id: user_id,
          departamento: departamento,
        });

        // save professor on db
        try {
          const newProfessor = await professor.save();
        } catch (error) {
          await User.destroy({ where: { ID: user_id } });
          Logger.error(`Erro ao criar professor no banco: ${error}`);
          res.status(500).json({ message: error });
        }
      } else if (typeUser == "aluno") {
        const user_id = newUser.ID;
        const matricula = req.body.matricula;
        const turma_id = req.body.turma;

        // validations
        if (!matricula) {
          await User.destroy({ where: { ID: user_id } });
          res.status(422).json({ message: "A matricula é obrigatória!" });
          return;
        }

        if (!turma_id) {
          await User.destroy({ where: { ID: user_id } });
          res.status(422).json({ message: "A turma é obrigatória!" });
          return;
        }

        // check if turma exists
        const turmaExists = await Turma.findOne({ where: { ID: turma_id } });
        if (!turmaExists) {
          await User.destroy({ where: { ID: user_id } });
          res.status(422).json({
            message: "Erro ao cadastrar aluno!",
          });
          Logger.error(`Turma não encontrada com o ID: ${turma_id}`);
          return;
        }

        // finding student on db
        const alunoExists = await Aluno.findOne({
          where: { usuario_id: user_id },
        });

        // check if student exists
        if (alunoExists) {
          await User.destroy({ where: { ID: user_id } });
          res.status(422).json({
            message: "Erro ao cadastrar aluno!",
          });
          Logger.error(`Usuario_id já utilizado: ${user_id}`);
          return;
        }
        const aluno = new Aluno({
          usuario_id: user_id,
          matricula: matricula,
          turma_id: turma_id,
        });

        // save student on db
        try {
          const newAluno = await aluno.save();
        } catch (error) {
          await User.destroy({ where: { ID: user_id } });
          Logger.error(`Erro ao criar aluno no banco: ${error}`);
          res.status(500).json({ message: error });
        }
      }

      await createUserToken(newUser, req, res);
    } catch (error) {
      Logger.error(`Erro ao criar user no banco: ${error}`);
      res.status(500).json({ message: error });
    }
  }

  static async checkUser(req, res) {
    let currentUser;

    // check user authorization
    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      currentUser = await User.findOne({ where: { email: decoded.id } });
      currentUser.senha_hash = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    // search for user on db
    const user = await User.findOne({ where: { email: id } });
    user.senha_hash = undefined;

    // validation
    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    // check user type
    if (user.tipo == "aluno") {
      const aluno = await Aluno.findOne({ where: { usuario_id: user.ID } });
      res.status(200).json({ user, aluno });
    } else if (user.tipo == "professor") {
      const professor = await Professor.findOne({
        where: { usuario_id: user.ID },
      });
      res.status(200).json({ user, professor });
    } else {
      res.status(200).json({ user });
    }
  }

  static async editUser(req, res) {
    const usuario_id = req.body.iduser;
    const nome = req.body.nome;
    const senha_hash = req.body.senha;
    const senha_hash_rep = req.body.senhaconfirm;
    const tipo = req.body.tipo;

    // validations
    if (!nome) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    if (!senha_hash) {
      res.status(422).json({ message: "A senha é obrigatório!" });
      return;
    }

    if (!senha_hash_rep) {
      res
        .status(422)
        .json({ message: "A confirmação de senha é obrigatória!" });
      return;
    }

    if (!tipo) {
      res.status(422).json({ message: "O tipo de usuário é obrigatório" });
      return;
    }

    if (senha_hash != senha_hash_rep) {
      res
        .status(422)
        .json({ message: "A senha e a confirmação precisam ser iguais!" });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha_hash, salt);

    if (tipo == "aluno") {
      const t = await sequelize.transaction();
      const matricula = req.body.matricula
      const turma_id = req.body.turmaid
      // validations
      if (!matricula) {
        res.status(422).json({ message: "A matricula é obrigatória!" });
        return;
      }

      if (!turma_id) {
        res.status(422).json({ message: "A turma é obrigatória!" });
        return;
      }
      // check if turma exists
      const turmaExists = await Turma.findOne({ where: { ID: turma_id } });
      if (!turmaExists) {
        res.status(422).json({
          message: "Erro ao cadastrar aluno!",
        });
        Logger.error(`Turma não encontrada com o ID: ${turma_id}`);
        return;
      }
      try {
        const updateUser = await User.update(
          {
            nome: nome,
            senha_hash: passwordHash,
          },
          {
            where: { ID: usuario_id }, // IMPORTANTE: Atualiza pelo id do usuário
            transaction: t, // importante!
          }
        );

        const updateAluno = await Aluno.update(
          {
            matricula: matricula,
            turma_id: turma_id,
          },
          {
            where: { usuario_id: usuario_id }, // IMPORTANTE: Atualiza pelo id do usuário
            transaction: t, // importante!
          }
        );
        // Se tudo deu certo:
        await t.commit();
        res.json({
          message: "Usuário atualizado com sucesso!",
        });
      } catch (error) {
        Logger.error(`Erro ao atualizar user no banco: ${error}`);
        res.status(500).json({ message: error });
      }



    } else if (tipo == "professor") {
      const t = await sequelize.transaction();
      const departamento = req.body.departamento
      // validation
      if (!departamento) {
        res.status(422).json({ message: "O departamento é obrigatório!" });
        return;
      }

      try {
        const updateUser = await User.update(
          {
            nome: nome,
            senha_hash: passwordHash,
          },
          {
            where: { ID: usuario_id }, // IMPORTANTE: Atualiza pelo id do usuário
            transaction: t, // importante!
          }
        );
        const updateProfessor = await Professor.update(
          {
            departamento: departamento,
          },
          {
            where: { usuario_id: usuario_id }, // IMPORTANTE: Atualiza pelo id do usuário
            transaction: t, // importante!
          }
        );
        // Se tudo deu certo:
        await t.commit();
        res.json({
          message: "Usuário atualizado com sucesso!",
        });
      } catch (error) {
        Logger.error(`Erro ao atualizar user no banco: ${error}`);
        res.status(500).json({ message: error });
      }
    } else {
      try {
        const updateUser = await User.update(
          {
            nome: nome,
            senha_hash: passwordHash,
          },
          {
            where: { ID: usuario_id }, // IMPORTANTE: Atualiza pelo id do usuário
          }
        );
        res.json({
          message: "Usuário atualizado com sucesso!",
        });
      } catch (error) {
        Logger.error(`Erro ao atualizar user no banco: ${error}`);
        res.status(500).json({ message: error });
      }
    }
  }

  static async deleteUser(req, res) {
    const id = req.params.id;

    // search for user on db
    const user = await User.findOne({ where: { ID: id } });

    // validation
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado!" });
      return;
    }

    // delete user
    try {
      await User.destroy({ where: { ID: id } });
      res.status(200).json({ message: "Usuário removido com sucesso!" });
    } catch (error) {
      Logger.error(`Erro ao remover o usuário no banco: ${error}`);
      res.status(500).json({ message: error });
    }
  }

  static async createTurma(req, res) {
    const name = req.body.name;
    const ano = req.body.ano;

    // validations
    if (!name) {
      res.status(422).json({ message: "O nome da turma é obrigatório!" });
      return;
    }

    if (!ano) {
      res.status(422).json({ message: "O ano letivo é obrigatório!" });
      return;
    }

    // check if turma exists
    const turmaExists = await Turma.findOne({ where: { nome_turma: name } });
    if (turmaExists) {
      res.status(422).json({
        message: "Por favor, utilize outro nome. Este já foi cadastrado!",
      });
      return;
    }
    const turma = new Turma({
      nome_turma: name,
      ano_letivo: ano,
    });

    // save turma on db
    try {
      const newTurma = await turma.save();
      res.json({ message: "A turma foi cadastrada com sucesso!" });
    } catch (error) {
      Logger.error(`Erro ao criar turma no banco: ${error}`);
      res.status(500).json({ message: error });
    }
  }

  static async selectTurma(req, res) {
    const ano_letivo = req.body.ano
    if (!ano_letivo) {
      res.status(422).json({ message: "O ano letivo é obrigatório!" });
      return;
    }
    try {
      const turma = await Turma.findAll({ where: { ano_letivo: ano_letivo } });
      res.status(200).json({ turma });
    } catch (error) {
      Logger.error(`Erro ao encontrar turma(s) no banco: ${error}`);
      res.status(500).json({ message: error });
    }
  }

  static async editTurma(req, res) {
    const id_turma = req.body.idturma
    const ano_letivo = req.body.ano
    const nome_turma = req.body.nome

    if (!id_turma) {
      Logger.error(`ID turma não identificado ou vazio!`);
      res.status(422).json({ message: "Erro ao editar turma" });
      return;
    }
    if (!ano_letivo) {
      res.status(422).json({ message: "O ano letivo é obrigatório!" });
      return;
    }
    if (!nome_turma) {
      res.status(422).json({ message: "O nome da turma é obrigatório!" });
      return;
    }

    try {
      const updateTurma = await Turma.update(
        {
          nome_turma: nome_turma,
          ano_letivo: ano_letivo,
        },
        {
          where: { ID: id_turma },
        }
      );
      res.json({
        message: "Turma atualizada com sucesso!",
      });
    } catch (error) {
      Logger.error(`Erro ao atualizar turma no banco: ${error}`);
      res.status(500).json({ message: error });
    }
  }

  static async deleteTurma(req, res) {
    const id = req.params.id;

    // search for turma on db
    const turma = await Turma.findOne({ where: { ID: id } });

    // validation
    if (!turma) {
      res.status(404).json({ message: "Turma não encontrada!" });
      return;
    }

    // delete turma
    try {
      await Turma.destroy({ where: { ID: id } });
      res.status(200).json({ message: "Turma removida com sucesso!" });
    } catch (error) {
      Logger.error(`Erro ao remover o Turma no banco: ${error}`);
      res.status(500).json({ message: error });
    }
  }
}
