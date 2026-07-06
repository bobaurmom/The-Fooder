import express from 'express';
import  swipeController  from '../controllers/swipeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All swipe routes require authentication
router.use(verifyToken);

/**
 * @route   POST /api/swipes
 * @desc    Record a swipe (like or dislike) on a food
 * @access  Private
 * @body    { food_id: number, swipe_type: 'like' | 'dislike' }
 */
router.post('/', swipeController.recordSwipe);

/**
 * @route   GET /api/swipes/favorites
 * @desc    Get user's favorite (liked) foods
 * @access  Private
 */
router.get('/favorites', swipeController.getFavorites);

/**
 * @route   GET /api/swipes/stats
 * @desc    Get user's swipe statistics (total, likes, dislikes)
 * @access  Private
 */
router.get('/stats', swipeController.getSwipeStats);

/**
 * @route   GET /api/swipes/history
 * @desc    Get user's complete swipe history
 * @access  Private
 */
router.get('/history', swipeController.getSwipeHistory);

/**
 * @route   DELETE /api/swipes/favorites/:foodId
 * @desc    Remove a food from user's favorites
 * @access  Private
 * @params  foodId - ID of the food to remove
 */
router.delete('/favorites/:foodId', swipeController.removeFavorite);

export default router;
