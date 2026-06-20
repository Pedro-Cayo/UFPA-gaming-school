import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { disciplineService } from '../services/api';
import { BookOpen, Trophy, LogOut, Home } from 'lucide-react';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.userType !== 'aluno') {
      navigate('/login');
      return;
    }
    loadDisciplines();
  }, [user, navigate]);

  const loadDisciplines = async () => {
    try {
      const response = await disciplineService.getAll();
      setDisciplines(response.data);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ufpa-50 to-ufpa-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-ufpa-600 to-ufpa-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Painel do Aluno</h1>
                    <div className="flex items-center gap-4">
            <span className="text-sm">{user?.name}</span>
            <Link
              to="/"
              className="flex items-center gap-2 bg-ufpa-400 hover:bg-ufpa-500 px-4 py-2 rounded-lg transition font-semibold"
            >
              <Home size={18} />
              Home
            </Link>
            <Link
              to="/aluno/perfil"
              className="bg-ufpa-500 hover:bg-ufpa-600 px-4 py-2 rounded-lg transition font-semibold"
            >
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Rankings Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/aluno/ranking-geral"
            className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition transform"
          >
            <div className="flex items-center gap-3">
              <Trophy size={32} />
              <div>
                <h3 className="text-xl font-bold">Ranking Geral</h3>
                <p className="text-sm opacity-90">Veja sua posição no ranking geral</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Disciplines List */}
        <div>
          <h2 className="text-2xl font-bold text-ufpa-700 mb-6">Disciplinas Disponíveis</h2>
          {loading ? (
            <div className="text-center text-gray-600">Carregando...</div>
          ) : disciplines.length === 0 ? (
            <div className="text-center text-gray-600 bg-white rounded-lg p-8">
              Nenhuma disciplina disponível
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {disciplines.map((discipline) => (
                <Link
                  key={discipline._id}
                  to={`/aluno/disciplina/${discipline._id}`}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition transform cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <BookOpen className="text-ufpa-600" size={28} />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-ufpa-700">{discipline.name}</h3>
                      <p className="text-sm text-gray-600">{discipline.code}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{discipline.description}</p>
                  <div className="text-sm text-ufpa-600 font-semibold">
                    Professor: {discipline.professorId?.name}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
