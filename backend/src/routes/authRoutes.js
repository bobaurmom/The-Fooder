import express from 'express';
import { authController } from '../controllers/authController.js';
import { verifyToken, requireGuest } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', requireGuest, authController.register);
router.post('/login', requireGuest, authController.login);
router.get('/user', verifyToken, authController.getUser);
router.post('/logout', verifyToken, authController.logout);



export default router;
