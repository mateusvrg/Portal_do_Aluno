import jwt from "jsonwebtoken";
import Logger from "../db/logger.js";
import User from "../models/User.js";
import Aluno from "../models/Aluno.js";

// middleware to validate token
const checkToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Acesso negado." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(verified.id_number);

    if (!user) {
      return res.status(401).json({ message: "Usuário inválido." });
    }

    const aluno = await Aluno.findOne({ where: { usuario_id: user.ID } });

    if (!aluno) {
      return res
        .status(404)
        .json({ message: "Acesso negado. Perfil de aluno não encontrado." });
    }

    req.user = user;
    req.aluno = aluno;

    next();
  } catch (err) {
    Logger.error(`O Token é inválido: ${err}`);
    res.status(400).json({ message: "O Token é inválido." });
  }
};

export default checkToken;
