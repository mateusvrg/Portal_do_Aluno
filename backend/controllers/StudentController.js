import Logger from "../db/logger.js";
import Notas from "../models/Notas.js";
import Frequencia from "../models/Frequencia.js";
import Avisos from "../models/Avisos.js";
import Matriculas from "../models/Matriculas.js";
import Horarios from "../models/Horarios.js";
import { Op } from "sequelize";

export default class StudentController {
  static async minhasNotas(req, res) {
    const aluno = req.aluno;

    try {
      const notasExists = await Notas.findAll({
        where: { aluno_id: aluno.ID },
      });

      if (notasExists.length === 0) {
        return res.status(404).json({
          message: "Notas não encontradas.",
        });
      }

      return res.status(200).json({
        notas: notasExists,
      });
    } catch (error) {
      Logger.error(`Erro encontrar notas. ${error}`);
      res.status(500).json({ message: error });
    }
  }

  static async minhasFrequencias(req, res) {
    const aluno = req.aluno;

    try {
      const frequenciaExists = await Frequencia.findAll({
        where: { aluno_id: aluno.ID },
      });

      if (frequenciaExists.length === 0) {
        return res.status(404).json({
          message: "Frequência não encontradas.",
        });
      }

      return res.status(200).json({
        notas: frequenciaExists,
      });
    } catch (error) {
      Logger.error(`Erro encontrar frequência. ${error}`);
      res.status(500).json({ message: error });
    }
  }

  static async listAvisos(req, res) {
    req.user;
    try {
      const avisosExists = await Avisos.findAll();

      if (avisosExists.length === 0) {
        return res.status(404).json({
          message: "Avisos não encontrados.",
        });
      }

      return res.status(200).json({
        avisos: avisosExists,
      });
    } catch (error) {
      Logger.error(`Erro encontrar avisos. ${error}`);
      res.status(500).json({ message: error });
    }
  }

  static async meusHorarios(req, res) {
    const aluno = req.aluno;
    try {
      const disciplinasMatriculadas = await Matriculas.findAll({
        where: { aluno_id: aluno.ID },
        attributes: ["disciplina_id"], // pega somente esse campo
      });

      if (disciplinasMatriculadas.length == 0) {
        return res.status(404).json({
          message:
            "Disciplinas não encontrados ou você não está matriculado em nenhuma disciplina.",
        });
      }

      const horarios = await Horarios.findAll({
        where: {
          disciplina_id: {
            [Op.in]: disciplinasMatriculadas.map((d) => d.disciplina_id),
          },
        },
      });

      return res.status(200).json({
        horarios,
      });
    } catch (error) {
      Logger.error(`Erro encontrar horarios. ${error}`);
      res.status(500).json({ message: error });
    }
  }
}
