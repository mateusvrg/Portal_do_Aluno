// Models
import Turma from "../models/Turma.js";
import ProfessoresTurmas from "../models/ProfessoresTurmas.js";
import Disciplina from "../models/Disciplinas.js";
import Aluno from "../models/Aluno.js";
import Notas from "../models/Notas.js";
import Frequencia from "../models/Frequencia.js";
import Materiaisaula from "../models/Materiaisaula.js";
// Helpers
import generateUrl from "../helpers/aws-upload-s3.js";
// Logger status code
import Logger from "../db/logger.js";
// Libery
import { Op } from "sequelize";
import Matriculas from "../models/Matriculas.js";

export default class ProfessorController {
  // LIST FUNCTIONS
  static async minhasTurma(req, res) {
    const professor = req.professor;

    try {
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

      if (turmasEncontradas.length == 0) {
        return res.status(422).json({
          nome_turma: "Turma não encontrada",
          ano_letivo: "N/A",
        });
      }

      // return data
      return res.status(200).json({
        turmasEncontradas,
      });
    } catch (error) {
      Logger.error(`Erro ao buscar turma-professor no banco: ${error}`);
      return res.status(500).json({
        message: "Erro interno ao buscar turmas no banco.",
      });
    }
  }

  static async minhasNotas(req, res) {
    const professor = req.professor;

    try {
      const disciplinaProfessor = await Disciplina.findAll({
        where: { professor_id: professor.ID },
      });

      if (disciplinaProfessor.length == 0) {
        return res.status(422).json({ message: "Disciplinas não encontradas!" });
      }

      const idsDisciplinas = disciplinaProfessor.map((d) => d.ID);

      const notasLancadas = await Notas.findAll({
        where: {
          disciplina_id: { [Op.in]: idsDisciplinas }, // Busca em todas
        },
      });

      if (notasLancadas.length == 0) {
        return res.status(422).json({ message: "Você não tem notas lançadas." })
      }

      return res.status(200).json({
        notasLancadas,
      });
    } catch (error) {
      Logger.error(`Erro ao buscar notas no banco: ${error}`);
      return res.status(500).json({
        message: "Erro interno ao buscar notas no banco.",
      });
    }
  }

  static async minhasFrequencias(req, res) {
    const professor = req.professor;

    try {
      const disciplinaProfessor = await Disciplina.findAll({
        where: { professor_id: professor.ID },
      });

      if (disciplinaProfessor.length == 0) {
        return res.status(422).json({ message: "Disciplinas não encontradas!" });
      }

      const idsDisciplinas = disciplinaProfessor.map((d) => d.ID);

      const frequenciasLancadas = await Frequencia.findAll({
        where: {
          disciplina_id: { [Op.in]: idsDisciplinas },
        },
      });

      if (frequenciasLancadas.length == 0) {
        return res.status(422).json({ message: "Nenhuma frequência lançada até o momento." });
      }

      return res.status(200).json({
        frequenciasLancadas,
      });
    } catch (error) {
      Logger.error(`Erro ao buscar frequência no banco: ${error}`);
      return res.status(500).json({
        message: "Erro interno ao buscar frequências no banco.",
      });
    }
  }

  static async meusMateriais(req, res) {
    const professor = req.professor;

    const minhasDisciplinas = await Disciplina.findAll({
      attributes: ["ID"],
      where: { professor_id: professor.ID },
    });

    if (minhasDisciplinas.length == 0) {
      return res.status(422).json({
        message: "Você não tem disciplinas.",
      });
    }

    const materiais = await Materiaisaula.findAll({
      where: {
        disciplina_id: {
          [Op.in]: minhasDisciplinas.map((d) => d.ID),
        },
      },
    });

    if (materiais.length == 0) {
      return res.status(422).json({
        message: "Você não tem materiais.",
      });
    }

    return res.status(200).json({ materiais });
  }

  // CREATE FUNCTIONS
  static async lancarFrequencia(req, res) {
    const { aluno_id, disciplina_id, data, presente } = req.body;

    // validation
    if (!aluno_id || !disciplina_id || !data || !presente) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    const professor = req.professor;

    const disciplinaProfessor = await Disciplina.findOne({
      where: {
        ID: disciplina_id,
        professor_id: professor.ID,
      },
    });

    if (!disciplinaProfessor) {
      return res.status(422).json({
        message:
          "Você não tem permissão para lançar frequências nesta disciplina.",
      });
    }

    const alunoExiste = await Aluno.findByPk(aluno_id);
    if (!alunoExiste) {
      return res.status(404).json({ message: "Aluno não encontrado." });
    }

    const matriculaExist = await Matriculas.findOne({
      where: {
        aluno_id,
        disciplina_id,
      },
    });

    if (!matriculaExist) {
      return res.status(422).json({ message: "Matricula não encontrada." });
    }

    const frequenciaExistente = await Frequencia.findOne({
      where: {
        aluno_id,
        disciplina_id,
        data,
      },
    });

    if (frequenciaExistente) {
      return res.status(409).json({
        message: "Já existe uma frequência lançada para este aluno nesta data.",
      });
    }

    try {
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
      Logger.error(`Erro ao postar frequência no banco: ${error}`);
      return res.status(500).json({ message: "Erro ao postar frequência." });
    }
  }

