import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';
import GameButton from '../components/GameButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.user.userType === 'professor') {
        navigate('/professor');
      } else {
        navigate('/aluno');
      }
    } catch (err) {
      setError(err.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-ufpa-600 to-ufpa-800 opacity-20 -z-10"></div>

      <div className="w-full max-w-md">
        {/* Card Principal */}
        <div className="glass-card p-8 sm:p-10 shadow-premium">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <img 
              src="/study-ranking-logo.png" 
              alt="Study Ranking" 
              className="h-16 w-16 mx-auto mb-4 drop-shadow-lg"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-ufpa-600 to-ufpa-800 bg-clip-text text-transparent mb-2">
              Study Ranking
            </h1>
            <p className="text-gray-600 text-sm">
              Gamificação do Ensino - UFPA
            </p>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-3 animate-pulse">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📧 Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@ufpa.edu.br"
                className="w-full px-4 py-3 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                🔐 Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
                required
              />
            </div>

            {/* Botão de Entrar */}
            <GameButton
              type="submit"
              disabled={loading}
              variant="primary"
              size="lg"
              className="w-full mt-6"
              icon={<LogIn size={20} />}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </GameButton>
          </form>

          {/* Separador */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-xs font-medium">OU</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Link para Registro */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3">
              Não tem conta ainda?
            </p>
            <Link 
              to="/register" 
              className="inline-block w-full"
            >
              <GameButton
                variant="secondary"
                size="md"
                className="w-full"
              >
                Criar Conta
              </GameButton>
            </Link>
          </div>

          {/* Link para Home */}
          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-ufpa-600 hover:text-ufpa-700 text-sm font-medium transition"
            >
              ← Voltar à página inicial
            </Link>
          </div>
        </div>

        {/* Dica de Segurança */}
        <div className="mt-6 text-center text-xs text-gray-600">
          <p>🔒 Sua segurança é importante. Nunca compartilhe sua senha.</p>
        </div>
      </div>
    </div>
  );
}
