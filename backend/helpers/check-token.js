import jwt from 'jsonwebtoken';
import Logger from "../db/logger.js";

// middleware to validate token
const checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // to continue the flow
  } catch (err) {
    Logger.error(`O Token é inválido: ${err}`)
    res.status(400).json({ message: "O Token é inválido!" });
  }
};

export default checkToken;