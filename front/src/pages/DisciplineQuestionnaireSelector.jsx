import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { disciplineService, questionnaireService } from '../services/api';
import { ArrowLeft, Trophy, FileText } from 'lucide-react';

export default function DisciplineQuestionnaireSelector() {
  const { disciplineId } = useParams();
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
    return <div className="text-center text-gray-600 py-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ufpa-50 to-ufpa-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-ufpa-600 to-ufpa-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:opacity-80 mb-4 bg-ufpa-500 hover:bg-ufpa-600 px-3 py-2 rounded transition"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          <div className="flex items-center gap-3">
            <Trophy size={32} />
            <div>
              <h1 className="text-3xl font-bold">{discipline?.name}</h1>
              <p className="text-sm opacity-90">{discipline?.code}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Ranking Geral */}
            <Link
              to={`/aluno/disciplina/${disciplineId}/ranking`}
              className="block bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition transform cursor-pointer mb-6"
            >
              <div className="flex items-center gap-4">
                <Trophy size={48} />
                <div>
                  <h3 className="text-2xl font-bold">Ranking Geral — {discipline?.name}</h3>
                  <p className="text-sm opacity-90">Ranking com a soma de todos os questionários</p>
                </div>
              </div>
            </Link>

            {/* Questionários Específicos */}
            {questionnaires.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-ufpa-700 mb-4">Ranking por Questionário</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questionnaires.map((questionnaire) => (
                    <Link
                      key={questionnaire._id}
                      to={`/aluno/disciplina/${disciplineId}/ranking?questionnaireId=${questionnaire._id}`}
                      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition transform cursor-pointer border-2 border-ufpa-200"
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="text-ufpa-600 mt-1" size={28} />
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-ufpa-700">{questionnaire.title}</h4>
                          <p className="text-sm text-gray-600 mt-2">{questionnaire.description}</p>
                          <p className="text-xs text-ufpa-600 mt-3">Clique para ver o ranking</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {questionnaires.length === 0 && (
              <div className="text-center text-gray-600 bg-white rounded-lg p-8">
                Nenhum questionário encontrado nesta disciplina
              </div>
            )}
        </div>
      </main>
    </div>
  );
}