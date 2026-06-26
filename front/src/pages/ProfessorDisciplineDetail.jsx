import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { disciplineService, questionnaireService } from '../services/api';
import { BookOpen, Plus, Zap, Star, Trash2, Eye, Trophy, X, CheckCircle } from 'lucide-react';
import GameCard from '../components/GameCard';
import GameHeader from '../components/GameHeader';
import GameButton from '../components/GameButton';

export default function ProfessorDisciplineDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [discipline, setDiscipline] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para o Modal de Visualização
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    if (!user || user.userType !== 'professor') {
      navigate('/login');
      return;
    }
    loadData();
  }, [id, user, navigate]);

  const loadData = async () => {
    try {
      const [disciplineRes, questionnairesRes] = await Promise.all([
        disciplineService.getById(id),
        questionnaireService.getByDiscipline(id)
      ]);
      setDiscipline(disciplineRes.data);
      setQuestionnaires(questionnairesRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPreview = async (questionnaireId) => {
    setLoadingModal(true);
    try {
      // Usamos getById que traz o questionário completo com as respostas corretas
      const response = await questionnaireService.getById(questionnaireId);
      setSelectedQuestionnaire(response.data);
    } catch (error) {
      console.error('Erro ao carregar pré-visualização:', error);
      alert('Erro ao carregar os detalhes do questionário');
    } finally {
      setLoadingModal(false);
    }
  };

  const handleDeleteQuestionnaire = async (questionnaireId) => {
    if (window.confirm('Tem certeza que deseja excluir este questionário? Esta ação não pode ser desfeita.')) {
      try {
        await questionnaireService.delete(questionnaireId);
        loadData();
      } catch (error) {
        console.error('Erro ao deletar questionário:', error);
        alert('Erro ao deletar questionário');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <GameHeader 
          title="Carregando..."
          showLogo={true}
          showBack={true}
          backTo="/professor"
        />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="inline-block animate-spin mb-4">
              <Zap className="text-ufpa-700" size={32} />
            </div>
            <p className="text-gray-600 font-medium">Carregando disciplina...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!discipline) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <GameHeader 
          title="Erro"
          showLogo={true}
          showBack={true}
          backTo="/professor"
        />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <GameCard glass className="p-12 text-center">
            <Star className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 font-medium text-lg">Disciplina não encontrada</p>
          </GameCard>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <GameHeader 
        title={discipline.name}
        subtitle={discipline.code}
        showLogo={true}
        showBack={true}
        backTo="/professor"
        icon={<BookOpen size={32} />}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {discipline.description && (
          <div className="mb-8">
            <GameCard glass className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="text-ufpa-700" size={28} />
                Sobre a Disciplina
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {discipline.description}
              </p>
            </GameCard>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GameCard glass className="p-6 text-center">
            <div className="text-4xl mb-2">❓</div>
            <p className="text-gray-600 text-sm mb-1">Questionários</p>
            <p className="text-3xl font-bold text-ufpa-800">{questionnaires.length}</p>
          </GameCard>
          <GameCard glass className="p-6 text-center">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-gray-600 text-sm mb-1">Total de Questões</p>
            <p className="text-3xl font-bold text-ufpa-800">
              {questionnaires.reduce((sum, q) => sum + (q.questions?.length || 0), 0)}
            </p>
          </GameCard>
          <GameCard glass className="p-6 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <p className="text-gray-600 text-sm mb-1">Pontos Totais</p>
            <p className="text-3xl font-bold text-gamify-gold">
              {questionnaires.reduce((sum, q) => sum + (q.totalPoints || 0), 0)}
            </p>
          </GameCard>
        </div>

        <div className="mb-8">
          <Link to={`/professor/disciplina/${id}/novo-questionario`}>
            <GameButton
              variant="success"
              size="lg"
              icon={<Plus size={20} />}
            >
              Criar Novo Questionário
            </GameButton>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="text-ufpa-700" size={28} />
            Questionários Criados
          </h2>

          {questionnaires.length === 0 ? (
            <GameCard glass className="p-12 text-center">
              <Star className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 font-medium text-lg">Nenhum questionário criado ainda</p>
              <p className="text-gray-500 text-sm mt-2">Clique em "Criar Novo Questionário" para começar</p>
            </GameCard>
          ) : (
            <div className="space-y-4">
              {questionnaires.map((questionnaire, index) => (
                <GameCard key={questionnaire._id} glass className="p-6 hover:shadow-glow transition group">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl flex-shrink-0">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && '📝'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-ufpa-800 transition truncate">
                            {questionnaire.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                            <span className="badge-achievement">
                              📝 {questionnaire.questions?.length || 0} questões
                            </span>
                            <span className="badge-achievement">
                              ⭐ {questionnaire.totalPoints || 0} pontos
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {/* MODIFICADO: Agora chama a função do Modal passando o ID */}
                      <button
                        onClick={() => handleOpenPreview(questionnaire._id)}
                        disabled={loadingModal}
                        className="btn-game btn-game-secondary p-2 hover:shadow-lg transition flex items-center justify-center text-ufpa-800 border border-ufpa-200"
                        title="Visualizar Questões"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Botão para Visualizar Ranking */}
                      <Link
                        to={`/aluno/disciplina/${id}/ranking?questionnaireId=${questionnaire._id}`}
                        className="btn-game btn-game-secondary p-2 hover:shadow-lg transition flex items-center justify-center text-gamify-gold border border-gray-200"
                        title="Visualizar Ranking"
                      >
                        <Trophy size={18} />
                      </Link>
                      
                      {/* Deletar */}
                      <button
                        onClick={() => handleDeleteQuestionnaire(questionnaire._id)}
                        className="btn-game bg-red-600 hover:bg-red-700 text-white p-2 hover:shadow-lg transition flex items-center justify-center"
                        title="Deletar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </GameCard>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL GAMIFICADO DE PRÉ-VISUALIZAÇÃO --- */}
      {selectedQuestionnaire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-ufpa-700 to-ufpa-900 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span>👁️</span> Visualização: {selectedQuestionnaire.title}
                </h3>
                <p className="text-xs text-gray-200 mt-1">
                  {selectedQuestionnaire.questions?.length || 0} questões • {selectedQuestionnaire.totalPoints || 0} pontos totais
                </p>
              </div>
              <button 
                onClick={() => setSelectedQuestionnaire(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 bg-gray-50/50 flex-1">
              {selectedQuestionnaire.questions?.map((q, qIndex) => (
                <GameCard key={q._id || qIndex} glass className="p-6 border border-gray-200/60 bg-white">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <span className="px-3 py-1 bg-ufpa-100 text-ufpa-800 text-xs font-bold rounded-full">
                      Questão {qIndex + 1} ({q.points} pts)
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-4 leading-relaxed">{q.text}</h4>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {['A', 'B', 'C', 'D', 'E'].map((letter, oIndex) => {
                      const isCorrect = q.correctAnswer === letter;
                      return (
                        <div 
                          key={letter} 
                          className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                            isCorrect 
                              ? 'bg-green-50 border-green-300 text-green-900 font-medium' 
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center ${
                            isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {letter}
                          </span>
                          <span className="text-sm flex-1">{q.options?.[oIndex]}</span>
                          {isCorrect && <CheckCircle size={16} className="text-green-600 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </GameCard>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
              <GameButton
                variant="outline"
                size="md"
                onClick={() => setSelectedQuestionnaire(null)}
              >
                Fechar Visualização
              </GameButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}