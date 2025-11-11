import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// get user by jwt token
const getUserByToken = async (token) => {
  if (!token) return res.status(401).json({ error: "Acesso negado!" });

  // find user
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userId = decoded.id;

  const user = await User.findOne({ where: { email: userId } });

  return user;
};

export default getUserByToken;