import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';
import GameButton from '../components/GameButton';

export default function Register() {
  const [userType, setUserType] = useState('aluno');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    matricula: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        userType,
        matricula: formData.matricula
      };

      await register(data);
      
      if (userType === 'professor') {
        navigate('/professor');
      } else {
        navigate('/aluno');
      }
    } catch (err) {
      setError(err.error || 'Erro ao registrar');
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-ufpa-600 to-ufpa-800 bg-clip-text text-transparent mb-2">
              Criar Conta
            </h1>
            <p className="text-gray-600 text-sm">
              Junte-se à gamificação do ensino
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de Usuário */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-sm">
                👤 Tipo de Usuário
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition ${
                  userType === 'aluno' 
                    ? 'border-ufpa-600 bg-ufpa-50' 
                    : 'border-gray-200 bg-white hover:border-ufpa-300'
                }`}>
                  <input
                    type="radio"
                    value="aluno"
                    checked={userType === 'aluno'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-sm">🎓 Aluno</span>
                </label>
                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition ${
                  userType === 'professor' 
                    ? 'border-ufpa-600 bg-ufpa-50' 
                    : 'border-gray-200 bg-white hover:border-ufpa-300'
                }`}>
                  <input
                    type="radio"
                    value="professor"
                    checked={userType === 'professor'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-sm">👨‍🏫 Professor</span>
                </label>
              </div>
            </div>

            {/* Nome */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📝 Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                className="w-full px-4 py-3 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📧 Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@ufpa.edu.br"
                className="w-full px-4 py-3 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
                required
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📱 Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                className="w-full px-4 py-3 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
                required
              />
            </div>

            {/* Matrícula */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                🎫 Matrícula
              </label>
              <input
                type="text"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
                placeholder="000000000000"
                maxLength="12"
                className="w-full px-4 py-3 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
                required
              />
              <p className="text-xs text-gray-500 mt-1">12 dígitos</p>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                🔐 Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crie uma senha segura"
                className="w-full px-4 py-3 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
                required
              />
            </div>

            {/* Botão de Registro */}
            <GameButton
              type="submit"
              disabled={loading}
              variant="primary"
              size="lg"
              className="w-full mt-6"
              icon={<UserPlus size={20} />}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </GameButton>
          </form>

          {/* Separador */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-xs font-medium">OU</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Link para Login */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3">
              Já tem conta?
            </p>
            <Link 
              to="/login" 
              className="text-ufpa-600 hover:text-ufpa-700 font-medium transition"
            >
              Faça login aqui
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
          <p>🔒 Seus dados são protegidos e seguros.</p>
        </div>
      </div>
    </div>
  );
}
