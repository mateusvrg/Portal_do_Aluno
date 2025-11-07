import jwt from 'jsonwebtoken';

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    // payload data
    {
      name: user.nome,
      id: user.email,
    },
    process.env.JWT_SECRET
  );

  // return token
  res.status(200).json({
    message: "Você está autenticado!",
    token: token,
    userId: user.email,
  });
};

export default createUserToken;