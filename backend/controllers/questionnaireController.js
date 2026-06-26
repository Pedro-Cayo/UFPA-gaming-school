import Answer from '../models/Answer.js';
import Questionnaire from '../models/Questionnaire.js';
import { isValidTotalPoints } from '../helpers/validators.js';
import mongoose from 'mongoose';

export async function createQuestionnaire(req, res) {
  try {
    const { title, disciplineId, questions } = req.body;
    const professorId = req.user.id;
    
    if (!title || !disciplineId || !questions || questions.length !== 10) {
      return res.status(400).json({ error: 'Questionário deve ter exatamente 10 questões' });
    }
    
    // Validar soma de pontos
    if (!isValidTotalPoints(questions)) {
      return res.status(400).json({ error: 'A soma dos pontos deve ser exatamente 10' });
    }
    
    // Validar cada questão
    for (const q of questions) {
      if (!q.text || !q.options || q.options.length !== 5 || !q.correctAnswer || !q.points) {
        return res.status(400).json({ error: 'Questão inválida' });
      }
      
      if (q.points < 0.5 || q.points > 2.0) {
        return res.status(400).json({ error: 'Pontos devem estar entre 0.5 e 2.0' });
      }
    }
    
    // Adicionar IDs às questões
    const questionsWithIds = questions.map(q => ({
      _id: new mongoose.Types.ObjectId(),
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      points: q.points
    }));
    
    const questionnaire = new Questionnaire({
      title,
      disciplineId,
      professorId,
      questions: questionsWithIds,
      totalPoints: 10
    });
    
    await questionnaire.save();
    
    res.status(201).json({
      message: 'Questionário criado com sucesso',
      questionnaire
    });
  } catch (error) {
    console.error('Erro ao criar questionário:', error);
    res.status(500).json({ error: 'Erro ao criar questionário' });
  }
}

export async function getQuestionnairesByDiscipline(req, res) {
  try {
    const { disciplineId } = req.params;
    
    const questionnaires = await Questionnaire.find({ disciplineId })
      .populate('professorId', 'name')
      .populate('disciplineId', 'name code');
    
    res.json(questionnaires);
  } catch (error) {
    console.error('Erro ao buscar questionários:', error);
    res.status(500).json({ error: 'Erro ao buscar questionários' });
  }
}

export async function getQuestionnaireById(req, res) {
  try {
    const { id } = req.params;
    
    const questionnaire = await Questionnaire.findById(id)
      .populate('professorId', 'name')
      .populate('disciplineId', 'name code');
    
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionário não encontrado' });
    }
    
    res.json(questionnaire);
  } catch (error) {
    console.error('Erro ao buscar questionário:', error);
    res.status(500).json({ error: 'Erro ao buscar questionário' });
  }
}

export async function getQuestionnaireForAnswering(req, res) {
  try {
    const { id } = req.params;
    const studentId = req.user.id; // Pega o ID do aluno logado
    
    const questionnaire = await Questionnaire.findById(id)
      .populate('disciplineId', 'name code');
    
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionário não encontrado' });
    }
    
    // Verifica se este aluno específico já respondeu esse questionário alguma vez
    const hasAnswered = await Answer.findOne({ questionnaireId: id, studentId });
    
    // Mapeia as questões baseado no status da tentativa
    const questionsForStudent = questionnaire.questions.map(q => {
      const baseQuestion = {
        _id: q._id,
        text: q.text,
        options: q.options,
        points: q.points
      };

      // SE ELE JÁ RESPONDEU ANTES: Liberamos o gabarito no objeto para o modo de revisão!
      if (hasAnswered) {
        baseQuestion.correctAnswer = q.correctAnswer;
      }

      return baseQuestion;
    });
    
    res.json({
      _id: questionnaire._id,
      title: questionnaire.title,
      disciplineId: questionnaire.disciplineId,
      questions: questionsForStudent,
      totalPoints: questionnaire.totalPoints
    });
  } catch (error) {
    console.error('Erro ao buscar questionário:', error);
    res.status(500).json({ error: 'Erro ao buscar questionário' });
  }
}

export async function updateQuestionnaire(req, res) {
  try {
    const { id } = req.params;
    const { title, questions } = req.body;
    
    const questionnaire = await Questionnaire.findById(id);
    
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionário não encontrado' });
    }
    
    if (questionnaire.professorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    if (questions && questions.length === 10) {
      if (!isValidTotalPoints(questions)) {
        return res.status(400).json({ error: 'A soma dos pontos deve ser exatamente 10' });
      }
      
      const questionsWithIds = questions.map(q => ({
        _id: q._id || new mongoose.Types.ObjectId(),
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points
      }));
      
      questionnaire.questions = questionsWithIds;
    }
    
    if (title) questionnaire.title = title;
    
    await questionnaire.save();
    
    res.json({
      message: 'Questionário atualizado com sucesso',
      questionnaire
    });
  } catch (error) {
    console.error('Erro ao atualizar questionário:', error);
    res.status(500).json({ error: 'Erro ao atualizar questionário' });
  }
}

export async function deleteQuestionnaire(req, res) {
  try {
    const { id } = req.params;
    
    const questionnaire = await Questionnaire.findById(id);
    
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionário não encontrado' });
    }
    
    if (questionnaire.professorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    await Questionnaire.findByIdAndDelete(id);
    
    res.json({ message: 'Questionário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar questionário:', error);
    res.status(500).json({ error: 'Erro ao deletar questionário' });
  }
}
