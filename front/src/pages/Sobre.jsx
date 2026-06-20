import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, Clock, Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sobre() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-ufpa-600 to-ufpa-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-ufpa-700 to-ufpa-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">UFPA Gamificação</h1>
          <div className="flex gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 bg-ufpa-500 hover:bg-ufpa-600 px-4 py-2 rounded-lg transition"
                >
                  <ArrowLeft size={18} />
                  Voltar
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-2 bg-ufpa-500 hover:bg-ufpa-600 px-4 py-2 rounded-lg transition"
                >
                  <ArrowLeft size={18} />
                  Voltar
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-ufpa-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-ufpa-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-ufpa-600 transition"
                >
                  Registrar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-white text-center">
        <h2 className="text-5xl font-bold mb-6">Sobre o Sistema de Gamificação</h2>
        <p className="text-xl mb-8 opacity-90">
          Conheça como o UFPA Gamificação transforma o aprendizado em uma experiência
          competitiva, engajante e eficaz
        </p>
      </section>

      {/* About Content */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-ufpa-700 mb-6">O que é Gamificação?</h3>
            <p className="text-lg text-gray-700 mb-4">
              Gamificação é a aplicação de elementos e mecânicas de jogos em contextos não-lúdicos,
              como a educação. No UFPA Gamificação, utilizamos conceitos de competição saudável,
              pontuação e rankings para motivar e engajar alunos no processo de aprendizagem.
            </p>
            <p className="text-lg text-gray-700">
              Ao transformar o aprendizado em uma experiência interativa e competitiva, buscamos
              aumentar a motivação dos alunos, melhorar o desempenho acadêmico e criar um ambiente
              de aprendizagem mais dinâmico e colaborativo.
            </p>
          </div>

          <div className="mb-12">
            <h3 className="text-3xl font-bold text-ufpa-700 mb-6">Recursos Principais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-ufpa-50 rounded-lg p-6 text-center">
                <BookOpen className="text-ufpa-600 mx-auto mb-4" size={40} />
                <h4 className="text-xl font-bold text-ufpa-700 mb-2">Questionários</h4>
                <p className="text-gray-600">
                  Professores criam questionários com 10 questões e pontuação customizável para
                  avaliar o conhecimento dos alunos
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-ufpa-50 rounded-lg p-6 text-center">
                <Trophy className="text-ufpa-600 mx-auto mb-4" size={40} />
                <h4 className="text-xl font-bold text-ufpa-700 mb-2">Rankings</h4>
                <p className="text-gray-600">
                  Acompanhe o desempenho com rankings por disciplina e ranking geral de todos os alunos
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-ufpa-50 rounded-lg p-6 text-center">
                <Clock className="text-ufpa-600 mx-auto mb-4" size={40} />
                <h4 className="text-xl font-bold text-ufpa-700 mb-2">Cronômetro</h4>
                <p className="text-gray-600">
                  Tempo de resposta é registrado automaticamente para critério de desempate nos rankings
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-ufpa-50 rounded-lg p-6 text-center">
                <Users className="text-ufpa-600 mx-auto mb-4" size={40} />
                <h4 className="text-xl font-bold text-ufpa-700 mb-2">Colaborativo</h4>
                <p className="text-gray-600">
                  Professores e alunos em um único sistema integrado para uma experiência completa
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-3xl font-bold text-ufpa-700 mb-6">Como Funciona</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-ufpa-50 rounded-lg shadow-lg p-8">
                <div className="bg-ufpa-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h4 className="text-xl font-bold text-ufpa-700 mb-2">Registre-se</h4>
                <p className="text-gray-600">
                  Crie sua conta como professor ou aluno. Professores precisam validar CNPJ, alunos precisam
                  validar matrícula UFPA
                </p>
              </div>

              <div className="bg-ufpa-50 rounded-lg shadow-lg p-8">
                <div className="bg-ufpa-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h4 className="text-xl font-bold text-ufpa-700 mb-2">Crie ou Responda</h4>
                <p className="text-gray-600">
                  Professores criam questionários para suas disciplinas. Alunos respondem os questionários
                  com cronômetro automático
                </p>
              </div>

              <div className="bg-ufpa-50 rounded-lg shadow-lg p-8">
                <div className="bg-ufpa-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h4 className="text-xl font-bold text-ufpa-700 mb-2">Acompanhe Rankings</h4>
                <p className="text-gray-600">
                  Visualize seu desempenho nos rankings por disciplina e no ranking geral. Compita com seus colegas
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12 bg-ufpa-50 rounded-lg p-8">
            <h3 className="text-3xl font-bold text-ufpa-700 mb-6">Benefícios da Gamificação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-ufpa-600 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-ufpa-700">Maior Engajamento</h4>
                  <p className="text-gray-600">
                    A competição saudável motiva os alunos a participarem mais ativamente
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-ufpa-600 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-ufpa-700">Melhor Desempenho</h4>
                  <p className="text-gray-600">
                    Alunos motivados tendem a ter melhor desempenho acadêmico
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-ufpa-600 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-ufpa-700">Feedback Imediato</h4>
                  <p className="text-gray-600">
                    Alunos recebem feedback imediato sobre seu desempenho
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-ufpa-600 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-ufpa-700">Ambiente Colaborativo</h4>
                  <p className="text-gray-600">
                    Cria um ambiente de aprendizagem mais dinâmico e colaborativo
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-ufpa-600 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-ufpa-700">Rastreamento de Progresso</h4>
                  <p className="text-gray-600">
                    Professores podem acompanhar o progresso de cada aluno facilmente
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-ufpa-600 text-white">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-ufpa-700">Diversão e Aprendizado</h4>
                  <p className="text-gray-600">
                    Combina diversão com aprendizado efetivo
                  </p>
                </div>
              </div>
            </div>
          </div>

                    <div className="text-center">
            <h3 className="text-3xl font-bold text-ufpa-700 mb-6">
              {user ? 'Bem-vindo ao UFPA Gamificação!' : 'Comece Agora'}
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              {user
                ? 'Explore todos os recursos do sistema de gamificação'
                : 'Junte-se ao UFPA Gamificação e transforme sua experiência de aprendizagem'}
            </p>
            {!user && (
              <div className="flex gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-ufpa-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-ufpa-700 transition text-lg"
                >
                  Registrar-se
                </Link>
                <Link
                  to="/login"
                  className="bg-ufpa-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-ufpa-600 transition text-lg"
                >
                  Entrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ufpa-900 text-white text-center py-8">
        <p>&copy; 2024 UFPA Gamificação. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}