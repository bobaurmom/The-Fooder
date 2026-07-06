import { supabase } from '../../supabaseClient.js';

export const swipeRepository = {
	// Create a new swipe record
	async createSwipe(userId, foodId, swipeType) {
		const { data, error } = await supabase
			.from('swipes')
			.insert({
				user_id: userId,
				food_id: foodId,
				swipe_type: swipeType, // 'like' or 'dislike'
				created_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	// Get all swipes by a user
	async getUserSwipes(userId) {
		const { data, error } = await supabase
			.from('swipes')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data;
	},

	// Get all liked foods by a user
	async getUserFavorites(userId) {
		const { data, error } = await supabase
			.from('swipes')
			.select(`
				food_id,
				foods (
					id,
					name,
					price,
					distance_km,
					restaurant_name,
					restaurant_address,
					image_url,
					description,
					category
				)
			`)
			.eq('user_id', userId)
			.eq('swipe_type', 'like')
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data.map((swipe) => swipe.foods);
	},

	// Check if user has already swiped on a food
	async checkExistingSwipe(userId, foodId) {
		const { data, error } = await supabase
			.from('swipes')
			.select('*')
			.eq('user_id', userId)
			.eq('food_id', foodId)
			.single();

		if (error && error.code !== 'PGRST116') throw error;
		return data;
	},

	// Delete a swipe (for undo functionality)
	async deleteSwipe(userId, foodId) {
		const { data, error } = await supabase
			.from('swipes')
			.delete()
			.eq('user_id', userId)
			.eq('food_id', foodId)
			.select();

		if (error) throw error;
		return data;
	},

	// Get swipe statistics for a user
	async getUserSwipeStats(userId) {
		const { data, error } = await supabase
			.from('swipes')
			.select('swipe_type')
			.eq('user_id', userId);

		if (error) throw error;

		const stats = {
			total: data.length,
			likes: data.filter((s) => s.swipe_type === 'like').length,
			dislikes: data.filter((s) => s.swipe_type === 'dislike').length,
		};

		return stats;
	},
};
