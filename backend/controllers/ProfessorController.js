import User from "../models/User.js";
import Professor from "../models/Professores.js";
// import Aluno from "../models/Aluno.js";
import bcrypt from "bcryptjs";
// import Logger from "../db/logger.js";
// import createUserToken from "../helpers/create-user-token.js";
import getToken from "../helpers/get-token.js";
//import jwt from "jsonwebtoken";
import getUserByToken from "../helpers/get-user-by-token.js";
import Turma from "../models/Turma.js";
import ProfessoresTurmas from "../models/ProfessoresTurmas.js";
import Disciplina from "../models/Disciplinas.js";
import Aluno from "../models/Aluno.js";
import Notas from "../models/Notas.js";
import Frequencia from "../models/Frequencia.js";
import Avisos from "../models/Avisos.js";

export default class ProfessorController {
  // LIST FUNCTIONS
  static async minhasTurma(req, res) {
    try {
      const token = getToken(req);
      const user = await getUserByToken(token);

      if (!user) {
        return res.status(401).json({ message: "Acesso negado!" });
      }

      // find professor on db
      const professor = await Professor.findOne({
        where: { usuario_id: user.ID },
      });

      if (!professor) {
        return res.status(404).json({
          message: "Perfil de professor não encontrado para este usuário.",
        });
      }

      const minhasTurmas = await ProfessoresTurmas.findAll({
        attributes: [],
        where: {
          professor_id: professor.ID,
        },
        include: [
          {
            model: Turma,
            attributes: ["nome_turma", "ano_letivo"],
          },
        ],
      });

      const turmasEncontradas = minhasTurmas.map((link) => ({
        nome_turma: link.turma.nome_turma,
        ano_letivo: link.turma.ano_letivo,
      }));

      // return data
      return res.status(200).json({
        turmasEncontradas,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao buscar turmas." });
    }
  }

  static async minhasNotas(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (!user) {
      return res.status(401).json({ message: "Acesso negado!" });
    }

    const professor = await Professor.findOne({
      where: { usuario_id: user.ID },
    });

    if (!professor) {
      return res.status(401).json({
        message: "Perfil de professor não encontrado para este usuário.",
      });
    }

    const disciplinaProfessor = await Disciplina.findAll({
      where: { professor_id: professor.ID },
    });
    try {
      const notasLancadas = await Notas.findAll({
        where: { disciplina_id: disciplinaProfessor[0].ID },
      });
      return res.status(200).json({
        notasLancadas,
      });
    } catch (error) {
      return res.status(401).json({
        message: "Notas não encontradas para suas disciplinas.",
      });
    }
  }

  static async minhasFrequencias(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (!user) {
      return res.status(401).json({ message: "Acesso negado!" });
    }

    const professor = await Professor.findOne({
      where: { usuario_id: user.ID },
    });

    if (!professor) {
      return res.status(401).json({
        message: "Perfil de professor não encontrado para este usuário.",
      });
    }

    const disciplinaProfessor = await Disciplina.findAll({
      where: { professor_id: professor.ID },
    });

    try {
      const frequenciasLancadas = await Frequencia.findAll({
        where: { disciplina_id: disciplinaProfessor[0].ID },
      });
      return res.status(200).json({
        frequenciasLancadas,
      });
    } catch (error) {
      return res.status(401).json({
        message: "Frequências não encontradas para suas disciplinas.",
      });
    }
  }

  static async meusAvisos(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (!user) {
      return res.status(401).json({ message: "Acesso negado!" });
    }

    try {
      const avisosLancados = await Avisos.findAll({
        where: { autor_id: user.ID },
      });
      return res.status(200).json({
        avisosLancados,
      });
    } catch (error) {
      return res.status(401).json({
        message: "Seus avisos não foram encontrados.",
      });
    }
  }

  // CREATE FUNCTIONS
  static async lancarFrequencia(req, res) {
    const { aluno_id, disciplina_id, data, presente } = req.body;

    // validation
    if (!aluno_id || !disciplina_id || !data || presente === undefined) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios!" });
    }

    try {
      const token = getToken(req);
      const user = await getUserByToken(token);

      if (!user) {
        return res.status(401).json({ message: "Acesso negado!" });
      }

      // find professor on db
      const professor = await Professor.findOne({
        where: { usuario_id: user.ID },
      });

      try {
        const disciplinaProfessor = await Disciplina.findOne({
          where: {
            ID: disciplina_id,
            professor_id: professor.ID,
          },
        });

        if (!disciplinaProfessor) {
          return res.status(401).json({
            message:
              "Você não tem permissão para lançar frequências nesta disciplina.",
          });
        }

        const alunoExiste = await Aluno.findByPk(aluno_id);
        if (!alunoExiste) {
          return res.status(404).json({ message: "Aluno não encontrado." });
        }

        const frequenciaExistente = await Frequencia.findOne({
          where: {
            aluno_id,
            disciplina_id,
            data,
          },
        });

        if (frequenciaExistente) {
          return res.status(422).json({
            message:
              "Já existe uma frequência lançada para este aluno nesta data.",
          });
        }

        const novaFrequencia = await Frequencia.create({
          aluno_id,
          disciplina_id,
          data,
          presente,
        });

        return res.status(201).json({
          message: "Frequência lançada com sucesso!",
          frequencia: novaFrequencia,
        });
      } catch (error) {
        res.status(500).json({
          message: "Erro ao encontrar a disciplina referente ao seu cadastro.",
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Erro ao postar frequência." });
    }
  }

  static async lancarNotas(req, res) {
    const { aluno_id, disciplina_id, bimestre, valor_nota } = req.body;

    // validation
    if (!aluno_id || !disciplina_id || !bimestre || valor_nota === undefined) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios!" });
    }

    try {
      const token = getToken(req);
      const user = await getUserByToken(token);

      if (!user) {
        return res.status(401).json({ message: "Acesso negado!" });
      }

      // find professor on db
      const professor = await Professor.findOne({
        where: { usuario_id: user.ID },
      });

      try {
        const disciplinaProfessor = await Disciplina.findOne({
          where: {
            ID: disciplina_id,
            professor_id: professor.ID,
          },
        });

        if (!disciplinaProfessor) {
          return res.status(401).json({
            message:
              "Você não tem permissão para lançar notas nesta disciplina.",
          });
        }

        const alunoExiste = await Aluno.findByPk(aluno_id);
        if (!alunoExiste) {
          return res.status(404).json({ message: "Aluno não encontrado." });
        }

        const notaExistente = await Notas.findOne({
          where: {
            aluno_id,
            disciplina_id,
            bimestre,
          },
        });

        if (notaExistente) {
          return res.status(422).json({
            message:
              "Já existe uma nota lançada para este aluno neste bimestre.",
          });
        }

        const novaNota = await Notas.create({
          aluno_id,
          disciplina_id,
          bimestre,
          valor_nota,
        });

        return res
          .status(201)
          .json({ message: "Nota lançada com sucesso!", nota: novaNota });
      } catch (error) {
        res.status(500).json({
          message: "Erro ao encontrar a disciplina referente ao seu cadastro.",
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Erro ao postar nota." });
    }
  }

  static async lancarAviso(req, res) {
    const { autor_id, titulo, conteudo, data_postagem } = req.body;

    if (!autor_id || !titulo || !conteudo || !data_postagem) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios!" });
    }

    const autor = await User.findOne({
      where: { ID: autor_id },
    });

    if (!autor) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    const professor = await Professor.findOne({
      where: { usuario_id: autor.ID },
    });

    // validation
    if (!professor) {
      res.status(422).json({ message: "Professor não encontrado!" });
      return;
    }

    try {
      const novoAviso = await Avisos.create({
        autor_id,
        titulo,
        conteudo,
        data_postagem,
      });

      return res.status(201).json({
        message: "Aviso lançado com sucesso!",
        frequencia: novoAviso,
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao postar aviso." });
    }
  }

  // EDIT FUNCTIONS
  static async editNota(req, res) {
    const { aluno_id, disciplina_id, bimestre, valor_nota } = req.body;

    // validation
    if (!aluno_id || !disciplina_id || !bimestre || valor_nota === undefined) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios!" });
    }

    try {
      const token = getToken(req);
      const user = await getUserByToken(token);

      if (!user) {
        return res.status(401).json({ message: "Acesso negado!" });
      }

      // find professor on db
      const professor = await Professor.findOne({
        where: { usuario_id: user.ID },
      });

      try {
        const disciplinaProfessor = await Disciplina.findOne({
          where: {
            ID: disciplina_id,
            professor_id: professor.ID,
          },
        });

        if (!disciplinaProfessor) {
          return res.status(401).json({
            message:
              "Você não tem permissão para editar notas desta disciplina.",
          });
        }

        const alunoExiste = await Aluno.findByPk(aluno_id);
        if (!alunoExiste) {
          return res.status(404).json({ message: "Aluno não encontrado." });
        }

        const notaExists = await Notas.findOne({
          where: {
            aluno_id,
            disciplina_id,
            bimestre,
          },
        });

        if (notaExists) {
          const attNotas = await Notas.update(
            {
              aluno_id,
              disciplina_id,
              bimestre,
              valor_nota,
            },
            {
              where: { aluno_id, disciplina_id, bimestre }, // IMPORTANTE: Atualiza pelo id do usuário
            }
          );
          return res.status(201).json({
            message: "Nota atualizada com sucesso!",
            notaAtt: valor_nota,
          });
        }

        return res.status(500).json({
          message: "Erro ao encontrar frequência.",
        });
      } catch (error) {
        res.status(500).json({
          message: "Erro ao encontrar a nota referente ao aluno.",
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Erro ao postar nota." });
    }
  }

  static async editFrequencia(req, res) {
    const { aluno_id, disciplina_id, data, presente } = req.body;

    // validation
    if (!aluno_id || !disciplina_id || !data || presente === undefined) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios!" });
    }

    try {
      const token = getToken(req);
      const user = await getUserByToken(token);

      if (!user) {
        return res.status(401).json({ message: "Acesso negado!" });
      }

      const professor = await Professor.findOne({
        where: { usuario_id: user.ID },
      });

      const disciplinaProfessor = await Disciplina.findOne({
        where: {
          ID: disciplina_id,
          professor_id: professor.ID,
        },
      });

      if (!disciplinaProfessor) {
        return res.status(401).json({
          message:
            "Você não tem permissão para editar frequências nesta disciplina.",
        });
      }

      const alunoExiste = await Aluno.findByPk(aluno_id);
      if (!alunoExiste) {
        return res.status(404).json({ message: "Aluno não encontrado." });
      }

      const frequenciaExist = await Frequencia.findOne({
        where: {
          aluno_id,
          disciplina_id,
          data,
        },
      });

      if (frequenciaExist) {
        //await Frequencia.destroy({ where: aluno_id, disciplina_id, data });
        const attFrequencia = await Frequencia.update(
          {
            aluno_id,
            disciplina_id,
            data,
            presente,
          },
          {
            where: { aluno_id, disciplina_id, data }, // IMPORTANTE: Atualiza pelo id do usuário
          }
        );
        return res.status(201).json({
          message: "Frequência editada com sucesso!",
        });
      }

      return res.status(500).json({
        message: "Erro ao encontrar frequência.",
      });
    } catch (error) {
      res.status(500).json({
        message: "Erro ao encontrar a disciplina referente ao seu cadastro.",
      });
    }
  }

  static async editAviso(req, res) {
    const id = req.params.id;

    const { autor_id, titulo, conteudo, data_postagem } = req.body;

    if (!autor_id || !titulo || !conteudo || !data_postagem) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios!" });
    }

    const autor = await User.findOne({
      where: { ID: autor_id },
    });

    if (!autor) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    const professor = await Professor.findOne({
      where: { usuario_id: autor.ID },
    });

    // validation
    if (!professor) {
      res.status(422).json({ message: "Professor não encontrado!" });
      return;
    }

    const avisoExists = await Avisos.findOne({
      where: { ID: id },
    });

    if (!avisoExists) {
      return res.status(422).json({ message: "Aviso não encontrado." });
    }

    try {
      const attAviso = await Avisos.update(
        {
          autor_id,
          titulo,
          conteudo,
          data_postagem,
        },
        {
          where: { ID: id },
        }
      );
      if (attAviso == 1) {
        return res.status(201).json({
          message: "Aviso editado com sucesso!",
        });
      } else {
        return res.status(500).json({ message: "Erro ao editar aviso." });
      }
    } catch (error) {
      return res.status(500).json({ message: "Erro ao editar aviso." });
    }
  }

  // DELETE FUNCTIONS
  static async deleteNota(req, res) {
    const id = req.params.id;

    const notaExistente = await Notas.findOne({
      where: {
        ID: id,
      },
    });

    if (!notaExistente) {
      return res.status(401).json({
        message: "Nota não existente",
      });
    }

    try {
      await Notas.destroy({ where: { ID: id } });
      res.status(200).json({ message: "Nota removida com sucesso!" });
    } catch (error) {
      Logger.error(`Erro ao remover a nota no banco: ${error}`);
      res.status(500).json({ message: error });
    }
  }

  static async deleteFrequencia(req, res) {
    const id = req.params.id;

    const frequenciaExistente = await Frequencia.findOne({
      where: {
        ID: id,
      },
    });

    if (!frequenciaExistente) {
      return res.status(401).json({
        message: "Nota não existente",
      });
    }

    try {
      await Frequencia.destroy({ where: { ID: id } });
      res.status(200).json({ message: "Frequencia removida com sucesso!" });
    } catch (error) {
      Logger.error(`Erro ao remover a frequencia no banco: ${error}`);
      res.status(500).json({ message: error });
    }
  }

  static async deleteAviso(req, res) {
    const id = req.params.id;

    const avisoExistente = await Avisos.findOne({
      where: {
        ID: id,
      },
    });

    if (!avisoExistente) {
      return res.status(401).json({
        message: "Aviso não existente",
      });
    }

    try {
      await Avisos.destroy({ where: { ID: id } });
      res.status(200).json({ message: "Aviso removido com sucesso!" });
    } catch (error) {
      Logger.error(`Erro ao remover o aviso no banco: ${error}`);
      res.status(500).json({ message: error });
    }
  }
}
