import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { disciplineService, questionnaireService } from '../services/api';
import { ArrowLeft, Plus } from 'lucide-react';

export default function ProfessorDisciplineDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [discipline, setDiscipline] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="text-center text-gray-600 py-8">Carregando...</div>;
  }

  if (!discipline) {
    return <div className="text-center text-gray-600 py-8">Disciplina não encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ufpa-50 to-ufpa-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-ufpa-600 to-ufpa-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link to="/professor" className="flex items-center gap-2 hover:opacity-80 mb-4">
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold">{discipline.name}</h1>
          <p className="text-sm opacity-90">{discipline.code}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Description */}
        {discipline.description && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-ufpa-700 mb-2">Descrição</h2>
            <p className="text-gray-600">{discipline.description}</p>
          </div>
        )}

        {/* Create Questionnaire Button */}
        <div className="mb-8">
          <Link
            to={`/professor/disciplina/${id}/novo-questionario`}
            className="flex items-center gap-2 bg-gradient-to-r from-ufpa-600 to-ufpa-700 text-white px-6 py-3 rounded-lg hover:from-ufpa-700 hover:to-ufpa-800 transition font-semibold inline-block"
          >
            <Plus size={20} />
            Novo Questionário
          </Link>
        </div>

        {/* Questionnaires List */}
        <div>
          <h2 className="text-2xl font-bold text-ufpa-700 mb-6">Questionários</h2>
          {questionnaires.length === 0 ? (
            <div className="text-center text-gray-600 bg-white rounded-lg p-8">
              Nenhum questionário criado ainda
            </div>
          ) : (
            <div className="space-y-4">
              {questionnaires.map((questionnaire) => (
                <div key={questionnaire._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-ufpa-700">{questionnaire.title}</h3>
                      <p className="text-gray-600 text-sm">
                        {questionnaire.questions.length} questões • {questionnaire.totalPoints} pontos
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition">
                        Editar
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">
                        Deletar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