  static async lancarNotas(req, res) {
    const { aluno_id, disciplina_id, bimestre, valor_nota } = req.body;

    // validation
    if (!aluno_id || !disciplina_id || !bimestre || !valor_nota) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios!" });
    }

    const professor = req.professor;

    const disciplinaProfessor = await Disciplina.findOne({
      where: {
        ID: disciplina_id,
        professor_id: professor.ID,
      },
    });

    if (!disciplinaProfessor) {
      return res.status(403).json({
        message: "Você não tem permissão para lançar notas nesta disciplina.",
      });
    }

    const alunoExiste = await Aluno.findByPk(aluno_id);

    if (!alunoExiste) {
      return res.status(422).json({ message: "Aluno não encontrado." });
    }

    const matriculaExist = await Matriculas.findOne({
      where: {
        aluno_id,
        disciplina_id,
      },
    });

    if (!matriculaExist) {
      return res.status(422).json({ message: "Matricula não encontrada." });
    }

    const notaExistente = await Notas.findOne({
      where: {
        aluno_id,
        disciplina_id,
        bimestre,
      },
    });

    if (notaExistente) {
      return res.status(409).json({
        message: "Já existe uma nota lançada para este aluno neste bimestre.",
      });
    }

    try {
      const novaNota = await Notas.create({
        aluno_id,
        disciplina_id,
        bimestre,
        valor_nota,
      });

      return res
        .status(201)
        .json({ message: "Nota lançada com sucesso!", novaNota });
    } catch (error) {
      Logger.error(`Erro ao postar notas no banco: ${error}`);
      return res.status(500).json({ message: "Erro ao postar nota." });
    }
  }

  static async uploadMaterial(req, res) {
    const professor = req.professor;

    try {
      // passo 1: gera URL
      const { nomeArquivo, tipoArquivo, descricao, titulo, disciplina_id } =
        req.body;

      if (
        !nomeArquivo ||
        !tipoArquivo ||
        !descricao ||
        !titulo ||
        !disciplina_id
      ) {
        return res
          .status(422)
          .json({ message: "Todos os campos são obrigatórios!" });
      }

      const disciplinaProfessor = await Disciplina.findOne({
        where: {
          ID: disciplina_id,
          professor_id: professor.ID,
        },
      });

      if (!disciplinaProfessor) {
        return res.status(403).json({
          message:
            "Você não tem permissão para lançar materiais nesta disciplina, ou disciplina não encontrada.",
        });
      }

      const { uploadUrl, publicUrl, key } = await generateUrl(
        nomeArquivo,
        tipoArquivo
      );

      // passo 2: salva o registro no banco
      await Materiaisaula.create({
        disciplina_id,
        titulo,
        descricao,
        arquivo_url: key,
      });

      return res.status(201).json({
        message: "URL gerada com sucesso!",
        uploadUrl,
        publicUrl,
        key,
      });
    } catch (error) {
      Logger.error(`Erro ao postar material no banco: ${error}`);
      return res.status(500).json({ error: "Erro ao enviar material" });
    }
  }

  // EDIT FUNCTIONS
  static async editNota(req, res) {
    const { aluno_id, disciplina_id, bimestre, valor_nota } = req.body;

    // validation
    if (!aluno_id || !disciplina_id || !bimestre || !valor_nota) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    const professor = req.professor;

    const disciplinaProfessor = await Disciplina.findOne({
      where: {
        ID: disciplina_id,
        professor_id: professor.ID,
      },
    });

    if (!disciplinaProfessor) {
      return res.status(403).json({
        message: "Você não tem permissão para editar notas desta disciplina.",
      });
    }

    const alunoExiste = await Aluno.findByPk(aluno_id);
    if (!alunoExiste) {
      return res.status(422).json({ message: "Aluno não encontrado." });
    }

    const notaExists = await Notas.findOne({
      where: {
        aluno_id,
        disciplina_id,
        bimestre,
      },
    });

    if (!notaExists) {
      return res.status(422).json({
        message: "Não existe nota deste aluno.",
      });
    }

    try {
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
      return res.status(200).json({
        message: "Nota atualizada com sucesso!",
      });
    } catch (error) {
      Logger.error(`Erro ao editar notas no banco: ${error}`);
      res.status(500).json({
        message: "Erro ao editar nota deste aluno.",
      });
    }
  }

  static async editFrequencia(req, res) {
    const { aluno_id, disciplina_id, data, presente } = req.body;

    // validation
    if (!aluno_id || !disciplina_id || !data || presente === undefined) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    const professor = req.professor;

    const disciplinaProfessor = await Disciplina.findOne({
      where: {
        ID: disciplina_id,
        professor_id: professor.ID,
      },
    });

    if (!disciplinaProfessor) {
      return res.status(403).json({
        message:
          "Você não tem permissão para editar frequências nesta disciplina.",
      });
    }

    const alunoExiste = await Aluno.findByPk(aluno_id);

    if (!alunoExiste) {
      return res.status(422).json({ message: "Aluno não encontrado." });
    }

    const frequenciaExist = await Frequencia.findOne({
      where: {
        aluno_id,
        disciplina_id,
        data,
      },
    });

    if (!frequenciaExist) {
      return res
        .status(422)
        .json({ message: "Frequência não encontrada para edição." });
    }

    try {
      await Frequencia.update(
        {
          presente,
        },
        {
          where: { ID: frequenciaExist.ID }, // IMPORTANTE: Atualiza pelo id do usuário
        }
      );
      return res.status(200).json({
        message: "Frequência editada com sucesso!",
      });
    } catch (error) {
      Logger.error(`Erro ao editar frequência no banco: ${error}`);
      return res.status(500).json({
        message: "Erro ao encontrar frequência.",
      });
    }
  }

  static async editMaterial(req, res) {
    const { idMaterial, nomeArquivo, tipoArquivo, titulo, descricao } =
      req.body;
    try {

      if (
        !idMaterial ||
        !nomeArquivo ||
        !tipoArquivo ||
        !descricao ||
        !titulo
      ) {
        return res
          .status(422)
          .json({ message: "Todos os campos são obrigatórios!" });
      }

      const material = await Materiaisaula.findByPk(idMaterial);

      if (!material)
        return res.status(422).json({ message: "Material não encontrado." });

      const materialProfessor = await Disciplina.findOne({
        where: {
          professor_id: req.professor.ID,
          ID: material.disciplina_id,
        },
      });

      if (!materialProfessor) {
        return res
          .status(422)
          .json({
            message: "Material não encontrado, ou permissão insuficiente.",
          });
      }
      // gerar nova URL
      const { uploadUrl, publicUrl, key } = await generateUrl(
        nomeArquivo,
        tipoArquivo
      );

      // atualizar no banco
      material.arquivo_url = key;
      material.titulo = titulo;
      material.descricao = descricao;
      await material.save();

      return res.json({ uploadUrl, publicUrl, key });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar material" });
    }
  }

  // DELETE FUNCTIONS
  static async deleteNota(req, res) {
    const id = req.params.id;
    const professor = req.professor;

    const notaExistente = await Notas.findOne({
      where: {
        ID: id,
      },
    });

    if (!notaExistente) {
      return res.status(422).json({
        message: "Nota não existente.",
      });
    }

    const disciplinaProfessor = await Disciplina.findOne({
      where: {
        ID: notaExistente.disciplina_id,
        professor_id: professor.ID,
      },
    });

    if (!disciplinaProfessor) {
      return res.status(403).json({
        message: "Você não tem permissão para deletar notas nesta disciplina.",
      });
    }

    try {
      await notaExistente.destroy();
      res.status(200).json({ message: "Nota removida com sucesso." });
    } catch (error) {
      Logger.error(`Erro ao remover a nota no banco: ${error}`);
      res
        .status(500)
        .json({ message: "Erro interno ao tentar remover a nota." });
    }
  }

  static async deleteFrequencia(req, res) {
    const id = req.params.id;
    const professor = req.professor;

    const frequenciaExistente = await Frequencia.findOne({
      where: {
        ID: id,
      },
    });

    if (!frequenciaExistente) {
      return res.status(422).json({
        message: "Frequência não existente.",
      });
    }

    const disciplinaProfessor = await Disciplina.findOne({
      where: {
        ID: frequenciaExistente.disciplina_id,
        professor_id: professor.ID,
      },
    });

    if (!disciplinaProfessor) {
      return res.status(403).json({
        message:
          "Você não tem permissão para remover frequências nesta disciplina.",
      });
    }

    try {
      await frequenciaExistente.destroy();
      res.status(200).json({ message: "Frequência removida com sucesso." });
    } catch (error) {
      Logger.error(`Erro ao remover a frequência no banco: ${error}`);
      res
        .status(500)
        .json({ message: "Erro interno ao tentar remover a frequência." });
    }
  }

  static async deleteMaterial(req, res) {
    const { id } = req.params;

    try {
      const material = await Materiaisaula.findByPk(id);

      if (!material) {
        return res.status(422).json({ message: "Material não encontrado." });
      }

      const materialProfessor = await Disciplina.findOne({
        where: {
          professor_id: req.professor.ID,
          ID: material.disciplina_id,
        },
      });

      if (!materialProfessor) {
        return res.status(422).json({ message: "Material não encontrado." });
      }

      await material.destroy();

      return res
        .status(200)
        .json({ message: "Material removido com sucesso." });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar material." });
    }
  }
}
