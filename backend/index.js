import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/connection.js';

// Importar rotas
import authRoutes from './routes/authRoutes.js';
import disciplineRoutes from './routes/disciplineRoutes.js';
import questionnaireRoutes from './routes/questionnaireRoutes.js';
import answerRoutes from './routes/answerRoutes.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Conectar ao banco de dados
await connectDB();

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/disciplines', disciplineRoutes);
app.use('/api/questionnaires', questionnaireRoutes);
app.use('/api/answers', answerRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor rodando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
});
