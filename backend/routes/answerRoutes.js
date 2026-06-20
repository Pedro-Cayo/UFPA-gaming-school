import express from 'express';
import {
  submitAnswers,
  getStudentAnswers,
  getAnswersByDiscipline,
  getRankingByDiscipline,
  getGeneralRanking
} from '../controllers/answerController.js';
import { authenticateToken, authenticateStudent } from '../helpers/auth.js';

const router = express.Router();

router.post('/submit', authenticateStudent, submitAnswers);
router.get('/my-answers', authenticateStudent, getStudentAnswers);
router.get('/discipline/:disciplineId', authenticateStudent, getAnswersByDiscipline);
router.get('/ranking/general', authenticateToken, getGeneralRanking);
router.get('/ranking/:disciplineId', authenticateToken, getRankingByDiscipline);

export default router;
