import { swipeService } from '../services/swipeService.js';

const swipeController = {
	// POST /api/swipes - Record a swipe (like or dislike)
	async recordSwipe(req, res) {
		try {
			const { food_id, swipe_type } = req.body;
			const userId = req.user.id; // From auth middleware

			// Validate required fields
			if (!food_id || !swipe_type) {
				return res.status(400).json({
					error: 'food_id and swipe_type are required',
				});
			}

			// Validate swipe_type
			if (!['like', 'dislike'].includes(swipe_type)) {
				return res.status(400).json({
					error: 'swipe_type must be either "like" or "dislike"',
				});
			}

			const swipe = await swipeService.recordSwipe(userId, food_id, swipe_type);

			return res.status(201).json({
				success: true,
				message: swipe_type === 'like' ? 'Food added to favorites' : 'Food disliked',
				swipe,
			});
		} catch (error) {
			console.error('Record swipe error:', error);
			return res.status(500).json({
				error: error.message || 'Failed to record swipe',
			});
		}
	},

	// GET /api/swipes/favorites - Get user's favorite foods
	async getFavorites(req, res) {
		try {
			const userId = req.user.id; // From auth middleware

			const result = await swipeService.getFavorites(userId);

			return res.status(200).json(result);
		} catch (error) {
			console.error('Get favorites error:', error);
			return res.status(500).json({
				error: error.message || 'Failed to fetch favorites',
			});
		}
	},

	// GET /api/swipes/stats - Get user's swipe statistics
	async getSwipeStats(req, res) {
		try {
			const userId = req.user.id; // From auth middleware

			const stats = await swipeService.getSwipeStats(userId);

			return res.status(200).json(stats);
		} catch (error) {
			console.error('Get swipe stats error:', error);
			return res.status(500).json({
				error: error.message || 'Failed to fetch swipe statistics',
			});
		}
	},

	// DELETE /api/swipes/favorites/:foodId - Remove food from favorites
	async removeFavorite(req, res) {
		try {
			const { foodId } = req.params;
			const userId = req.user.id; // From auth middleware

			if (!foodId) {
				return res.status(400).json({
					error: 'foodId is required',
				});
			}

			const result = await swipeService.removeFavorite(userId, foodId);

			return res.status(200).json(result);
		} catch (error) {
			console.error('Remove favorite error:', error);
			return res.status(500).json({
				error: error.message || 'Failed to remove favorite',
			});
		}
	},

	// GET /api/swipes/history - Get user's swipe history
	async getSwipeHistory(req, res) {
		try {
			const userId = req.user.id; // From auth middleware

			const result = await swipeService.getSwipeHistory(userId);

			return res.status(200).json(result);
		} catch (error) {
			console.error('Get swipe history error:', error);
			return res.status(500).json({
				error: error.message || 'Failed to fetch swipe history',
			});
		}
	},
};

export default swipeController;