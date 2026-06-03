import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { answerService, disciplineService } from '../services/api';
import { ArrowLeft, Trophy, User } from 'lucide-react';

export default function DisciplineRanking() {
  const { disciplineId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [discipline, setDiscipline] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.userType !== 'aluno') {
      navigate('/login');
      return;
    }
    loadData();
  }, [disciplineId, user, navigate]);

  const loadData = async () => {
    try {
      const [disciplineRes, rankingRes] = await Promise.all([
        disciplineService.getById(disciplineId),
        answerService.getRankingByDiscipline(disciplineId)
      ]);
      setDiscipline(disciplineRes.data);
      setRanking(rankingRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (position) => {
    switch (position) {
      case 0:
        return 'text-yellow-500';
      case 1:
        return 'text-gray-400';
      case 2:
        return 'text-orange-600';
      default:
        return 'text-gray-300';
    }
  };

  const getMedalEmoji = (position) => {
    switch (position) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${position + 1}º`;
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
          <Link to={`/aluno/disciplina/${disciplineId}`} className="flex items-center gap-2 hover:opacity-80 mb-4">
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <div className="flex items-center gap-3">
            <Trophy size={32} />
            <div>
              <h1 className="text-3xl font-bold">Ranking - {discipline?.name}</h1>
              <p className="text-sm opacity-90">{discipline?.code}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {ranking.length === 0 ? (
          <div className="text-center text-gray-600 bg-white rounded-lg p-8">
            Nenhum resultado ainda nesta disciplina
          </div>
        ) : (
          <div className="space-y-4">
            {ranking.map((student, index) => {
              const isCurrentUser = user && user.id === student.studentId;
              return (
                <div
                  key={student.studentId}
                  className={`rounded-lg shadow-lg p-6 transition ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-ufpa-100 to-ufpa-50 border-2 border-ufpa-600'
                      : 'bg-white hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Position */}
                      <div className={`text-3xl font-bold ${getMedalColor(index)}`}>
                        {getMedalEmoji(index)}
                      </div>

                      {/* Student Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-ufpa-600 to-ufpa-800 rounded-full flex items-center justify-center text-white font-bold">
                            {student.studentPhoto ? (
                              <img src={student.studentPhoto} alt={student.studentName} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <User size={24} />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-ufpa-700">
                              {student.studentName}
                              {isCurrentUser && <span className="ml-2 text-sm bg-ufpa-600 text-white px-2 py-1 rounded">Você</span>}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-ufpa-700">
                        {student.totalScore.toFixed(1)}
                      </div>
                      <p className="text-sm text-gray-600">pontos</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {student.answersCount} {student.answersCount === 1 ? 'resposta' : 'respostas'}
                      </p>
                      {student.totalTime > 0 && (
                        <p className="text-xs text-gray-500">
                          {Math.floor(student.totalTime / 60)}m {student.totalTime % 60}s
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
