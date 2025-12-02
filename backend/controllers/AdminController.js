// Models
import User from "../models/User.js";
import Professor from "../models/Professores.js";
import Aluno from "../models/Aluno.js";
import Turma from "../models/Turma.js";
import Disciplinas from "../models/Disciplinas.js";
import Professores from "../models/Professores.js";
import Matriculas from "../models/Matriculas.js";
import Horarios from "../models/Horarios.js";
import Avisos from "../models/Avisos.js";
// Middleware
import getToken from "../helpers/get-token.js";
// Session on database
import sequelize from "../db/db.js";
// Liberies
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Logger status code
import Logger from "../db/logger.js";


export default class AdminController {
  static async register(req, res) {
    const { name, email, password, confirmpassword, typeuser: typeUser } = req.body;

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

    // create hash password 
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
            message: "Erro ao cadastrar professor - Usuário já utilizado!",
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
          res.status(500).json({ message: "Erro ao criar professor no banco!" });
        }
      } else if (typeUser == "aluno") {
        const user_id = newUser.ID;
        const { matricula, turma: turma_id } = req.body;

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
            message: "Erro ao cadastrar aluno - Turma não encontrada!",
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
            message: "Erro ao cadastrar aluno - Usuário já utilizado!",
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
          res.status(500).json({ message: "Erro ao criar aluno no banco" });
        }
      }

      res.status(200).json({ message: "Usário cadastrado com sucesso", user: newUser })
    } catch (error) {
      Logger.error(`Erro ao criar user no banco: ${error}`);
      res.status(500).json({ message: "Erro ao criar user no banco!" });
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
    const {
      iduser: usuario_id,
      nome,
      senha: senha_hash,
      senhaconfirm: senha_hash_rep,
      tipo
    } = req.body;

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
      const { matricula, turmaid: turma_id } = req.body;
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
          message: "Erro ao cadastrar aluno - Turma não encontrada!",
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
        res.status(200).json({
          message: "Usuário atualizado com sucesso!",
        });
      } catch (error) {
        Logger.error(`Erro ao atualizar user no banco: ${error}`);
        res.status(500).json({ message: "Erro ao atualizar user no banco!" });
      }
    } else if (tipo == "professor") {
      const t = await sequelize.transaction();
      const departamento = req.body.departamento;
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
        res.status(200).json({
          message: "Usuário atualizado com sucesso!",
        });
      } catch (error) {
        Logger.error(`Erro ao atualizar user no banco: ${error}`);
        res.status(500).json({ message: "Erro ao atualizar user no banco!" });
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
        res.status(200).json({
          message: "Usuário atualizado com sucesso!",
        });
      } catch (error) {
        Logger.error(`Erro ao atualizar user no banco: ${error}`);
        res.status(500).json({ message: "Erro ao atualizar user no banco!" });
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
      res.status(500).json({ message: "Erro ao remover user no banco!" });
    }
  }

  static async createTurma(req, res) {
    const { name, ano } = req.body;

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
      res.status(200).json({ message: "A turma foi cadastrada com sucesso!" });
    } catch (error) {
      Logger.error(`Erro ao criar turma no banco: ${error}`);
      res.status(500).json({ message: "Erro ao criar Turma no banco!" });
    }
  }

  static async selectTurma(req, res) {
    const ano_letivo = req.body.ano;
    if (!ano_letivo) {
      res.status(422).json({ message: "O ano letivo é obrigatório!" });
      return;
    }
    try {
      const turma = await Turma.findAll({ where: { ano_letivo: ano_letivo } });
      res.status(200).json({ turma });
    } catch (error) {
      Logger.error(`Erro ao encontrar turma(s) no banco: ${error}`);
      res.status(500).json({ message: "Erro ao encontrar Turma" });
    }
  }

  static async editTurma(req, res) {
    const { idturma: id_turma, ano: ano_letivo, nome: nome_turma } = req.body;

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
      res.status(200).json({
        message: "Turma atualizada com sucesso!",
      });
    } catch (error) {
      Logger.error(`Erro ao atualizar turma no banco: ${error}`);
      res.status(500).json({ message: "Erro ao atualizar Turma no banco!" });
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
      res.status(500).json({ message: "Erro ao remover Turma no banco!" });
    }
  }

  static async createDisciplina(req, res) {
    const { nome: nome_disciplina, idprofessor: professor_id } = req.body;

    // validations
    if (!nome_disciplina) {
      res.status(422).json({ message: "O nome da disciplina é obrigatório!" });
      return;
    }

    if (!professor_id) {
      Logger.error(`Professor ID não identificado!`);
      res.status(422).json({ message: "Erro ao criar disciplina!" });
      return;
    }

    // check if turma exists
    const professorExists = await Professores.findOne({
      where: { ID: professor_id },
    });
    if (!professorExists) {
      res.status(422).json({
        message: "Professor não encontrado!",
      });
      return;
    }

    const disciplina = new Disciplinas({
      nome_disciplina: nome_disciplina,
      professor_id: professor_id,
    });

    // save disciplina on db
    try {
      const newDisciplina = await disciplina.save();
      res.status(200).json({ message: "A disciplina foi cadastrada com sucesso!" });
    } catch (error) {
      Logger.error(`Erro ao criar disciplina no banco: ${error}`);
      res.status(500).json({ message: "Erro ao criar Discip[lina no banco!" });
    }
  }

  static async selectDisciplina(req, res) {
    const { professor_id } = req.body;
    if (!professor_id) {
      res.status(422).json({ message: "Professor não identificado!" });
      return;
    }
    try {
      const disciplina = await Disciplinas.findAll({
        where: { professor_id: professor_id },
      });
      res.status(200).json({ disciplina });
    } catch (error) {
      Logger.error(`Erro ao encontrar disciplina(s) no banco: ${error}`);
      res.status(500).json({ message: "Erro ao encontrar disciplina(s) no banco!" });
    }
  }

  static async editDisciplina(req, res) {
    const {
      iddisciplina: discplina_id,
      nome: nome_disciplina,
      idprofessor: professor_id
    } = req.body;


    if (!discplina_id) {
      Logger.error(`ID disciplina não identificado ou vazio!`);
      res.status(422).json({ message: "Erro ao editar disciplina" });
      return;
    }

    if (!nome_disciplina) {
      res.status(422).json({ message: "O nome da disciplina é obrigatório!" });
      return;
    }

    if (!professor_id) {
      Logger.error(`Professor ID não identificado!`);
      res.status(422).json({ message: "Erro ao criar disciplina!" });
      return;
    }

    try {
      const updateDisciplina = await Disciplinas.update(
        {
          nome_disciplina: nome_disciplina,
          professor_id: professor_id,
        },
        {
          where: { ID: discplina_id },
        }
      );
      res.status(200).json({
        message: "Disciplina atualizada com sucesso!",
      });
    } catch (error) {
      Logger.error(`Erro ao atualizar disciplina no banco: ${error}`);
      res.status(500).json({ message: "Erro ao atualizar disciplina no banco!" });
    }
  }

  static async deleteDisciplina(req, res) {
    const id = req.params.id;

    // search for disciplina on db
    const disciplina = await Disciplinas.findOne({ where: { ID: id } });

    // validation
    if (!disciplina) {
      res.status(404).json({ message: "Disciplina não encontrada!" });
      return;
    }

    // delete disciplina
    try {
      await Disciplinas.destroy({ where: { ID: id } });
      res.status(200).json({ message: "Disciplina removida com sucesso!" });
    } catch (error) {
      Logger.error(`Erro ao remover o Disciplina no banco: ${error}`);
      res.status(500).json({ message: "Erro ao remover o Disciplina no banco!" });
    }
  }

  static async createMatricula(req, res) {
    const { alunoid: aluno_id, disciplinaid: disciplina_id } = req.body;

    // validations
    if (!aluno_id) {
      res
        .status(422)
        .json({ message: "O aluno a ser matriculado é obrigatório!" });
      return;
    }

    if (!disciplina_id) {
      res
        .status(422)
        .json({ message: "A disciplina precisa ser selecionado!" });
      return;
    }

    // check if aluno exists
    const alunoExists = await Aluno.findOne({ where: { ID: aluno_id } });
    if (!alunoExists) {
      res.status(422).json({
        message: "Aluno não encontrado!",
      });
      return;
    }

    // check if disciplina exists
    const disciplinaExists = await Disciplinas.findOne({
      where: { ID: disciplina_id },
    });
    if (!disciplinaExists) {
      res.status(422).json({
        message: "Disciplina não encontrado!",
      });
      return;
    }

    const matricula = new Matriculas({
      aluno_id: aluno_id,
      disciplina_id: disciplina_id,
    });

    // save matricula on db
    try {
      const newMatricula = await matricula.save();
      res.status(200).json({ message: "A matricula foi realizada com sucesso!" });
    } catch (error) {
      Logger.error(
        `Erro ao matricular aluno da disciplina, Ou matricula já realizada: ${error}`
      );
      res.status(500).json({ message: "Erro ao matricular aluno da disciplina, Ou matricula já realizada!" });
    }
  }

  static async selectMatriculaDisciplina(req, res) {
    const disciplina_id = req.body.disciplina_id;
    if (!disciplina_id) {
      res.status(422).json({ message: "Matricula não identificada!" });
      return;
    }
    try {
      const alunos_da_disciplina = await Matriculas.findAll({
        where: { disciplina_id: disciplina_id },
      });
      res.status(200).json({ alunos_da_disciplina });
    } catch (error) {
      Logger.error(`Erro ao encontrar alunos matriculados no banco: ${error}`);
      res.status(500).json({ message: "Erro ao encontrar alunos matriculados no banco!" });
    }
  }

  static async selectMatriculaAluno(req, res) {
    const aluno_id = req.body.aluno_id;
    if (!aluno_id) {
      res.status(422).json({ message: "Aluno não identificado!" });
      return;
    }
    try {
      const disciplinas_do_aluno = await Matriculas.findAll({
        where: { aluno_id: aluno_id },
      });
      res.status(200).json({ disciplinas_do_aluno });
    } catch (error) {
      Logger.error(
        `Erro ao encontrar disciplina(s) do aluno no banco: ${error}`
      );
      res.status(500).json({ message: "Erro ao encontrar disciplina(s) do aluno no banco!" });
    }
  }

  static async deleteMatricula(req, res) {
    const { idaluno: id_aluno, iddisciplina: id_disciplina } = req.params;

    // search for matricula on db
    const matricula = await Matriculas.findOne({
      where: { aluno_id: id_aluno, disciplina_id: id_disciplina },
    });

    // validation
    if (!matricula) {
      res.status(422).json({ message: "Matricula não encontrada!" });
      return;
    }

    // delete matricula
    try {
      await Matriculas.destroy({
        where: { aluno_id: id_aluno, disciplina_id: id_disciplina },
      });
      res.status(200).json({ message: "Matricula removida com sucesso!" });
    } catch (error) {
      Logger.error(`Erro ao remover o Matricula no banco: ${error}`);
      res.status(500).json({ message: "Erro ao remover o Matricula no banco!" });
    }
  }

  static async createHorario(req, res) {
    const { disciplinaid: disciplina_id, horarioinicio: horario_inicio, horariofim: horario_fim, diasemana: dia_semana } = req.body;

    if (!horario_inicio) {
      res
        .status(422)
        .json({ message: "O horario de inicio precisa ser selecionado!" });
      return;
    }

    if (!horario_fim) {
      res
        .status(422)
        .json({ message: "O horario de fim precisa ser selecionado!" });
      return;
    }

    if (!dia_semana) {
      res
        .status(422)
        .json({ message: "O dia da semana precisa ser selecionado!" });
      return;
    }

    if (!disciplina_id) {
      res
        .status(422)
        .json({ message: "A disciplina precisa ser selecionado!" });
      return;
    }

    // check if disciplina exists
    const disciplinaExists = await Disciplinas.findOne({
      where: { ID: disciplina_id },
    });
    if (!disciplinaExists) {
      res.status(422).json({
        message: "Disciplina não encontrado!",
      });
      return;
    }

    const horario = new Horarios({
      disciplina_id: disciplina_id,
      horario_inicio: horario_inicio,
      horario_fim: horario_fim,
      dia_semana: dia_semana,
    });

    // save horario on db
    try {
      const newHorario = await horario.save();
      res.status(200).json({
        message: "O horário foi atribuido a disciplina com sucesso!",
      });
    } catch (error) {
      Logger.error(`Erro ao atribuir horario a disciplina: ${error}`);
      res.status(500).json({ message: "Erro ao atribuir horario a disciplina!" });
    }
  }

  static async selectHorarioDisciplina(req, res) {
    const disciplina_id = req.body.disciplina_id;
    if (!disciplina_id) {
      res.status(422).json({ message: "Disciplina não identificada!" });
      return;
    }
    try {
      const horarios_da_disciplina = await Horarios.findAll({
        where: { disciplina_id: disciplina_id },
      });
      res.status(200).json({ horarios_da_disciplina });
    } catch (error) {
      Logger.error(
        `Erro ao identificar horarios da disciplina no banco: ${error}`
      );
      res.status(500).json({ message: "Erro ao identificar horarios da disciplina no banco!" });
    }
  }

  static async editHorarioDisciplina(req, res) {
    const {
      horarioid: horario_id,
      horarioinicio: horario_inicio,
      horariofim: horario_fim,
      diasemana: dia_semana
    } = req.body;

    if (!horario_inicio) {
      res
        .status(422)
        .json({ message: "O horario de inicio precisa ser selecionado!" });
      return;
    }

    if (!horario_fim) {
      res
        .status(422)
        .json({ message: "O horario de fim precisa ser selecionado!" });
      return;
    }

    if (!dia_semana) {
      res
        .status(422)
        .json({ message: "O dia da semana precisa ser selecionado!" });
      return;
    }

    if (!horario_id) {
      res.status(422).json({ message: "O horario precisa ser selecionado!" });
      return;
    }

    // check if disciplina exists
    const horarioExists = await Horarios.findOne({ where: { ID: horario_id } });
    if (!horarioExists) {
      res.status(422).json({
        message: "Horario não encontrado!",
      });
      return;
    }

    try {
      const updateHorario = await Horarios.update(
        {
          horario_inicio: horario_inicio,
          horario_fim: horario_fim,
          dia_semana: dia_semana,
        },
        {
          where: { ID: horario_id },
        }
      );
      res.status(200).json({
        message: "Horario atualizado com sucesso!",
      });
    } catch (error) {
      Logger.error(`Erro ao atualizar horario no banco: ${error}`);
      res.status(500).json({ message: "Erro ao atualizar horario no banco!" });
    }
  }

  static async deleteHorario(req, res) {
    const id_horario = req.params.id;

    // search for horario on db
    const horario = await Horarios.findOne({ where: { ID: id_horario } });

    // validation
    if (!horario) {
      res
        .status(422)
        .json({ message: "Horario da disciplina não encontrado!" });
      return;
    }

    // delete horario
    try {
      await Horarios.destroy({ where: { ID: id_horario } });
      res.status(200).json({ message: "Horario removido com sucesso!" });
    } catch (error) {
      Logger.error(`Erro ao remover o Horario no banco: ${error}`);
      res.status(500).json({ message: "Erro ao remover o Horario no banco!" });
    }
  }

  static async meusAvisos(req, res) {
    const user = req.user;

    try {
      const avisosLancados = await Avisos.findAll({
        where: { autor_id: user.id_number },
      });
      return res.status(200).json({
        avisosLancados,
      });
    } catch (error) {
      Logger.error(`Erro ao buscar aviso no banco: ${error}`);
      return res.status(500).json({
        message: "Erro ao buscar seus avisos.",
      });
    }
  }

  static async lancarAviso(req, res) {
    const { titulo, conteudo, data_postagem } = req.body;

    if (!titulo || !conteudo || !data_postagem) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios!" });
    }

    const user = req.user;

    try {
      const novoAviso = await Avisos.create({
        autor_id: user.id_number,
        titulo,
        conteudo,
        data_postagem,
      });

      return res.status(200).json({
        message: "Aviso lançado com sucesso!",
        aviso: novoAviso,
      });
    } catch (error) {
      Logger.error(`Erro ao postar aviso no banco: ${error}`);
      return res.status(500).json({ message: "Erro ao postar aviso." });
    }
  }

  static async editAviso(req, res) {
    const id = req.params.id;
    const { titulo, conteudo, data_postagem } = req.body;

    if (!titulo || !conteudo || !data_postagem) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios!" });
    }

    const user = req.user;

    const avisoExists = await Avisos.findOne({
      where: { ID: id },
    });

    if (!avisoExists) {
      return res.status(422).json({ message: "Aviso não encontrado." });
    }

    if (avisoExists.autor_id !== user.id_number) {
      return res
        .status(403)
        .json({ message: "Você não tem permissão para editar este aviso." });
    }

    try {
      await Avisos.update(
        {
          titulo,
          conteudo,
          data_postagem,
        },
        {
          where: { ID: id },
        }
      );

      return res
        .status(200)
        .json({ message: "Dados atualizados com sucesso." });
    } catch (error) {
      Logger.error(`Erro ao editar aviso no banco: ${error}`);
      return res.status(500).json({ message: "Erro ao editar aviso." });
    }
  }

  static async deleteAviso(req, res) {
    const id = req.params.id;
    const user = req.user;

    const avisoExistente = await Avisos.findOne({
      where: {
        ID: id,
        autor_id: user.id_number,
      },
    });

    if (!avisoExistente) {
      return res.status(422).json({
        message: "Aviso não existente.",
      });
    }

    try {
      await avisoExistente.destroy();
      res.status(200).json({ message: "Aviso removido com sucesso." });
    } catch (error) {
      Logger.error(`Erro ao remover o aviso no banco: ${error}`);
      res
        .status(500)
        .json({ message: "Erro interno ao tentar remover o aviso." });
    }
  }
}
