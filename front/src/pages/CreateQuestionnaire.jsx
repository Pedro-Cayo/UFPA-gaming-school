import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { questionnaireService } from '../services/api';
import { ArrowLeft, AlertCircle } from 'lucide-react';

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

    // Validar questões
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
    <div className="min-h-screen bg-gradient-to-br from-ufpa-50 to-ufpa-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-ufpa-600 to-ufpa-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link to={`/professor/disciplina/${disciplineId}`} className="flex items-center gap-2 hover:opacity-80 mb-4">
            <ArrowLeft size={20} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold">Criar Novo Questionário</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start gap-2">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-gray-700 font-semibold mb-2">Título do Questionário</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
              placeholder="Ex: Prova de Matemática - Unidade 1"
              required
            />
          </div>

          {/* Points Summary */}
          <div className={`rounded-lg shadow-lg p-6 ${isValidTotal ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <p className={`font-semibold ${isValidTotal ? 'text-green-700' : 'text-yellow-700'}`}>
              Total de Pontos: {totalPoints.toFixed(1)}/10
            </p>
            {!isValidTotal && (
              <p className="text-yellow-600 text-sm mt-1">
                Ajuste os pontos para que o total seja exatamente 10
              </p>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-ufpa-700 mb-4">Questão {qIndex + 1}</h3>

                {/* Question Text */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Texto da Questão</label>
                  <textarea
                    value={question.text}
                    onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
                    rows="2"
                    placeholder="Digite a questão..."
                  />
                </div>

                {/* Options */}
                <div className="mb-4 space-y-2">
                  <label className="block text-gray-700 font-semibold mb-2">Alternativas</label>
                  {['A', 'B', 'C', 'D', 'E'].map((letter, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <span className="font-semibold text-ufpa-600 w-8">{letter})</span>
                      <input
                        type="text"
                        value={question.options[optIndex]}
                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
                        placeholder={`Alternativa ${letter}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Resposta Correta</label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
                    >
                      {['A', 'B', 'C', 'D', 'E'].map(letter => (
                        <option key={letter} value={letter}>{letter}</option>
                      ))}
                    </select>
                  </div>

                  {/* Points */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Pontos (0.5 a 2.0)</label>
                    <input
                      type="number"
                      min="0.5"
                      max="2.0"
                      step="0.5"
                      value={question.points}
                      onChange={(e) => handleQuestionChange(qIndex, 'points', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ufpa-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !isValidTotal}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Questionário'}
            </button>
            <Link
              to={`/professor/disciplina/${disciplineId}`}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
