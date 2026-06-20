import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { answerService } from '../services/api';
import { Trophy, BookOpen, ArrowLeft, User, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDisciplines, setShowDisciplines] = useState(false);
  
  // Estados para ranking geral (sem login)
  const [generalRanking, setGeneralRanking] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Carregar ranking geral quando não há login
  useEffect(() => {
    if (!user) {
      const loadGeneralRanking = async () => {
        try {
          const response = await answerService.getGeneralRanking();
          setGeneralRanking(response.data);
        } catch (error) {
          console.error('Erro ao carregar ranking geral:', error);
        } finally {
          setLoadingRanking(false);
        }
      };

      loadGeneralRanking();
    }
  }, [user]);

  // Calcular paginação
  const totalPages = Math.ceil(generalRanking.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRanking = generalRanking.slice(startIndex, endIndex);

  // Gerar números de página
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Se o usuário não está logado, mostrar apenas Ranking Geral
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ufpa-50 to-ufpa-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-ufpa-600 to-ufpa-800 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">UFPA Gamificação - Ranking Geral</h1>
            <div className="flex gap-4">
              <Link
                to="/sobre"
                className="bg-ufpa-500 hover:bg-ufpa-600 px-6 py-2 rounded-lg font-semibold transition"
              >
                Sobre
              </Link>
              <Link
                to="/login"
                className="bg-white text-ufpa-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-ufpa-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-ufpa-500 transition"
              >
                Registrar
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-3xl font-bold text-ufpa-700 mb-2">Ranking Geral</h2>
            <p className="text-gray-600">
              Visualize o desempenho de todos os alunos. Faça login para ver mais detalhes e competir!
            </p>
          </div>

          {/* Ranking Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {loadingRanking ? (
              <p className="text-center text-gray-600 py-8">Carregando ranking geral...</p>
            ) : generalRanking.length === 0 ? (
              <p className="text-center text-gray-600 py-8">Nenhum resultado ainda</p>
            ) : (
              <>
                {/* Ranking Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-ufpa-200">
                        <th className="text-left py-3 px-4 font-bold text-ufpa-700">Posição</th>
                        <th className="text-left py-3 px-4 font-bold text-ufpa-700">Aluno</th>
                        <th className="text-center py-3 px-4 font-bold text-ufpa-700">Questionários</th>
                        <th className="text-center py-3 px-4 font-bold text-ufpa-700">Pontos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRanking.map((student, index) => {
                        const position = startIndex + index + 1;
                        const getMedalEmoji = (pos) => {
                          if (pos === 1) return '🥇';
                          if (pos === 2) return '🥈';
                          if (pos === 3) return '🥉';
                          return `${pos}º`;
                        };

                        return (
                          <tr
                            key={student._id}
                            className="border-b border-gray-200 hover:bg-ufpa-50 transition"
                          >
                            <td className="py-4 px-4 font-bold text-lg text-ufpa-700">
                              {getMedalEmoji(position)}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-ufpa-600 to-ufpa-800 rounded-full flex items-center justify-center text-white font-bold">
                                  {student.studentPhoto ? (
                                    <img
                                      src={student.studentPhoto}
                                      alt={student.studentName}
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    <User size={20} />
                                  )}
                                </div>
                                <span className="text-gray-800 font-semibold">
                                  {student.studentName}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center text-gray-700">
                              {student.totalAnswers}
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-ufpa-700">
                              {student.totalScore}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-ufpa-100 text-ufpa-700 hover:bg-ufpa-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                      Anterior
                    </button>

                    <div className="flex gap-1">
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg font-semibold transition ${
                            currentPage === page
                              ? 'bg-ufpa-600 text-white'
                              : 'bg-ufpa-100 text-ufpa-700 hover:bg-ufpa-200'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-ufpa-100 text-ufpa-700 hover:bg-ufpa-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Próximo
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}

                {/* Info */}
                <div className="text-center mt-4 text-sm text-gray-600">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, generalRanking.length)} de{' '}
                  {generalRanking.length} alunos
                </div>
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-ufpa-900 text-white text-center py-8">
          <p>&copy; 2024 UFPA Gamificação. Todos os direitos reservados.</p>
        </footer>
      </div>
    );
  }

  // Se o usuário está logado como aluno, mostrar painel de rankings
  if (user.userType === 'aluno') {
    const loadDisciplinesWithAnswers = async () => {
      setLoading(true);
      try {
        const response = await answerService.getMyAnswers();
        // Extrair disciplinas únicas onde o aluno respondeu questionários
        const uniqueDisciplines = {};
        response.data.forEach(answer => {
          if (answer.disciplineId && answer.disciplineId._id) {
            uniqueDisciplines[answer.disciplineId._id] = answer.disciplineId;
          }
        });
        setDisciplines(Object.values(uniqueDisciplines));
      } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-ufpa-50 to-ufpa-100">
                {/* Header */}
        <header className="bg-gradient-to-r from-ufpa-600 to-ufpa-800 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Painel de Rankings</h1>
            <div className="flex gap-4">
              <Link
                to="/sobre"
                className="bg-ufpa-400 hover:bg-ufpa-500 px-4 py-2 rounded-lg transition font-semibold"
              >
                Sobre
              </Link>
              <Link
                to="/aluno"
                className="flex items-center gap-2 bg-ufpa-500 hover:bg-ufpa-600 px-4 py-2 rounded-lg transition"
              >
                <ArrowLeft size={18} />
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
                   {/* Rankings Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Dashboard Button */}
            <Link
              to="/aluno"
              className="bg-gradient-to-br from-green-400 to-green-500 text-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition transform"
            >
              <div className="flex items-center gap-4">
                <BookOpen size={48} />
                <div>
                  <h3 className="text-2xl font-bold">Meu Dashboard</h3>
                  <p className="text-sm opacity-90">Volte ao seu painel</p>
                </div>
              </div>
            </Link>

            {/* Ranking Geral Button */}
            <Link
              to="/aluno/ranking-geral"
              className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition transform"
            >
              <div className="flex items-center gap-4">
                <Trophy size={48} />
                <div>
                  <h3 className="text-2xl font-bold">Ranking Geral</h3>
                  <p className="text-sm opacity-90">Veja sua posição no ranking geral</p>
                </div>
              </div>
            </Link>

            {/* Ranking por Disciplina Button */}
            <button
              onClick={() => {
                if (!showDisciplines) {
                  loadDisciplinesWithAnswers();
                }
                setShowDisciplines(!showDisciplines);
              }}
              className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition transform text-left"
            >
              <div className="flex items-center gap-4">
                <Trophy size={48} />
                <div>
                  <h3 className="text-2xl font-bold">Ranking por Disciplina</h3>
                  <p className="text-sm opacity-90">
                    {showDisciplines ? 'Clique para fechar' : 'Clique para expandir'}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Disciplines List */}
          {showDisciplines && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-ufpa-700 mb-6">
                Disciplinas com Questionários Respondidos
              </h2>
              {loading ? (
                <div className="text-center text-gray-600">Carregando disciplinas...</div>
              ) : disciplines.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                  Você ainda não respondeu questionários em nenhuma disciplina
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {disciplines.map((discipline) => (
                    <Link
                      key={discipline._id}
                      to={`/aluno/disciplina/${discipline._id}/ranking`}
                      className="bg-gradient-to-br from-ufpa-50 to-ufpa-100 rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition transform cursor-pointer border-2 border-ufpa-200"
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="text-ufpa-600 mt-1" size={28} />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-ufpa-700">{discipline.name}</h3>
                          <p className="text-sm text-ufpa-600">{discipline.code}</p>
                          <p className="text-xs text-gray-600 mt-2">Clique para ver o ranking</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    );
  }

     // Se o usuário está logado como professor, mostrar painel de rankings
  if (user.userType === 'professor') {
    const [professorDisciplines, setProfessorDisciplines] = useState([]);
    const [loadingDisciplines, setLoadingDisciplines] = useState(false);
    const [showProfessorDisciplines, setShowProfessorDisciplines] = useState(false);

    const loadProfessorDisciplines = async () => {
      setLoadingDisciplines(true);
      try {
        const response = await disciplineService.getMyDisciplines();
        setProfessorDisciplines(response.data);
      } catch (error) {
        console.error('Erro ao carregar disciplinas do professor:', error);
      } finally {
        setLoadingDisciplines(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-ufpa-50 to-ufpa-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-ufpa-600 to-ufpa-800 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Painel de Rankings</h1>
            <div className="flex gap-4">
              <Link
                to="/sobre"
                className="bg-ufpa-400 hover:bg-ufpa-500 px-6 py-2 rounded-lg transition font-semibold"
              >
                Sobre
              </Link>
              <Link
                to="/professor"
                className="flex items-center gap-2 bg-ufpa-500 hover:bg-ufpa-600 px-4 py-2 rounded-lg transition"
              >
                <ArrowLeft size={18} />
                Meu Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Rankings Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Ranking Geral Button */}
            <Link
              to="/aluno/ranking-geral"
              className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition transform"
            >
              <div className="flex items-center gap-4">
                <Trophy size={48} />
                <div>
                  <h3 className="text-2xl font-bold">Ranking Geral</h3>
                  <p className="text-sm opacity-90">Veja o ranking geral de todos os alunos</p>
                </div>
              </div>
            </Link>

            {/* Ranking por Disciplina Button */}
            <button
              onClick={() => {
                if (!showProfessorDisciplines) {
                  loadProfessorDisciplines();
                }
                setShowProfessorDisciplines(!showProfessorDisciplines);
              }}
              className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-lg shadow-lg p-8 hover:shadow-xl hover:scale-105 transition transform text-left"
            >
              <div className="flex items-center gap-4">
                <Trophy size={48} />
                <div>
                  <h3 className="text-2xl font-bold">Ranking por Disciplina</h3>
                  <p className="text-sm opacity-90">
                    {showProfessorDisciplines ? 'Clique para fechar' : 'Clique para expandir'}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Professor Disciplines List */}
          {showProfessorDisciplines && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-ufpa-700 mb-6">
                Minhas Disciplinas com Questionários
              </h2>
              {loadingDisciplines ? (
                <div className="text-center text-gray-600">Carregando disciplinas...</div>
              ) : professorDisciplines.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                  Você ainda não criou questionários em nenhuma disciplina
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {professorDisciplines.map((discipline) => (
                    <Link
                      key={discipline._id}
                      to={`/aluno/disciplina/${discipline._id}/ranking`}
                      className="bg-gradient-to-br from-ufpa-50 to-ufpa-100 rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition transform cursor-pointer border-2 border-ufpa-200"
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="text-ufpa-600 mt-1" size={28} />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-ufpa-700">{discipline.name}</h3>
                          <p className="text-sm text-ufpa-600">{discipline.code}</p>
                          <p className="text-xs text-gray-600 mt-2">Clique para ver o ranking</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    );
  }
  return null;
}