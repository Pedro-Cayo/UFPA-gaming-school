import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateToken } from '../helpers/auth.js';
import { isValidCNPJ, isValidMatricula, isValidEmail, isValidPhone } from '../helpers/validators.js';

export async function register(req, res) {
  try {
    const { name, email, password, phone, userType, cnpj, matricula } = req.body;
    
    // Validações básicas
    if (!name || !email || !password || !phone || !userType) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Telefone inválido' });
    }
    
    if (userType === 'professor') {
      if (!cnpj || !isValidCNPJ(cnpj)) {
        return res.status(400).json({ error: 'CNPJ inválido' });
      }
    } else if (userType === 'aluno') {
      if (!matricula || !isValidMatricula(matricula)) {
        return res.status(400).json({ error: 'Matrícula deve conter 12 dígitos' });
      }
    } else {
      return res.status(400).json({ error: 'Tipo de usuário inválido' });
    }
    
    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar usuário
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      userType,
      cnpj: userType === 'professor' ? cnpj : undefined,
      matricula: userType === 'aluno' ? matricula : undefined
    });
    
    await user.save();
    
    // Gerar token
    const token = generateToken(user);
    
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });
    
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      },
      token
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha obrigatórios' });
    }
    
    // Encontrar usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    // Gerar token
    const token = generateToken(user);
    
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
    });
    
    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        photoUrl: user.photoUrl
      },
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

export async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logout realizado com sucesso' });
}

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ error: 'Erro ao obter perfil' });
  }
}
