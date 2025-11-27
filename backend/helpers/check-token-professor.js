import jwt from "jsonwebtoken";
import Logger from "../db/logger.js";
import User from "../models/User.js";
import Professores from "../models/Professores.js";

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

    const professor = await Professores.findOne({
      where: { usuario_id: user.ID },
    });

    if (!professor) {
      return res.status(403).json({
        message: "Acesso negado. Perfil de professor não encontrado.",
      });
    }

    req.user = user;
    req.professor = professor;

    next();
  } catch (err) {
    Logger.error(`O Token é inválido: ${err}`);
    res.status(400).json({ message: "O Token é inválido." });
  }
};

export default checkToken;
