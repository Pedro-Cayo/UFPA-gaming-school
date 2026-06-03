import express from 'express';
import {
  createDiscipline,
  getDisciplinesByProfessor,
  getAllDisciplines,
  getDisciplineById,
  updateDiscipline,
  deleteDiscipline
} from '../controllers/disciplineController.js';
import { authenticateToken, authenticateProfessor } from '../helpers/auth.js';

const router = express.Router();

router.post('/', authenticateProfessor, createDiscipline);
router.get('/professor/my-disciplines', authenticateProfessor, getDisciplinesByProfessor);
router.get('/all', authenticateToken, getAllDisciplines);
router.get('/:id', authenticateToken, getDisciplineById);
router.put('/:id', authenticateProfessor, updateDiscipline);
router.delete('/:id', authenticateProfessor, deleteDiscipline);

export default router;
