const jwt = require("jsonwebtoken");

const Professor = require("../models/Professor");

// get professor by jwt token
const getUserByToken = async (token) => {
  if (!token) return res.status(401).json({ error: "Acesso negado!" });

  // find professor
  const decoded = jwt.verify(token, "nossosecret");

  const professorId = decoded.id;

  const professor = await Professor.findOne({ _id: professorId });

  return professor;
};

module.exports = getUserByToken;