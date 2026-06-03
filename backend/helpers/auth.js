import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_jwt_super_seguro_aqui_2024';

export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      userType: user.userType
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function authenticateToken(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
  
  req.user = decoded;
  next();
}

export function authenticateProfessor(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user.userType !== 'professor') {
      return res.status(403).json({ error: 'Acesso restrito a professores' });
    }
    next();
  });
}

export function authenticateStudent(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user.userType !== 'aluno') {
      return res.status(403).json({ error: 'Acesso restrito a alunos' });
    }
    next();
  });
}
