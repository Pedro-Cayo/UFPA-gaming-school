import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { disciplineService, answerService } from '../services/api';
import { BookOpen, Trophy, LogOut, Zap, Star, Users, User } from 'lucide-react';
import GameButton from '../components/GameButton';
import GameCard from '../components/GameCard';
import GameHeader from '../components/GameHeader';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({ points: 0, rank: '-' });

  useEffect(() => {
    if (!user || user.userType !== 'aluno') {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      // Carrega disciplinas e ranking simultaneamente
      const [disciplineRes, rankingRes] = await Promise.all([
        disciplineService.getAll(),
        answerService.getGeneralRanking()
      ]);
      
      setDisciplines(disciplineRes.data);
      
      // Lógica de busca do ranking idêntica à da Home.jsx
      const ranking = rankingRes.data;
      const myData = ranking.find(item => item._id === user._id || item._id === user.id);
      const myIndex = ranking.findIndex(item => item._id === user._id || item._id === user.id);

      if (myData) {
        setUserStats({
          points: myData.totalScore,
          rank: myIndex !== -1 ? `${myIndex + 1}º` : '-'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <GameHeader 
        title="Painel do Aluno"
        subtitle={`Bem-vindo, ${user?.name}! 🎮`}
        showLogo={true}
        showBack={false}
        showHome={true}
        icon={<BookOpen size={32} />}
      >
        <Link to="/aluno/perfil">
          <GameButton variant="secondary" size="sm" icon={<User size={18} />}>
            Perfil
          </GameButton>
        </Link>
        <GameButton variant="primary" size="sm" onClick={handleLogout} icon={<LogOut size={18} />}>
          Sair
        </GameButton>
      </GameHeader>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GameCard glass className="p-6 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-gray-600 text-sm mb-1">Disciplinas</p>
            <p className="text-3xl font-bold text-ufpa-700">{disciplines.length}</p>
          </GameCard>
          <GameCard glass className="p-6 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <p className="text-gray-600 text-sm mb-1">Pontos Totais</p>
            <p className="text-3xl font-bold text-gamify-gold">{userStats.points}</p>
          </GameCard>
          <GameCard glass className="p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-gray-600 text-sm mb-1">Ranking Geral</p>
            <p className="text-3xl font-bold text-ufpa-700">{userStats.rank}</p>
          </GameCard>
        </div>

        {/* Links de Ranking */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Trophy className="text-gamify-gold" size={28} />
            Acessar Rankings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/aluno/ranking-geral">
              <GameCard glass className="p-8 h-full hover:shadow-glow transition group">
                <div className="flex items-center gap-6">
                  <div className="text-6xl group-hover:scale-110 transition">🌍</div>
                  <div>
                    <h3 className="text-2xl font-bold text-ufpa-700 mb-1">Ranking Geral</h3>
                    <p className="text-gray-600">Sua posição entre todos os alunos da plataforma</p>
                  </div>
                </div>
              </GameCard>
            </Link>
            <Link to="/aluno/selecionar-disciplina">
  <GameCard glass className="p-8 h-full hover:shadow-glow transition group">
    <div className="flex items-center gap-6">
      <div className="text-6xl group-hover:scale-110 transition">📚</div>
      <div>
        <h3 className="text-2xl font-bold text-ufpa-700 mb-1">Por Disciplina</h3>
        <p className="text-gray-600">Escolha uma matéria para ver os rankings específicos</p>
      </div>
    </div>
  </GameCard>
</Link>
          </div>
        </div>

        {/* Lista de Disciplinas */}
        <div>
          <h2 id="disciplinas-section" className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
  <BookOpen className="text-ufpa-600" size={28} />
  Minhas Disciplinas
</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <Zap className="text-ufpa-600 animate-spin mx-auto mb-4" size={32} />
              <p className="text-gray-600">Carregando...</p>
            </div>
          ) : disciplines.length === 0 ? (
            <GameCard glass className="p-12 text-center">
              <Star className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 font-medium text-lg">Nenhuma disciplina disponível</p>
            </GameCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {disciplines.map((discipline) => (
                <Link key={discipline._id} to={`/aluno/disciplina/${discipline._id}`}>
                  <GameCard glass className="p-6 h-full cursor-pointer group hover:shadow-glow transition">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-ufpa-600 rounded-lg text-white group-hover:bg-ufpa-700 transition">
                        <BookOpen size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-ufpa-700 transition">
                          {discipline.name}
                        </h3>
                        <p className="text-xs text-gray-500">{discipline.code}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{discipline.description}</p>
                    <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                      <Users size={16} />
                      <span>Prof. {discipline.professorId?.name}</span>
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