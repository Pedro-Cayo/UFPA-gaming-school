import Answer from '../models/Answer.js';
import Questionnaire from '../models/Questionnaire.js';
import mongoose from 'mongoose';

export async function submitAnswers(req, res) {
  try {
    const { questionnaireId, disciplineId, answers } = req.body;
    const studentId = req.user.id;
    
    if (!questionnaireId || !disciplineId || !answers) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }
    
    // Buscar questionário para validar respostas
    const questionnaire = await Questionnaire.findById(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionário não encontrado' });
    }
    
    // Calcular pontuação
    let totalScore = 0;
    let totalTime = 0;
    
    const processedAnswers = answers.map(answer => {
      const question = questionnaire.questions.find(q => q._id.toString() === answer.questionId);
      
      if (!question) {
        return null;
      }
      
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      const points = isCorrect ? question.points : 0;
      
      totalScore += points;
      totalTime += answer.timeSpent || 0;
      
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer, // <-- AGORA ESTAMOS SALVANDO A RESPOSTA CERTA AQUI!
        isCorrect,
        points,
        timeSpent: answer.timeSpent || 0
      };
    }).filter(a => a !== null);
    
    // Criar registro de resposta
    const answerRecord = new Answer({
      studentId,
      questionnaireId,
      disciplineId,
      answers: processedAnswers,
      totalScore,
      totalTime
    });
    
    await answerRecord.save();
    
    res.status(201).json({
      message: 'Respostas submetidas com sucesso',
      result: {
        totalScore,
        totalTime,
        totalQuestions: answers.length,
        correctAnswers: processedAnswers.filter(a => a.isCorrect).length
      }
    });
  } catch (error) {
    console.error('Erro ao submeter respostas:', error);
    res.status(500).json({ error: 'Erro ao submeter respostas' });
  }
}

export async function getStudentAnswers(req, res) {
  try {
    const studentId = req.user.id;
    
    const answers = await Answer.find({ studentId })
      .populate('questionnaireId', 'title')
      .populate('disciplineId', 'name code');
    
    res.json(answers);
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    res.status(500).json({ error: 'Erro ao buscar respostas' });
  }
}

export async function getAnswersByDiscipline(req, res) {
  try {
    const { disciplineId } = req.params;
    const studentId = req.user.id;
    
    const answers = await Answer.find({ disciplineId, studentId })
      .populate('questionnaireId', 'title');
    
    res.json(answers);
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    res.status(500).json({ error: 'Erro ao buscar respostas' });
  }
}

export async function getRankingByDiscipline(req, res) {
  try {
    const { disciplineId } = req.params;
    
    // Agregar respostas por aluno
    const ranking = await Answer.aggregate([
      { $match: { disciplineId: new mongoose.Types.ObjectId(disciplineId) } },
      {
        $group: {
          _id: '$studentId',
          totalScore: { $sum: '$totalScore' },
          totalTime: { $sum: '$totalTime' },
          answersCount: { $sum: 1 }
        }
      },
      { $sort: { totalScore: -1, totalTime: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $project: {
          _id: '$_id',
          studentId: '$_id',
          studentName: '$student.name',
          studentPhoto: '$student.photoUrl',
          score: '$totalScore',
          totalScore: 1,
          totalTime: 1,
          answersCount: 1
        }
      }
    ]);
    
    res.json(ranking);
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
}

export async function getGeneralRanking(req, res) {
  try {
    // Agregar respostas por aluno (quantidade de questionários respondidos)
    const ranking = await Answer.aggregate([
      {
        $group: {
          _id: '$studentId',
          totalAnswers: { $sum: 1 },
          totalScore: { $sum: '$totalScore' },
          totalTime: { $sum: '$totalTime' }
        }
      },
      { $sort: { totalScore: -1, totalAnswers: -1, totalTime: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $project: {
          _id: '$_id',
          studentId: '$_id',
          studentName: '$student.name',
          studentPhoto: '$student.photoUrl',
          totalAnswers: 1,
          totalScore: 1,
          totalTime: 1
        }
      }
    ]);
    
    res.json(ranking);
  } catch (error) {
    console.error('Erro ao buscar ranking geral:', error);
    res.status(500).json({ error: 'Erro ao buscar ranking geral' });
  }
}

// Obter ranking por questionário específico
export async function getRankingByQuestionnaire(req, res) {
  try {
    const { questionnaireId } = req.params;
    console.log('Buscando ranking para questionário:', questionnaireId);

    const ranking = await Answer.aggregate([
      {
        $match: {
          questionnaireId: new mongoose.Types.ObjectId(questionnaireId)
        }
      },
      {
        $group: {
          _id: '$studentId',
          score: { $sum: '$totalScore' },
          totalTime: { $sum: '$totalTime' },
          studentName: { $first: '$studentName' }
        }
      },
      {
        $sort: { score: -1, totalTime: 1 }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $project: {
          _id: '$_id',
          studentId: '$_id',
          studentName: '$student.name',
          studentPhoto: '$student.photoUrl',
          score: 1,
          totalTime: 1
        }
      }
    ]);

    console.log('Ranking encontrado:', ranking);
    res.json(ranking);
  } catch (error) {
    console.error('Erro ao buscar ranking por questionário:', error);
    res.status(500).json({ message: 'Erro ao buscar ranking' });
  }
}