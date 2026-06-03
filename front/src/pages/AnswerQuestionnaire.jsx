import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { questionnaireService, answerService } from '../services/api';
import { ArrowLeft, Clock } from 'lucide-react';

export default function AnswerQuestionnaire() {
  const { questionnaireId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timers, setTimers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.userType !== 'aluno') {
      navigate('/login');
      return;
    }
    loadQuestionnaire();
  }, [questionnaireId, user, navigate]);

  // Timer para a questão atual
  useEffect(() => {
    const timer = setInterval(() => {
      setTimers(prev => ({
        ...prev,
        [currentQuestion]: (prev[currentQuestion] || 0) + 1
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  const loadQuestionnaire = async () => {
    try {
      const response = await questionnaireService.getForAnswering(questionnaireId);
      setQuestionnaire(response.data);
      // Inicializar timers
      const initialTimers = {};
      response.data.questions.forEach((_, index) => {
        initialTimers[index] = 0;
      });
      setTimers(initialTimers);
    } catch (error) {
      console.error('Erro ao carregar questionário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < questionnaire.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const submissionAnswers = questionnaire.questions.map((question, index) => ({
        questionId: question._id,
        selectedAnswer: answers[question._id] || '',
        timeSpent: timers[index] || 0
      }));

      const response = await answerService.submit({
        questionnaireId,
        disciplineId: questionnaire.disciplineId._id,
        answers: submissionAnswers
      });

      // Mostrar resultado
      alert(`Parabéns! Você acertou ${response.data.result.correctAnswers} de ${response.data.result.totalQuestions} questões!`);
      navigate(`/aluno/disciplina/${questionnaire.disciplineId._id}`);
    } catch (error) {
      console.error('Erro ao submeter respostas:', error);
      alert('Erro ao submeter respostas');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600 py-8">Carregando...</div>;
  }

  if (!questionnaire || questionnaire.questions.length === 0) {
    return <div className="text-center text-gray-600 py-8">Questionário não encontrado</div>;
  }

  const question = questionnaire.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questionnaire.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ufpa-50 to-ufpa-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-ufpa-600 to-ufpa-800 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">{questionnaire.title}</h1>
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-90">Questão {currentQuestion + 1} de {questionnaire.questions.length}</p>
            <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <Clock size={18} />
              <span>{timers[currentQuestion] || 0}s</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-ufpa-600 to-ufpa-800 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Question Text */}
          <h2 className="text-2xl font-bold text-ufpa-700 mb-6">{question.text}</h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {['A', 'B', 'C', 'D', 'E'].map((letter, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                  answers[question._id] === letter
                    ? 'border-ufpa-600 bg-ufpa-50'
                    : 'border-gray-300 hover:border-ufpa-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={letter}
                  checked={answers[question._id] === letter}
                  onChange={() => handleAnswerChange(question._id, letter)}
                  className="mr-4"
                />
                <span className="font-semibold text-ufpa-600 mr-2">{letter})</span>
                <span>{question.options[index]}</span>
              </label>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="bg-gray-400 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Anterior
            </button>

            {currentQuestion === questionnaire.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                {submitting ? 'Enviando...' : 'Enviar Respostas'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-ufpa-600 to-ufpa-700 hover:from-ufpa-700 hover:to-ufpa-800 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Próxima
              </button>
            )}
          </div>

          {/* Question Indicators */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 font-semibold mb-4">Navegação Rápida:</p>
            <div className="flex flex-wrap gap-2">
              {questionnaire.questions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    index === currentQuestion
                      ? 'bg-ufpa-600 text-white'
                      : answers[q._id]
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
