import express from 'express';
import { profileController } from '../controllers/profileController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All profile routes require authentication
router.use(verifyToken);

router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);
router.get('/favorites', profileController.getFavorites);
router.post('/favorites', profileController.addFavorite);
router.delete('/favorites/:foodId', profileController.removeFavorite);
router.get('/orders', profileController.getOrders);
router.post('/change-password', profileController.changePassword);

export default router;
