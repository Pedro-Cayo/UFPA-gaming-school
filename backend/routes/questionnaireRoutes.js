import express from 'express';
import {
  createQuestionnaire,
  getQuestionnairesByDiscipline,
  getQuestionnaireById,
  getQuestionnaireForAnswering,
  updateQuestionnaire,
  deleteQuestionnaire
} from '../controllers/questionnaireController.js';
import { authenticateToken, authenticateProfessor, authenticateStudent } from '../helpers/auth.js';

const router = express.Router();

router.post('/', authenticateProfessor, createQuestionnaire);
router.get('/discipline/:disciplineId', authenticateToken, getQuestionnairesByDiscipline);
router.get('/:id', authenticateProfessor, getQuestionnaireById);
router.get('/answer/:id', authenticateStudent, getQuestionnaireForAnswering);
router.put('/:id', authenticateProfessor, updateQuestionnaire);
router.delete('/:id', authenticateProfessor, deleteQuestionnaire);

export default router;
