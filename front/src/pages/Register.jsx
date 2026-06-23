import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="min-h-screen bg-gradient-to-br from-ufpa-600 to-ufpa-800 flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-ufpa-700 mb-8">
            Criar Conta
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de Usuário */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tipo de Usuário</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="aluno"
                    checked={userType === 'aluno'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mr-2"
                  />
                  <span>Aluno</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="professor"
                    checked={userType === 'professor'}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mr-2"
                  />
                  <span>Professor</span>
                </label>
              </div>
            </div>

            {/* Nome */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nome Completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
                required
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Telefone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
                required
              />
            </div>

            {/* Matrícula (para ambos) */}
<div>
  <label className="block text-gray-700 font-semibold mb-2">Matrícula</label>
  <input
    type="text"
    name="matricula"
    value={formData.matricula}
    onChange={handleChange}
    placeholder="000000000000"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
    required
  />
  <p className="text-xs text-gray-500 mt-1">12 dígitos</p>
</div>

            {/* Senha */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-ufpa-600 to-ufpa-700 text-white font-semibold py-2 rounded-lg hover:from-ufpa-700 hover:to-ufpa-800 transition disabled:opacity-50"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">Já tem conta?</p>
            <Link to="/login" className="text-ufpa-600 font-semibold hover:text-ufpa-700">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
