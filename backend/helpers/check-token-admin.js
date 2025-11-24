import jwt from 'jsonwebtoken';
import Logger from "../db/logger.js";

// middleware to validate token and check admin permission
const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    // Verifica se o usuário é admin
    if (!req.user.typeuser || req.user.typeuser !== "admin") {
      return res.status(403).json({ message: "Acesso negado! Permissão insuficiente." });
    }

    next(); // tudo OK, segue o fluxo

  } catch (err) {
    Logger.error(`O Token é inválido: ${err}`);
    res.status(400).json({ message: "O Token é inválido!" });
  }
};

export default checkToken;