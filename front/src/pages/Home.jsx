import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { answerService } from '../services/api';
import { Trophy, BookOpen, ArrowLeft, User, ChevronLeft, ChevronRight, Zap, Star, Info } from 'lucide-react';
import GameButton from '../components/GameButton';
import MedalBadge from '../components/MedalBadge';
import GameCard from '../components/GameCard';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [generalRanking, setGeneralRanking] = useState([]);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const itemsPerPage = 10;

  // Hook 1: Carregar Ranking
  useEffect(() => {
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
  }, []);

  // Hook 2: Redirecionar se logado
  useEffect(() => {
    if (user) {
      if (user.userType === 'professor') {
        navigate('/professor');
      } else {
        navigate('/aluno');
      }
    }
  }, [user, navigate]);

  // Cálculos de Paginação
  const totalPages = Math.ceil(generalRanking.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRanking = generalRanking.slice(startIndex, endIndex);

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

  // Se o usuário está logado, não renderiza nada
  if (user) return null;

  return (
    <div className="min-h-screen">
      <header className="header-game sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/study-ranking-logo.png"
                alt="Study Ranking Logo"
                className="h-14 w-14 drop-shadow-lg hover:scale-110 transition transform duration-300"
              />
              <div>
                <h1 className="text-3xl font-bold">Study Ranking</h1>
                <p className="text-sm opacity-90">Gamificação do Ensino</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap justify-end">
              <Link to="/sobre">
                {/* CORREÇÃO: Botão Sobre agora é primário (azul) para ser visível */}
                <GameButton variant="primary" size="sm" icon={<Info size={18} />}>
                  Sobre
                </GameButton>
              </Link>
              <Link to="/login">
                <GameButton variant="secondary" size="sm">
                  🔓 Entrar
                </GameButton>
              </Link>
              <Link to="/register">
                <GameButton variant="success" size="sm">
                  ✨ Registrar
                </GameButton>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <GameCard glass className="p-8 sm:p-10 text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="text-gamify-gold" size={48} />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-ufpa-600 to-ufpa-800 bg-clip-text text-transparent mb-3">
              Ranking Geral
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Veja o desempenho de todos os alunos em tempo real. Faça login para participar e competir no ranking! 🎮
            </p>
          </GameCard>
        </div>

        <GameCard glass className="p-6 sm:p-8">
          {loadingRanking ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin mb-4">
                <Zap className="text-ufpa-600" size={32} />
              </div>
              <p className="text-gray-600 font-medium">Carregando ranking geral...</p>
            </div>
          ) : generalRanking.length === 0 ? (
            <div className="text-center py-12">
              <Star className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 font-medium">Nenhum resultado ainda</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-game">
                  <thead>
                    <tr>
                      <th className="text-left py-4 px-4 font-bold">Posição</th>
                      <th className="text-left py-4 px-4 font-bold">Aluno</th>
                      <th className="text-center py-4 px-4 font-bold">Questionários</th>
                      <th className="text-center py-4 px-4 font-bold">Pontos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRanking.map((student, index) => {
                      const position = startIndex + index + 1;
                      const rowClass = position <= 3 ? `top-${position}` : '';
                      return (
                        <tr key={student._id} className={rowClass}>
                          <td className="py-4 px-4">
                            <MedalBadge position={position} size="md" />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-ufpa-600 to-ufpa-800 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                {student.studentPhoto ? (
                                  <img src={student.studentPhoto} alt={student.studentName} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  <User size={24} />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{student.studentName}</p>
                                <p className="text-xs text-gray-500">ID: {student._id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="badge-achievement">{student.totalAnswers}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-bold text-lg text-ufpa-700">{student.totalScore}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-200">
                  <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-ufpa-100 text-ufpa-700 hover:bg-ufpa-200 disabled:opacity-50 transition">
                    <ChevronLeft size={18} />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>
                  <div className="flex gap-1">
                    {getPageNumbers().map((page) => (
                      <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-2 rounded-lg font-semibold transition ${currentPage === page ? 'bg-ufpa-600 text-white shadow-lg' : 'bg-ufpa-100 text-ufpa-700 hover:bg-ufpa-200'}`}>
                        {page}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-ufpa-100 text-ufpa-700 hover:bg-ufpa-200 disabled:opacity-50 transition">
                    <span className="hidden sm:inline">Próximo</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </GameCard>

        <div className="mt-12 text-center">
          <GameCard glass className="p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Pronto para competir? 🚀</h3>
            <p className="text-gray-700 mb-6">Crie sua conta e comece a participar do ranking agora mesmo!</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/login"><GameButton variant="primary" size="lg" icon={<ArrowLeft size={20} />}>Já tenho conta</GameButton></Link>
              <Link to="/register"><GameButton variant="success" size="lg" icon={<Star size={20} />}>Criar conta</GameButton></Link>
            </div>
          </GameCard>
        </div>
      </main>

      <footer className="bg-ufpa-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6">
          <img src="/brasao-ufpa.png" alt="UFPA Logo" className="w-14 h-14 object-contain" />
          <div className="text-center">
            <p className="font-semibold">&copy; 2026 Study Ranking</p>
            <p className="text-sm text-gray-400">UFPA Campus Castanhal - Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}