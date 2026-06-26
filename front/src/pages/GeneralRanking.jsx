import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { answerService } from '../services/api';
import { ArrowLeft, Trophy, User, Zap, Star } from 'lucide-react';
import GameCard from '../components/GameCard';
import GameHeader from '../components/GameHeader';
import MedalBadge from '../components/MedalBadge';

export default function GeneralRanking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.userType !== 'aluno' && user.userType !== 'professor')) {
      navigate('/login');
      return;
    }
    loadRanking();
  }, [user, navigate]);

  const loadRanking = async () => {
    try {
      const response = await answerService.getGeneralRanking();
      setRanking(response.data);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const userPosition = ranking.findIndex(student => student._id === (user?._id || user?.id));
  const userRankData = userPosition !== -1 ? ranking[userPosition] : null;

  // Função para definir o estilo do card de destaque baseado na posição
  const getPodiumStyles = (pos) => {
    if (pos === 0) return 'from-yellow-400 via-gamify-gold to-yellow-600 text-ufpa-900 ring-yellow-400';
    if (pos === 1) return 'from-gray-200 via-gray-300 to-gray-400 text-gray-900 ring-gray-200';
    if (pos === 2) return 'from-amber-600 via-amber-700 to-amber-800 text-white ring-amber-500';
    return 'from-ufpa-700 via-ufpa-800 to-ufpa-900 text-white ring-ufpa-600';
  };

  const podiumStyles = getPodiumStyles(userPosition);

  return (
    <div className="min-h-screen">
      <GameHeader 
        title="Ranking Geral"
        subtitle="Veja como você se compara com outros alunos 🏆"
        showLogo={true}
        showBack={true}
        backTo={user?.userType === 'professor' ? '/professor' : '/aluno'}
        icon={<Trophy size={32} />}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* User's Position Card - Dynamic Podium Style */}
        {userRankData && userPosition !== -1 && (
          <div className="mb-10">
            <GameCard glass className={`p-1 overflow-hidden ring-4 shadow-glow animate-float ${podiumStyles.split(' ').pop()}`}>
              <div className={`bg-gradient-to-r p-8 relative ${podiumStyles}`}>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-current">
                  <Trophy size={120} />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="flex items-center gap-8">
                    {/* Big Medal */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <MedalBadge position={userPosition + 1} size="xl" />
                        <div className={`absolute -bottom-2 -right-2 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg animate-pulse ${userPosition === 0 ? 'bg-ufpa-900 text-white' : 'bg-gamify-gold text-ufpa-900'}`}>
                          VOCÊ
                        </div>
                      </div>
                    </div>

                    {/* Player Info */}
                    <div className="text-center md:text-left">
                      <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Status Atual</p>
                      <h2 className="text-4xl font-black mb-1 drop-shadow-md">
                        {userPosition + 1}º Lugar
                      </h2>
                      <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="w-8 h-8 rounded-full border-2 border-current overflow-hidden">
                           {userRankData.studentPhoto ? (
                            <img src={userRankData.studentPhoto} alt="Sua Foto" className="w-full h-full object-cover" />
                           ) : (
                            <div className="w-full h-full bg-black/20 flex items-center justify-center"><User size={14} /></div>
                           )}
                        </div>
                        <span className="font-bold text-lg">{userRankData.studentName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Player Stats Dashboard */}
                  <div className="flex gap-4 sm:gap-8">
                    <div className="text-center bg-black/10 backdrop-blur-md rounded-2xl p-4 min-w-[100px] border border-white/20">
                      <p className="text-[10px] font-bold uppercase mb-1 opacity-80">Pontos</p>
                      <p className={`text-3xl font-black drop-shadow-sm ${userPosition === 0 ? 'text-ufpa-900' : 'text-gamify-gold'}`}>
                        {userRankData.totalScore.toFixed(0)}
                      </p>
                    </div>
                    <div className="text-center bg-black/10 backdrop-blur-md rounded-2xl p-4 min-w-[100px] border border-white/20">
                      <p className="text-[10px] font-bold uppercase mb-1 opacity-80">Questionários</p>
                      <p className="text-3xl font-black drop-shadow-sm">
                        {userRankData.totalAnswers}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </GameCard>
          </div>
        )}

        {/* Ranking List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin mb-4">
              <Zap className="text-ufpa-600" size={32} />
            </div>
            <p className="text-gray-600 font-medium">Carregando ranking...</p>
          </div>
        ) : ranking.length === 0 ? (
          <GameCard glass className="p-12 text-center">
            <Star className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 font-medium text-lg">Nenhum resultado ainda</p>
            <p className="text-gray-500 text-sm mt-2">Comece a responder questionários para aparecer no ranking!</p>
          </GameCard>
        ) : (
          <div className="space-y-4">
            {ranking.map((student, index) => {
              const isCurrentUser = student._id === (user?._id || user?.id);
              const isTopThree = index < 3;

              return (
                <GameCard 
                  key={student._id}
                  glass={!isCurrentUser}
                  className={`p-6 transition ${
                    isCurrentUser
                      ? 'ring-2 ring-ufpa-600 shadow-glow'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-shrink-0">
                      <MedalBadge position={index + 1} size="lg" />
                    </div>

                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-ufpa-600 to-ufpa-800 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                        {student.studentPhoto ? (
                          <img 
                            src={student.studentPhoto} 
                            alt={student.studentName} 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User size={28} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {student.studentName}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono">
                          ID: {student._id.slice(0, 12)}...
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Questionários</p>
                        <p className="text-2xl font-bold text-ufpa-700">
                          {student.totalAnswers}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Pontos</p>
                        <p className="text-2xl font-bold text-gamify-gold">
                          {student.totalScore.toFixed(0)}
                        </p>
                      </div>
                    </div>

                    {isCurrentUser && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-ufpa-600 text-white text-xs font-bold rounded-full">
                          ⭐ Você
                        </span>
                      </div>
                    )}
                  </div>

                  {isTopThree && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        {index === 0 && <span className="text-gamify-gold">👑 Campeão do Ranking</span>}
                        {index === 1 && <span className="text-gray-500 font-bold">🥈 Vice-Campeão</span>}
                        {index === 2 && <span className="text-amber-700 font-bold">🥉 3º Lugar Geral</span>}
                      </div>
                    </div>
                  )}
                </GameCard>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center text-sm text-gray-600">
          <p>📊 Ranking atualizado em tempo real • {ranking.length} alunos participando</p>
        </div>
      </main>
    </div>
  );
}