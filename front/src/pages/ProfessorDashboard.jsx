import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { disciplineService, questionnaireService, answerService } from '../services/api';
import { BookOpen, Plus, LogOut, Home, Zap, Star, X, Pencil, Trash2 } from 'lucide-react';
import GameButton from '../components/GameButton';
import GameCard from '../components/GameCard';
import GameHeader from '../components/GameHeader';

export default function ProfessorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDisciplineId, setCurrentDisciplineId] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ questionnaires: 0, students: 0 });

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
      const myDisciplines = response.data;
      setDisciplines(myDisciplines);

      let totalQ = 0;
      const uniqueStudentIds = new Set();

      const questionnairesPromises = myDisciplines.map(d => questionnaireService.getByDiscipline(d._id));
      const rankingsPromises = myDisciplines.map(d => answerService.getRankingByDiscipline(d._id));

      const [allQRes, allRRes] = await Promise.all([
        Promise.all(questionnairesPromises),
        Promise.all(rankingsPromises)
      ]);
      
      allQRes.forEach(res => {
        totalQ += res.data.length;
      });

      allRRes.forEach(res => {
        res.data.forEach(student => {
          uniqueStudentIds.add(student._id);
        });
      });

      setStats({
        questionnaires: totalQ,
        students: uniqueStudentIds.size
      });

    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDiscipline = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEditing) {
        // Certifique-se de que seu disciplineService possui o método update
        await disciplineService.update(currentDisciplineId, formData);
      } else {
        await disciplineService.create(formData);
      }
      resetForm();
      loadDisciplines();
    } catch (error) {
      setError(error.message || 'Erro ao salvar disciplina');
    }
  };

  const handleEditClick = (e, discipline) => {
    e.preventDefault(); // Evita navegar para o link do card
    setIsEditing(true);
    setCurrentDisciplineId(discipline._id);
    setFormData({
      name: discipline.name,
      code: discipline.code,
      description: discipline.description || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a página para o formulário
  };

  const handleDeleteDiscipline = async (e, id) => {
    e.preventDefault(); // Evita navegar para o link do card
    if (window.confirm('Tem certeza que deseja deletar esta disciplina? Esta ação não pode ser desfeita.')) {
      try {
        // Certifique-se de que seu disciplineService possui o método delete ou similar
        await disciplineService.delete(id); 
        loadDisciplines();
      } catch (error) {
        alert(error.message || 'Erro ao deletar disciplina');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', description: '' });
    setShowForm(false);
    setIsEditing(false);
    setCurrentDisciplineId(null);
    setError('');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Header Gamificado */}
      <GameHeader 
        title="Painel do Professor"
        subtitle={`Bem-vindo, ${user?.name}! 📚`}
        showLogo={true}
        showBack={false}
        showHome={true}
        icon={<BookOpen size={32} />}
      >
        <button
          onClick={handleLogout}
          className="btn-game btn-game-primary text-sm"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </GameHeader>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <GameCard glass className="p-6 text-center">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-gray-600 text-sm mb-1">Disciplinas</p>
            <p className="text-3xl font-bold text-ufpa-700">{disciplines.length}</p>
          </GameCard>
          <GameCard glass className="p-6 text-center">
            <div className="text-4xl mb-2">❓</div>
            <p className="text-gray-600 text-sm mb-1">Questionários</p>
            <p className="text-3xl font-bold text-gamify-gold">{stats.questionnaires}</p>
          </GameCard>
          <GameCard glass className="p-6 text-center">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-gray-600 text-sm mb-1">Alunos</p>
            <p className="text-3xl font-bold text-ufpa-700">{stats.students}</p>
          </GameCard>
        </div>

        {/* Create/Edit Discipline Section */}
        <div className="mb-12">
          {!showForm ? (
            <GameButton
              variant="success"
              size="lg"
              icon={<Plus size={20} />}
              onClick={() => setShowForm(true)}
              className="mb-4"
            >
              Criar Nova Disciplina
            </GameButton>
          ) : (
            <GameCard glass className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Editar Disciplina' : 'Criar Nova Disciplina'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
                >
                  <X size={24} />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSaveDiscipline} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    📖 Nome da Disciplina
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Programação em Python"
                    className="w-full px-4 py-3 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    🏷️ Código
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Ex: PROG-001"
                    className="w-full px-4 py-3 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    📝 Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o conteúdo e objetivos da disciplina"
                    className="w-full px-4 py-3 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white resize-none"
                    rows="4"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <GameButton
                    type="submit"
                    variant="success"
                    size="md"
                  >
                    {isEditing ? '✓ Salvar Alterações' : '✓ Criar Disciplina'}
                  </GameButton>
                  <GameButton
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={resetForm}
                  >
                    ✕ Cancelar
                  </GameButton>
                </div>
              </form>
            </GameCard>
          )}
        </div>

        {/* Disciplines List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="text-ufpa-600" size={28} />
            Minhas Disciplinas
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin mb-4">
                <Zap className="text-ufpa-600" size={32} />
              </div>
              <p className="text-gray-600 font-medium">Carregando disciplinas...</p>
            </div>
          ) : disciplines.length === 0 ? (
            <GameCard glass className="p-12 text-center">
              <Star className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 font-medium text-lg">Nenhuma disciplina criada ainda</p>
              <p className="text-gray-500 text-sm mt-2">Clique em "Criar Nova Disciplina" para começar</p>
            </GameCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {disciplines.map((discipline) => (
                <Link
                  key={discipline._id}
                  to={`/professor/disciplina/${discipline._id}`}
                >
                  <GameCard glass className="p-6 h-full cursor-pointer group flex flex-col justify-between">
                    <div>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-ufpa-600 to-ufpa-800 rounded-lg group-hover:shadow-glow transition">
                          <BookOpen className="text-white" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-ufpa-700 transition">
                            {discipline.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-mono">{discipline.code}</p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {discipline.description}
                      </p>
                    </div>

                    {/* Ações e Hover CTA */}
                    <div className="mt-4 pt-4 border-t border-gray-100/50">
                      {/* Botões de Editar e Deletar sempre visíveis */}
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={(e) => handleEditClick(e, discipline)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition"
                        >
                          <Pencil size={14} /> Editar
                        </button>
                        <button
                          onClick={(e) => handleDeleteDiscipline(e, discipline._id)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition"
                        >
                          <Trash2 size={14} /> Deletar
                        </button>
                      </div>

                      {/* Botão de Gerenciar no Hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition duration-200">
                        <GameButton 
                          variant="primary" 
                          size="sm" 
                          className="w-full"
                        >
                          Gerenciar →
                        </GameButton>
                      </div>
                    </div>
                  </GameCard>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}