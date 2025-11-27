import Logger from "../db/logger.js";
import Aluno from "../models/Aluno.js";
import Notas from "../models/Notas.js";
import getUserByToken from "../helpers/get-user-by-token.js";
import getToken from "../helpers/get-token.js";
import Frequencia from "../models/Frequencia.js";
import Avisos from "../models/Avisos.js";

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
}
