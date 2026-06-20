import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { disciplineService } from '../services/api';
import { BookOpen, Plus, LogOut, Home } from 'lucide-react';

export default function ProfessorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    if (!user || user.userType !== 'professor') {
      navigate('/login');
      return;
    }
    loadDisciplines();
  }, [user, navigate]);

  const loadDisciplines = async () => {
    try {
      const response = await disciplineService.getMyDisciplines();
      setDisciplines(response.data);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscipline = async (e) => {
    e.preventDefault();
    try {
      await disciplineService.create(formData);
      setFormData({ name: '', code: '', description: '' });
      setShowForm(false);
      loadDisciplines();
    } catch (error) {
      console.error('Erro ao criar disciplina:', error);
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
          <h1 className="text-3xl font-bold">Painel do Professor</h1>
            <div className="flex items-center gap-4">
            <span className="text-sm">{user?.name}</span>
            <Link
              to="/"
              className="flex items-center gap-2 bg-ufpa-400 hover:bg-ufpa-500 px-4 py-2 rounded-lg transition font-semibold"
            >
              <BookOpen size={18} />
              Home
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
        {/* Create Discipline Section */}
        <div className="mb-8">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-ufpa-600 to-ufpa-700 text-white px-6 py-3 rounded-lg hover:from-ufpa-700 hover:to-ufpa-800 transition font-semibold"
            >
              <Plus size={20} />
              Nova Disciplina
            </button>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-ufpa-700 mb-4">Criar Nova Disciplina</h2>
              <form onSubmit={handleCreateDiscipline} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nome</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Código</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
                    rows="3"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition font-semibold"
                  >
                    Criar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Disciplines List */}
        <div>
          <h2 className="text-2xl font-bold text-ufpa-700 mb-6">Minhas Disciplinas</h2>
          {loading ? (
            <div className="text-center text-gray-600">Carregando...</div>
          ) : disciplines.length === 0 ? (
            <div className="text-center text-gray-600 bg-white rounded-lg p-8">
              Nenhuma disciplina criada ainda
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {disciplines.map((discipline) => (
                <Link
                  key={discipline._id}
                  to={`/professor/disciplina/${discipline._id}`}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition transform cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <BookOpen className="text-ufpa-600" size={28} />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-ufpa-700">{discipline.name}</h3>
                      <p className="text-sm text-gray-600">{discipline.code}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{discipline.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
