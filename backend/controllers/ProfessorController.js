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

export default class ProfessorController {
  static async register(req, res) {
    
  }
}
