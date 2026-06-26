import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { disciplineService } from '../services/api';
import { BookOpen, Trophy, Zap, Star } from 'lucide-react';
import GameCard from '../components/GameCard';
import GameHeader from '../components/GameHeader';

export default function DisciplineSelector() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDisciplines();
  }, [user, navigate]);

  const loadDisciplines = async () => {
    try {
      const response = await disciplineService.getAll();
      setDisciplines(response.data);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <GameHeader 
        title="Escolha uma Disciplina"
        subtitle="Selecione para ver os rankings específicos 🏆"
        showLogo={true}
        showBack={true}
        backTo="/aluno"
        icon={<Trophy size={32} />}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <Zap className="text-ufpa-600 animate-spin mx-auto mb-4" size={32} />
            <p className="text-gray-600">Carregando disciplinas...</p>
          </div>
        ) : disciplines.length === 0 ? (
          <GameCard glass className="p-12 text-center">
            <Star className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 font-medium text-lg">Nenhuma disciplina encontrada</p>
          </GameCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disciplines.map((discipline) => (
              <Link 
                key={discipline._id} 
                to={`/aluno/disciplina/${discipline._id}/selector`}
              >
                <GameCard glass className="p-6 h-full cursor-pointer group hover:shadow-glow transition">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-ufpa-600 rounded-lg text-white group-hover:bg-ufpa-700 transition">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-ufpa-700 transition">
                        {discipline.name}
                      </h3>
                      <p className="text-xs text-gray-500">{discipline.code}</p>
                    </div>
                  </div>
                </GameCard>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}