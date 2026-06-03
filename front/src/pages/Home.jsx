import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Clock, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ufpa-600 to-ufpa-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-ufpa-700 to-ufpa-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">UFPA Gamificação</h1>
          <div className="flex gap-4">
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-white text-center">
        <h2 className="text-5xl font-bold mb-6">Sistema de Gamificação de Ensino</h2>
        <p className="text-xl mb-8 opacity-90">
          Transforme o aprendizado em uma experiência competitiva e engajante com questionários,
          rankings e desafios acadêmicos
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-ufpa-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            Começar Agora
          </Link>
          <Link
            to="/login"
            className="bg-ufpa-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-ufpa-600 transition text-lg border-2 border-white"
          >
            Já tem conta?
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-4xl font-bold text-center text-ufpa-700 mb-12">Recursos Principais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-ufpa-50 rounded-lg p-6 text-center">
              <BookOpen className="text-ufpa-600 mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold text-ufpa-700 mb-2">Questionários</h4>
              <p className="text-gray-600">
                Crie questionários com 10 questões e pontuação customizável
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-ufpa-50 rounded-lg p-6 text-center">
              <Trophy className="text-ufpa-600 mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold text-ufpa-700 mb-2">Rankings</h4>
              <p className="text-gray-600">
                Acompanhe o desempenho com rankings por disciplina e geral
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-ufpa-50 rounded-lg p-6 text-center">
              <Clock className="text-ufpa-600 mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold text-ufpa-700 mb-2">Cronômetro</h4>
              <p className="text-gray-600">
                Tempo de resposta registrado para critério de desempate
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-ufpa-50 rounded-lg p-6 text-center">
              <Users className="text-ufpa-600 mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold text-ufpa-700 mb-2">Colaborativo</h4>
              <p className="text-gray-600">
                Professores e alunos em um único sistema integrado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gradient-to-br from-ufpa-50 to-ufpa-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-4xl font-bold text-center text-ufpa-700 mb-12">Como Funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-ufpa-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h4 className="text-xl font-bold text-ufpa-700 mb-2">Registre-se</h4>
              <p className="text-gray-600">
                Crie sua conta como professor ou aluno com validação de CNPJ ou matrícula
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-ufpa-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h4 className="text-xl font-bold text-ufpa-700 mb-2">Crie ou Responda</h4>
              <p className="text-gray-600">
                Professores criam questionários, alunos respondem com cronômetro
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-ufpa-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h4 className="text-xl font-bold text-ufpa-700 mb-2">Acompanhe Rankings</h4>
              <p className="text-gray-600">
                Visualize seu desempenho nos rankings por disciplina e geral
              </p>
            </div>
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
