import express from 'express';
import { authController } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', verifyToken, authController.getUser);
router.post('/logout', verifyToken, authController.logout);



export default router;
