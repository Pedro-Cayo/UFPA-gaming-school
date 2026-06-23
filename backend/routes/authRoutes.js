import express from 'express';
import { register, login, logout, getProfile, updateProfilePhoto } from '../controllers/authController.js';
import { authenticateToken } from '../helpers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authenticateToken, getProfile);
router.put('/update-photo', authenticateToken, updateProfilePhoto);

export default router;
