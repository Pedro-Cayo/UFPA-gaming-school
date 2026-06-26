import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { disciplineService, questionnaireService } from '../services/api';
import { Trophy, FileText, Zap, Star } from 'lucide-react';
import GameCard from '../components/GameCard';
import GameHeader from '../components/GameHeader';

export default function DisciplineQuestionnaireSelector() {
  const params = useParams();
  const disciplineId = params.disciplineId || params.id; // Suporte a múltiplos nomes de parâmetro
  const { user } = useAuth();
  const navigate = useNavigate();
  const [discipline, setDiscipline] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [disciplineId, user, navigate]);

  const loadData = async () => {
    try {
      const [disciplineRes, questionnairesRes] = await Promise.all([
        disciplineService.getById(disciplineId),
        questionnaireService.getByDiscipline(disciplineId)
      ]);
      setDiscipline(disciplineRes.data);
      setQuestionnaires(questionnairesRes.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <GameHeader 
          title="Carregando..."
          showLogo={true}
          showBack={true}
          backTo={user?.userType === 'professor' ? '/professor' : '/aluno'}
        />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="inline-block animate-spin mb-4">
              <Zap className="text-ufpa-600" size={32} />
            </div>
            <p className="text-gray-600 font-medium">Carregando rankings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Gamificado */}
      <GameHeader 
        title={`Rankings - ${discipline?.name || 'Carregando...'}`}
        subtitle={discipline?.code || ''}
        showLogo={true}
        showBack={true}
        backTo={user?.userType === 'professor' ? '/professor' : '/aluno'}
        icon={<Trophy size={32} />}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Ranking Geral */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="text-gamify-gold" size={28} />
              Ranking Geral
            </h2>
            <Link
              to={`/aluno/disciplina/${disciplineId}/ranking`}
              className="block"
            >
              <GameCard glass className="p-8 hover:shadow-glow transition cursor-pointer group">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">🏆</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-ufpa-700 group-hover:text-ufpa-800 transition mb-2">
                      Ranking Geral — {discipline?.name}
                    </h3>
                    <p className="text-gray-600">
                      Ranking com a soma de todos os questionários respondidos nesta disciplina
                    </p>
                  </div>
                  <div className="text-2xl group-hover:scale-110 transition">→</div>
                </div>
              </GameCard>
            </Link>
          </div>

          {/* Questionários Específicos */}
          {questionnaires.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="text-ufpa-600" size={28} />
                Rankings por Questionário
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questionnaires.map((questionnaire, index) => (
                  <Link
                    key={questionnaire._id}
                    to={`/aluno/disciplina/${disciplineId}/ranking?questionnaireId=${questionnaire._id}`}
                  >
                    <GameCard glass className="p-6 h-full hover:shadow-glow transition cursor-pointer group">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl flex-shrink-0">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && '❓'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-ufpa-700 transition truncate">
                            {questionnaire.title}
                          </h4>
                          {questionnaire.description && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {questionnaire.description}
                            </p>
                          )}
                          <div className="flex gap-3 mt-3 text-xs">
                            <span className="badge-achievement">
                              📝 {questionnaire.questions.length} questões
                            </span>
                            <span className="badge-achievement">
                              ⭐ {questionnaire.totalPoints} pontos
                            </span>
                          </div>
                        </div>
                      </div>
                    </GameCard>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {questionnaires.length === 0 && (
            <GameCard glass className="p-12 text-center">
              <Star className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 font-medium text-lg">Nenhum questionário encontrado</p>
              <p className="text-gray-500 text-sm mt-2">Verifique com seu professor ou volte mais tarde</p>
            </GameCard>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>📊 Clique em qualquer ranking para ver a posição dos alunos</p>
        </div>
      </main>
    </div>
  );
}
