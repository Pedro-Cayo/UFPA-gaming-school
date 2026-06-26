import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { disciplineService, questionnaireService, answerService } from '../services/api';
import { BookOpen, Trophy, Zap, Star, Play, Eye } from 'lucide-react';
import GameCard from '../components/GameCard';
import GameHeader from '../components/GameHeader';
import GameButton from '../components/GameButton';

export default function StudentDisciplineDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [discipline, setDiscipline] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [completedQuestionnaires, setCompletedQuestionnaires] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.userType !== 'aluno') {
      navigate('/login');
      return;
    }
    loadData();
  }, [id, user, navigate]);

  const loadData = async () => {
    try {
      // 1. Carrega disciplina e questionários (Se falhar aqui, cai no catch principal)
      const [disciplineRes, questionnairesRes] = await Promise.all([
        disciplineService.getById(id),
        questionnaireService.getByDiscipline(id)
      ]);

      setDiscipline(disciplineRes.data);
      setQuestionnaires(questionnairesRes.data);

      // 2. Tenta carregar o histórico ISOLADAMENTE
      // Se isso der erro (como 401 ou 500), não vai explodir a tela do aluno
      try {
        const myAnswersRes = await answerService.getMyAnswers();
        if (myAnswersRes?.data && Array.isArray(myAnswersRes.data)) {
          const completedIds = new Set(
            myAnswersRes.data.map(answer => 
              answer.questionnaireId?._id || answer.questionnaireId
            )
          );
          setCompletedQuestionnaires(completedIds);
        }
      } catch (historyError) {
        console.warn('Não foi possível carregar o histórico de respostas:', historyError);
      }

    } catch (error) {
      console.error('Erro ao carregar dados da disciplina:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <GameHeader title="Carregando..." showLogo={true} showBack={true} backTo="/aluno" />
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
        <GameHeader title="Erro" showLogo={true} showBack={true} backTo="/aluno" />
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
        backTo="/aluno"
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

        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to={`/aluno/disciplina/${id}/ranking`}>
              <GameCard glass className="p-8 h-full hover:shadow-glow transition cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">🏆</div>
                  <div>
                    <h3 className="text-2xl font-bold text-ufpa-800 mb-1">Ranking</h3>
                    <p className="text-gray-600 text-sm">Veja sua posição nesta disciplina</p>
                  </div>
                </div>
              </GameCard>
            </Link>
            <GameCard glass className="p-8">
              <div className="flex items-center gap-4">
                <div className="text-5xl">📊</div>
                <div>
                  <h3 className="text-2xl font-bold text-ufpa-800 mb-1">Questionários</h3>
                  <p className="text-gray-600 text-sm">{questionnaires.length} disponíveis para responder</p>
                </div>
              </div>
            </GameCard>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="text-ufpa-700" size={28} />
            Questionários Disponíveis
          </h2>

          {questionnaires.length === 0 ? (
            <GameCard glass className="p-12 text-center">
              <Star className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 font-medium text-lg">Nenhum questionário disponível</p>
              <p className="text-gray-500 text-sm mt-2">Verifique mais tarde ou com seu professor</p>
            </GameCard>
          ) : (
            <div className="space-y-4">
              {questionnaires.map((questionnaire) => {
                const isCompleted = completedQuestionnaires.has(questionnaire._id);

                return (
                  <GameCard key={questionnaire._id} glass className="p-6 hover:shadow-glow transition group">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl flex-shrink-0">📝</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-ufpa-800 transition truncate">
                              {questionnaire.title}
                            </h3>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1 badge-achievement">
                                📝 {questionnaire.questions?.length || 0} questões
                              </span>
                              <span className="flex items-center gap-1 badge-achievement">
                                ⭐ {questionnaire.totalPoints || 0} pontos
                              </span>
                              {isCompleted && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 font-bold rounded-md">
                                  ✓ Concluído
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/aluno/responder/${questionnaire._id}`}
                        className="flex-shrink-0"
                      >
                        {isCompleted ? (
                          <GameButton variant="outline" size="md" icon={<Eye size={18} />} className="whitespace-nowrap">
                            Visualizar
                          </GameButton>
                        ) : (
                          <GameButton variant="primary" size="md" icon={<Play size={18} />} className="whitespace-nowrap">
                            Responder
                          </GameButton>
                        )}
                      </Link>
                    </div>
                  </GameCard>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}