const jwt = require("jsonwebtoken");

const createUserToken = async (professor, req, res) => {
  const token = jwt.sign(
    // payload data
    {
      name: professor.name,
      id: professor._id,
    },
    "nossosecret"
  );

  // return token
  res.status(200).json({
    message: "Você está autenticado!",
    token: token,
    userId: professor._id,
  });
};

module.exports = createUserToken;