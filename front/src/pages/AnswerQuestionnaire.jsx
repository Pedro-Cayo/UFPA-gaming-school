import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { questionnaireService, answerService } from '../services/api';
import { Clock, ChevronLeft, ChevronRight, Send, Zap, ArrowLeft, ShieldAlert, Target } from 'lucide-react';
import GameCard from '../components/GameCard';
import GameButton from '../components/GameButton';

export default function AnswerQuestionnaire() {
  const { questionnaireId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const [answers, setAnswers] = useState({}); 
  const [correctAnswersMap, setCorrectAnswersMap] = useState({}); 
  const [isCorrectMap, setIsCorrectMap] = useState({}); 
  const [finalScore, setFinalScore] = useState(0); 
  
  const [timers, setTimers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.userType !== 'aluno') {
      navigate('/login');
      return;
    }
    loadQuestionnaire();
  }, [questionnaireId, user, navigate]);

  useEffect(() => {
    if (loading || viewMode) return;
    const timer = setInterval(() => {
      setTimers(prev => ({
        ...prev,
        [currentQuestion]: (prev[currentQuestion] || 0) + 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion, loading, viewMode]);

  const loadQuestionnaire = async () => {
    try {
      const response = await questionnaireService.getForAnswering(questionnaireId);
      const fetchedQuestionnaire = response.data;
      setQuestionnaire(fetchedQuestionnaire);

      try {
        const historyResponse = await answerService.getMyAnswers();
        let pastSubmission = null;

        if (historyResponse?.data && Array.isArray(historyResponse.data)) {
          pastSubmission = historyResponse.data.find(
            sub => String(sub.questionnaireId?._id || sub.questionnaireId) === String(questionnaireId)
          );
        }

        if (pastSubmission) {
          setViewMode(true);
          
          const pastAnswersDict = {};
          const correctMap = {};
          const correctnessMap = {};
          let manualScoreCalc = 0;

          if (Array.isArray(pastSubmission.answers)) {
            pastSubmission.answers.forEach(ans => {
              const qId = String(ans.questionId?._id || ans.questionId);
              pastAnswersDict[qId] = ans.selectedAnswer;
              
              const actualCorrect = ans.correctAnswer || fetchedQuestionnaire.questions.find(q => String(q._id) === qId)?.correctAnswer;
              
              if (actualCorrect) {
                correctMap[qId] = actualCorrect;
                if (ans.selectedAnswer === actualCorrect) manualScoreCalc++;
              }
              
              if (ans.isCorrect !== undefined) {
                correctnessMap[qId] = ans.isCorrect;
                if (ans.isCorrect && !actualCorrect) manualScoreCalc++;
              }
            });
          }
          
          setAnswers(pastAnswersDict);
          setCorrectAnswersMap(correctMap);
          setIsCorrectMap(correctnessMap);
          
          const backendScore = pastSubmission.result?.correctAnswers || pastSubmission.score || 0;
          setFinalScore(backendScore > 0 ? backendScore : manualScoreCalc);

        } else {
          const initialTimers = {};
          fetchedQuestionnaire.questions?.forEach((_, index) => {
            initialTimers[index] = 0;
          });
          setTimers(initialTimers);
        }
      } catch (historyErr) {
        console.warn('Erro ao checar histórico:', historyErr);
        const initialTimers = {};
        fetchedQuestionnaire.questions?.forEach((_, index) => {
          initialTimers[index] = 0;
        });
        setTimers(initialTimers);
      }

    } catch (error) {
      console.error('Erro ao carregar questionário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    if (viewMode) return; 
    setAnswers({
      ...answers,
      [String(questionId)]: answer
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
    if (viewMode) return;
    setSubmitting(true);
    try {
      const submissionAnswers = questionnaire.questions.map((question, index) => ({
        questionId: question._id,
        selectedAnswer: answers[String(question._id)] || '',
        timeSpent: timers[index] || 0
      }));

      const disciplineId = questionnaire.disciplineId?._id || questionnaire.disciplineId;

      const response = await answerService.submit({
        questionnaireId,
        disciplineId,
        answers: submissionAnswers
      });

      alert(`🎉 Parabéns! Você acertou ${response.data.result.correctAnswers} de ${response.data.result.totalQuestions} questões!`);
      navigate(`/aluno/disciplina/${disciplineId}`);
    } catch (error) {
      console.error('Erro ao submeter respostas:', error);
      if (error.response?.data?.message) {
        alert(`❌ Erro: ${error.response.data.message}`);
      } else {
        alert('Erro ao submeter respostas.');
      }
      navigate(-1);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <Zap className="text-ufpa-700" size={32} />
          </div>
          <p className="text-gray-600 font-medium">Carregando questionário...</p>
        </div>
      </div>
    );
  }

  if (!questionnaire || !questionnaire.questions || questionnaire.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <GameCard glass className="p-12 text-center">
          <p className="text-gray-600 font-medium text-lg">Questionário não encontrado</p>
        </GameCard>
      </div>
    );
  }

  const question = questionnaire.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questionnaire.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const discId = questionnaire?.disciplineId?._id || questionnaire?.disciplineId || '';

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="header-game sticky top-0 z-50 bg-gradient-to-r from-ufpa-700 to-ufpa-900 shadow-lg text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">
                {questionnaire.title} {viewMode && " - Revisão"}
              </h1>
              <p className="text-sm opacity-90">
                Questão {currentQuestion + 1} de {questionnaire.questions.length}
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex-shrink-0">
              {viewMode ? (
                <button 
                  onClick={() => navigate(`/aluno/disciplina/${discId}`)}
                  className="flex items-center gap-2 font-semibold hover:text-gray-200 transition"
                  title="Voltar para a Disciplina"
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline">Sair da Revisão</span>
                </button>
              ) : (
                <>
                  <Clock size={20} />
                  <span className="font-semibold">{timers[currentQuestion] || 0}s</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-gamify-gold to-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {viewMode && (
          <div className="mb-6 p-5 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-lg">Modo de Visualização</h3>
                <p className="text-gray-600 text-sm">Suas respostas já foram enviadas.</p>
              </div>
            </div>
            <div className="text-center bg-gray-50 px-6 py-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Resultado Final</p>
              <p className="text-2xl font-bold text-ufpa-700">
                {finalScore} <span className="text-lg text-gray-400">/ {questionnaire.questions.length}</span>
              </p>
            </div>
          </div>
        )}

        <GameCard glass className="p-8 mb-8">
          <div className="inline-block mb-4 px-4 py-2 bg-ufpa-700 text-white rounded-full text-sm font-bold">
            Questão {currentQuestion + 1}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-relaxed">
            {question?.text || ''}
          </h2>

          <div className="space-y-3">
            {['A', 'B', 'C', 'D', 'E'].map((letter, index) => {
              const qIdStr = String(question._id);
              const isSelected = answers[qIdStr] === letter;
              
              // Tenta achar o gabarito (seja pelo mapa do histórico ou direto pela questão)
              const knownCorrectLetter = correctAnswersMap[qIdStr] || question.correctAnswer || question.correctOption;
              const wasAnsweredCorrectly = isCorrectMap[qIdStr];

              let isGreen = false;
              let isRed = false;

              if (viewMode) {
                if (knownCorrectLetter) {
                  // AQUI ESTÁ A MÁGICA: Se sabemos qual é a certa, ela fica verde MESMO SE não foi selecionada
                  if (knownCorrectLetter === letter) {
                    isGreen = true;
                  } else if (isSelected) {
                    // A que o aluno marcou (e que não é a certa) fica vermelha
                    isRed = true;
                  }
                } else if (wasAnsweredCorrectly !== undefined) {
                  // Se o backend não nos disser a resposta certa, só mostramos se ele errou ou acertou a dele
                  if (isSelected) {
                    if (wasAnsweredCorrectly) isGreen = true;
                    else isRed = true;
                  }
                }
              }

              let stylingClasses = 'border-gray-300 hover:border-ufpa-300 hover:bg-gray-50';
              let letterColor = 'text-ufpa-800';
              let textColor = 'text-gray-700';

              if (viewMode) {
                if (isGreen) {
                  stylingClasses = 'border-green-500 bg-green-50 ring-2 ring-green-200';
                  letterColor = 'text-green-700';
                  textColor = 'text-green-800 font-semibold';
                } else if (isRed) {
                  stylingClasses = 'border-red-500 bg-red-50 ring-2 ring-red-200';
                  letterColor = 'text-red-700';
                  textColor = 'text-red-800';
                } else {
                  stylingClasses = 'border-gray-200 bg-gray-50 opacity-60';
                  letterColor = 'text-gray-500';
                  textColor = 'text-gray-500';
                }
              } else if (isSelected) {
                stylingClasses = 'border-ufpa-700 bg-ufpa-50 ring-2 ring-ufpa-100';
                letterColor = 'text-ufpa-800';
                textColor = 'text-gray-900 font-medium';
              }

              return (
                <label
                  key={index}
                  className={`flex items-start p-4 border-2 rounded-lg transition transform ${
                    !viewMode ? 'cursor-pointer hover:scale-102' : 'cursor-default'
                  } ${stylingClasses}`}
                >
                  <div className="flex items-center h-6 mr-4 flex-shrink-0">
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={letter}
                      checked={isSelected}
                      disabled={viewMode}
                      onChange={() => handleAnswerChange(question._id, letter)}
                      className="w-5 h-5 accent-ufpa-700"
                    />
                  </div>
                  <div className="flex-1">
                    <span className={`font-bold mr-3 text-lg ${letterColor}`}>
                      {letter})
                    </span>
                    <span className={`text-lg ${textColor}`}>
                      {question?.options?.[index] || ''}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </GameCard>

        <div className="flex gap-4 mb-8">
          <GameButton
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            size="lg"
            icon={<ChevronLeft size={20} />}
            className="flex-1"
          >
            Anterior
          </GameButton>

          {currentQuestion === questionnaire.questions.length - 1 ? (
            viewMode ? (
              <GameButton
                onClick={() => navigate(`/aluno/disciplina/${discId}`)}
                variant="primary"
                size="lg"
                icon={<ArrowLeft size={20} />}
                className="flex-1"
              >
                Voltar à Disciplina
              </GameButton>
            ) : (
              <GameButton
                onClick={handleSubmit}
                disabled={submitting}
                variant="success"
                size="lg"
                icon={<Send size={20} />}
                className="flex-1"
              >
                {submitting ? '⏳ Enviando...' : '✓ Enviar Respostas'}
              </GameButton>
            )
          ) : (
            <GameButton
              onClick={handleNext}
              variant="primary"
              size="lg"
              icon={<ChevronRight size={20} />}
              className="flex-1"
            >
              Próxima
            </GameButton>
          )}
        </div>

        <GameCard glass className="p-6">
          <p className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
            🎯 Navegação Rápida ({answeredCount}/{questionnaire.questions.length} respondidas)
          </p>
          <div className="flex flex-wrap gap-2">
            {questionnaire.questions.map((q, index) => {
              const qIdStr = String(q._id);
              let btnClass = 'bg-gray-300 text-gray-700 hover:bg-gray-400';
              
              if (index === currentQuestion) {
                btnClass = 'bg-gradient-to-br from-ufpa-700 to-ufpa-900 text-white ring-2 ring-ufpa-200';
              } else if (viewMode) {
                const knownCorrectLetter = correctAnswersMap[qIdStr] || q.correctAnswer || q.correctOption;
                let isCorrect = false;

                if (knownCorrectLetter) {
                  isCorrect = answers[qIdStr] === knownCorrectLetter;
                } else if (isCorrectMap[qIdStr] !== undefined) {
                  isCorrect = isCorrectMap[qIdStr];
                }

                if (isCorrect === true) btnClass = 'bg-green-500 text-white';
                else if (isCorrect === false) btnClass = 'bg-red-500 text-white';
                else if (answers[qIdStr]) btnClass = 'bg-blue-400 text-white';
              } else if (answers[qIdStr]) {
                btnClass = 'bg-green-500 text-white hover:bg-green-600';
              }

              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-bold transition transform hover:scale-110 ${btnClass}`}
                  title={`Questão ${index + 1}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </GameCard>
      </main>
    </div>
  );
}