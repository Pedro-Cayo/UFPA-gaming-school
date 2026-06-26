import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { questionnaireService } from '../services/api';
import { AlertCircle, CheckCircle, Zap } from 'lucide-react';
import GameCard from '../components/GameCard';
import GameHeader from '../components/GameHeader';
import GameButton from '../components/GameButton';

export default function CreateQuestionnaire() {
  const { disciplineId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState(Array(10).fill(null).map(() => ({
    text: '',
    options: ['', '', '', '', ''],
    correctAnswer: 'A',
    points: 1
  })));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalPoints = questions.reduce((sum, q) => sum + (parseFloat(q.points) || 0), 0);
  const isValidTotal = Math.abs(totalPoints - 10) < 0.01;
  const completedQuestions = questions.filter(q => q.text.trim() && q.options.every(o => o.trim())).length;

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Título é obrigatório');
      return;
    }

    if (!isValidTotal) {
      setError(`A soma dos pontos deve ser 10. Atual: ${totalPoints.toFixed(1)}`);
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        setError(`Questão ${i + 1}: Texto obrigatório`);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        setError(`Questão ${i + 1}: Todas as 5 alternativas são obrigatórias`);
        return;
      }
      if (q.points < 0.5 || q.points > 2.0) {
        setError(`Questão ${i + 1}: Pontos devem estar entre 0.5 e 2.0`);
        return;
      }
    }

    setLoading(true);

    try {
      await questionnaireService.create({
        title,
        disciplineId,
        questions
      });
      navigate(`/professor/disciplina/${disciplineId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar questionário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Gamificado */}
      <GameHeader 
        title="Criar Novo Questionário"
        subtitle="Defina 10 questões com pontuação total de 10"
        showLogo={true}
        showBack={true}
        backTo={`/professor/disciplina/${disciplineId}`}
        icon={<Zap size={32} />}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Section */}
          <GameCard glass className="p-8">
            <label className="block text-gray-700 font-bold mb-3 text-lg">
              📝 Título do Questionário
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
              placeholder="Ex: Prova de Matemática - Unidade 1"
              required
            />
          </GameCard>

          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GameCard glass className="p-6 text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-gray-600 text-sm mb-1">Questões Completas</p>
              <p className="text-2xl font-bold text-ufpa-700">{completedQuestions}/10</p>
            </GameCard>
            <GameCard 
              glass 
              className={`p-6 text-center ${isValidTotal ? 'ring-2 ring-green-500' : ''}`}
            >
              <div className="text-3xl mb-2">{isValidTotal ? '✓' : '⚠️'}</div>
              <p className="text-gray-600 text-sm mb-1">Total de Pontos</p>
              <p className={`text-2xl font-bold ${isValidTotal ? 'text-green-600' : 'text-yellow-600'}`}>
                {totalPoints.toFixed(1)}/10
              </p>
            </GameCard>
            <GameCard glass className="p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-gray-600 text-sm mb-1">Progresso</p>
              <p className="text-2xl font-bold text-ufpa-700">
                {Math.round((completedQuestions / 10) * 100)}%
              </p>
            </GameCard>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="text-gamify-gold" size={28} />
              Questões
            </h2>
            
            {questions.map((question, qIndex) => {
              const isComplete = question.text.trim() && question.options.every(o => o.trim());
              return (
                <GameCard key={qIndex} glass className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-3xl font-bold text-ufpa-700 flex-shrink-0">
                      {qIndex + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">Questão {qIndex + 1}</h3>
                        {isComplete && (
                          <CheckCircle className="text-green-600" size={20} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                      📄 Texto da Questão
                    </label>
                    <textarea
                      value={question.text}
                      onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white resize-none"
                      rows="2"
                      placeholder="Digite a questão..."
                    />
                  </div>

                  {/* Options */}
                  <div className="mb-4 space-y-2">
                    <label className="block text-gray-700 font-semibold mb-3 text-sm">
                      🎯 Alternativas
                    </label>
                    {['A', 'B', 'C', 'D', 'E'].map((letter, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <span className="font-bold text-ufpa-600 w-8 text-center">{letter})</span>
                        <input
                          type="text"
                          value={question.options[optIndex]}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
                          placeholder={`Alternativa ${letter}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Answer & Points */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm">
                        ✓ Resposta Correta
                      </label>
                      <select
                        value={question.correctAnswer}
                        onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
                      >
                        {['A', 'B', 'C', 'D', 'E'].map(letter => (
                          <option key={letter} value={letter}>{letter}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm">
                        ⭐ Pontos (0.5-2.0)
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        max="2.0"
                        step="0.5"
                        value={question.points}
                        onChange={(e) => handleQuestionChange(qIndex, 'points', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border-2 border-ufpa-200 rounded-lg focus:outline-none focus:border-ufpa-600 focus:ring-2 focus:ring-ufpa-300 transition bg-white"
                      />
                    </div>
                  </div>
                </GameCard>
              );
            })}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <GameButton
              type="submit"
              disabled={loading || !isValidTotal}
              variant="success"
              size="lg"
              className="flex-1"
            >
              {loading ? '⏳ Criando...' : '✓ Criar Questionário'}
            </GameButton>
            <Link to={`/professor/disciplina/${disciplineId}`} className="flex-1">
              <GameButton
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
              >
                ✕ Cancelar
              </GameButton>
            </Link>
          </div>

          {/* Info Box */}
          {!isValidTotal && (
            <GameCard glass className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
              <p className="text-yellow-700 text-sm font-medium">
                💡 A soma dos pontos deve ser exatamente 10. Ajuste os valores para continuar.
              </p>
            </GameCard>
          )}
        </form>
      </main>
    </div>
  );
}
