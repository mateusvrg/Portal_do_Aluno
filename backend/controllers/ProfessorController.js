import User from "../models/User.js";
import Professor from "../models/Professores.js";
// import Aluno from "../models/Aluno.js";
import bcrypt from "bcryptjs";
// import Logger from "../db/logger.js";
// import createUserToken from "../helpers/create-user-token.js";
import getToken from "../helpers/get-token.js";
import jwt from "jsonwebtoken";
import getUserByToken from "../helpers/get-user-by-token.js";
import Turma from "../models/Turma.js";
import ProfessoresTurmas from "../models/ProfessoresTurmas.js";

export default class ProfessorController {
  static async getMinhaTurma(req, res) {
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
          professor_id: professor.ID // substitua pela variável apropriada
        },
        include: [{
          model: Turma,
          attributes: ["nome_turma", "ano_letivo"]   
        }]
      });

      // return data
      return res.status(200).json({
        minhasTurmas
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao buscar turmas." });
    }
  }
}
