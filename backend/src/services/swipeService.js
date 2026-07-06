import { swipeRepository } from '../repositories/swipeRepository.js';

export const swipeService = {
	// Record a swipe (like or dislike)
	async recordSwipe(userId, foodId, swipeType) {
		// Validate swipe type
		if (!['like', 'dislike'].includes(swipeType)) {
			throw new Error('Invalid swipe type. Must be "like" or "dislike"');
		}

		// Check if user already swiped on this food
		const existingSwipe = await swipeRepository.checkExistingSwipe(userId, foodId);
		if (existingSwipe) {
			// Update existing swipe if different type
			if (existingSwipe.swipe_type !== swipeType) {
				await swipeRepository.deleteSwipe(userId, foodId);
				return await swipeRepository.createSwipe(userId, foodId, swipeType);
			}
			// Return existing if same type
			return existingSwipe;
		}

		// Create new swipe
		const swipe = await swipeRepository.createSwipe(userId, foodId, swipeType);
		return swipe;
	},

	// Get all favorites (liked foods) for a user
	async getFavorites(userId) {
		const favorites = await swipeRepository.getUserFavorites(userId);
		return {
			success: true,
			count: favorites.length,
			favorites,
		};
	},

	// Get swipe statistics for a user
	async getSwipeStats(userId) {
		const stats = await swipeRepository.getUserSwipeStats(userId);
		return {
			success: true,
			...stats,
		};
	},

	// Remove a food from favorites
	async removeFavorite(userId, foodId) {
		const result = await swipeRepository.deleteSwipe(userId, foodId);
		return {
			success: true,
			message: 'Favorite removed successfully',
			deleted: result,
		};
	},

	// Get all swipes history for a user
	async getSwipeHistory(userId) {
		const swipes = await swipeRepository.getUserSwipes(userId);
		return {
			success: true,
			count: swipes.length,
			swipes,
		};
	},
};
