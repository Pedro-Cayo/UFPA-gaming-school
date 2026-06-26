import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, Clock, Users, ArrowLeft, Zap, Star, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GameCard from '../components/GameCard';
import GameButton from '../components/GameButton';
import GameHeader from '../components/GameHeader';

export default function Sobre() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Gamificado */}
      <GameHeader 
        title="Sobre Study Ranking"
        subtitle="Gamificação do Ensino - Transformando o Aprendizado em Competição"
        showLogo={true}
        showBack={true}
        backTo={user ? (user.userType === 'professor' ? '/professor' : '/aluno') : '/'}
        icon={<Trophy size={32} />}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section - Modificado para Roxo-Patchouli Pastel */}
        <div className="mb-16">
          <GameCard glass className="p-12 text-center !bg-gradient-to-br !from-purple-100/50 !to-fuchsia-100/40 !border-purple-300/40 shadow-sm">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-ufpa-700 to-ufpa-900 bg-clip-text text-transparent mb-4">
              🎮 Bem-vindo ao Study Ranking
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Um sistema inovador que transforma o aprendizado em uma experiência competitiva, 
              engajante e eficaz através da gamificação.
            </p>
          </GameCard>
        </div>

        {/* O que é Gamificação */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="text-gamify-gold" size={32} />
            O que é Gamificação?
          </h2>
          <GameCard glass className="p-8 border-l-4 border-gamify-gold !bg-amber-100/30 !border-amber-300/40">
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              <strong>Gamificação</strong> é a aplicação de elementos e mecânicas de jogos em contextos não-lúdicos, 
              como a educação. No Study Ranking, utilizamos conceitos de competição saudável, pontuação e rankings 
              para motivar e engajar alunos no processo de aprendizagem.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ao transformar o aprendizado em uma experiência interativa e competitiva, buscamos aumentar a motivação 
              dos alunos, melhorar o desempenho acadêmico e criar um ambiente de aprendizagem mais dinâmico e colaborativo.
            </p>
          </GameCard>
        </div>

        {/* Recursos Principais */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="text-gamify-gold" size={32} />
            Recursos Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 - Rosa Pastel */}
            <GameCard glass className="p-6 text-center !border-pink-300/50 !bg-pink-100/60 hover:shadow-md transition">
              <div className="text-5xl mb-4 bg-white/80 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                📝
              </div>
              <h4 className="text-xl font-bold text-pink-900 mb-3">Questionários</h4>
              <p className="text-pink-950 text-sm leading-relaxed opacity-95 font-medium">
                Professores criam questionários com 10 questões e pontuação customizável para avaliar o conhecimento.
              </p>
            </GameCard>

            {/* Feature 2 - Amarelo/Ouro Pastel */}
            <GameCard glass className="p-6 text-center !border-amber-300/50 !bg-amber-100/60 hover:shadow-md transition">
              <div className="text-5xl mb-4 bg-white/70 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                🏆
              </div>
              <h4 className="text-xl font-bold text-amber-900 mb-3">Rankings</h4>
              <p className="text-amber-950 text-sm leading-relaxed opacity-95 font-medium">
                Acompanhe o desempenho com rankings por disciplina e ranking geral de todos os alunos.
              </p>
            </GameCard>

            {/* Feature 3 - Roxo Pastel */}
            <GameCard glass className="p-6 text-center !border-purple-300/50 !bg-purple-100/60 hover:shadow-md transition">
              <div className="text-5xl mb-4 bg-white/70 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                ⏱️
              </div>
              <h4 className="text-xl font-bold text-purple-900 mb-3">Cronômetro</h4>
              <p className="text-purple-950 text-sm leading-relaxed opacity-95 font-medium">
                Tempo de resposta é registrado automaticamente para critério de desempate nos rankings.
              </p>
            </GameCard>

            {/* Feature 4 - Azul Pastel */}
            <GameCard glass className="p-6 text-center !border-blue-300/50 !bg-blue-100/60 hover:shadow-md transition">
              <div className="text-5xl mb-4 bg-white/70 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                👥
              </div>
              <h4 className="text-xl font-bold text-blue-900 mb-3">Colaborativo</h4>
              <p className="text-blue-950 text-sm leading-relaxed opacity-95 font-medium">
                Professores e alunos em um único sistema integrado para uma experiência completa.
              </p>
            </GameCard>
          </div>
        </div>

        {/* Como Funciona */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="text-gamify-gold" size={32} />
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GameCard glass className="p-8 !border-slate-300/50 !bg-slate-100/70 shadow-sm">
              <div className="bg-white/80 text-slate-800 rounded-xl w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 shadow-sm border border-slate-200">
                1
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Registre-se</h4>
              <p className="text-slate-800 text-sm leading-relaxed font-medium">
                Crie sua conta como professor ou aluno. Professores e alunos precisam validar sua matrícula UFPA.
              </p>
            </GameCard>

            <GameCard glass className="p-8 !border-indigo-200/60 !bg-indigo-50/70 shadow-sm">
              <div className="bg-white/80 text-indigo-800 rounded-xl w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 shadow-sm border border-indigo-100">
                2
              </div>
              <h4 className="text-xl font-bold text-indigo-900 mb-3">Crie ou Responda</h4>
              <p className="text-indigo-950 text-sm leading-relaxed font-medium">
                Professores criam questionários para suas disciplinas. Alunos respondem com cronômetro automático.
              </p>
            </GameCard>

            <GameCard glass className="p-8 !border-sky-200/60 !bg-sky-50/70 shadow-sm">
              <div className="bg-white/80 text-sky-900 rounded-xl w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 shadow-sm border border-sky-100">
                3
              </div>
              <h4 className="text-xl font-bold text-sky-900 mb-3">Acompanhe Rankings</h4>
              <p className="text-sky-950 text-sm leading-relaxed font-medium">
                Visualize seu desempenho nos rankings por disciplina e no ranking geral. Compita com seus colegas.
              </p>
            </GameCard>
          </div>
        </div>

        {/* Benefícios */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">✨ Benefícios da Gamificação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🎯', title: 'Maior Engajamento', desc: 'A competição saudável motiva os alunos a participarem mais ativamente', colorClass: '!bg-orange-100/50 !border-orange-300/40 text-orange-950' },
              { icon: '📈', title: 'Melhor Desempenho', desc: 'Alunos motivados tendem a ter melhor desempenho acadêmico', colorClass: '!bg-emerald-100/50 !border-emerald-300/40 text-emerald-950' },
              { icon: '⚡', title: 'Feedback Imediato', desc: 'Alunos recebem feedback imediato sobre seu desempenho', colorClass: '!bg-amber-100/50 !border-amber-300/40 text-amber-950' },
              { icon: '🤝', title: 'Ambiente Colaborativo', desc: 'Cria um ambiente de aprendizagem mais dinâmico e colaborativo', colorClass: '!bg-sky-100/50 !border-sky-300/40 text-sky-950' },
              { icon: '📊', title: 'Rastreamento de Progresso', desc: 'Professores podem acompanhar o progresso de cada aluno facilmente', colorClass: '!bg-indigo-100/50 !border-indigo-300/40 text-indigo-950' },
              { icon: '🎮', title: 'Diversão e Aprendizado', desc: 'Combina diversão com aprendizado efetivo', colorClass: '!bg-purple-100/50 !border-purple-300/40 text-purple-950' },
            ].map((benefit, index) => (
              <GameCard key={index} glass className={`p-6 border ${benefit.colorClass} hover:shadow-md transition`}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl bg-white/70 p-2 rounded-xl flex-shrink-0 shadow-sm">{benefit.icon}</div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{benefit.title}</h4>
                    <p className="text-sm opacity-95 leading-relaxed font-medium">{benefit.desc}</p>
                  </div>
                </div>
              </GameCard>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-16">
          <GameCard glass className="p-12 text-center !bg-gradient-to-b !from-gray-100/40 !to-white !border-gray-300/50 shadow-sm">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {user ? '🚀 Comece a Usar Agora' : '🎮 Pronto para Começar?'}
            </h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              {user
                ? 'Explore todos os recursos do sistema de gamificação e transforme sua experiência educacional'
                : 'Junte-se ao Study Ranking e transforme sua experiência de aprendizagem em uma aventura competitiva e divertida'}
            </p>
            {!user && (
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/register">
                  <GameButton 
                    variant="success" 
                    size="lg" 
                    icon={<Star size={20} />}
                    className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border-2 border-emerald-500/30 font-bold transition shadow-sm"
                  >
                    Criar Conta
                  </GameButton>
                </Link>
                <Link to="/login">
                  <GameButton 
                    variant="primary" 
                    size="lg" 
                    icon={<ArrowLeft size={20} />}
                    className="bg-ufpa-700/10 text-ufpa-800 hover:bg-ufpa-700/20 border-2 border-ufpa-700/30 font-bold transition shadow-sm"
                  >
                    Já Tenho Conta
                  </GameButton>
                </Link>
              </div>
            )}
            {user && (
              <button
                onClick={() => navigate(-1)}
                className="btn-game btn-game-primary inline-flex items-center gap-2 px-6 py-3 border-2 border-ufpa-700/30 bg-ufpa-700/10 text-ufpa-800 hover:bg-ufpa-700/20 rounded-xl transition font-bold"
              >
                <ArrowLeft size={20} />
                Voltar
              </button>
            )}
          </GameCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-ufpa-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6">
          <img 
            src="/brasao-ufpa.png"
            alt="UFPA Logo"
            className="w-14 h-14 object-contain"
          />
          <div className="text-center">
            <p className="font-semibold">&copy; 2026 Study Ranking</p>
            <p className="text-sm text-gray-400">UFPA Campus Castanhal - Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}