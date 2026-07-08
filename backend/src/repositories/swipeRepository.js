import { supabase } from '../../supabaseClient.js';

export const swipeRepository = {
	// Create a new swipe record
	async createSwipe(userId, foodId, swipeType) {
		const { data, error } = await supabase
			.from('swipe_logs')
			.insert({
				user_id: userId,
				food_id: foodId,
				action: swipeType === 'like' ? 'favorite' : 'pass',
				swiped_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	// Get all swipes by a user
	async getUserSwipes(userId) {
		const { data, error } = await supabase
			.from('swipe_logs')
			.select('*')
			.eq('user_id', userId)
			.order('swiped_at', { ascending: false });

		if (error) throw error;
		return data;
	},

	// Get all liked foods by a user
	async getUserFavorites(userId) {
		const { data, error } = await supabase
			.from('swipe_logs')
			.select(`
				food_id,
				food_items (
					food_id,
					name,
					price,
					image_url,
					description,
					restaurants (
						name,
						address
					)
				)
			`)
			.eq('user_id', userId)
			.eq('action', 'favorite')
			.order('swiped_at', { ascending: false });

		if (error) throw error;
		return data.map((swipe) => ({
			food_id: swipe.food_items.food_id,
			name: swipe.food_items.name,
			price: swipe.food_items.price,
			image_url: swipe.food_items.image_url,
			description: swipe.food_items.description,
			restaurant_name: swipe.food_items.restaurants.name,
			restaurant_address: swipe.food_items.restaurants.address,
		}));
	},

	// Check if user has already swiped on a food
	async checkExistingSwipe(userId, foodId) {
		const { data, error } = await supabase
			.from('swipe_logs')
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
			.from('swipe_logs')
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
			.from('swipe_logs')
			.select('action')
			.eq('user_id', userId);

		if (error) throw error;

		const stats = {
			total: data.length,
			likes: data.filter((s) => s.action === 'favorite').length,
			dislikes: data.filter((s) => s.action === 'pass').length,
		};

		return stats;
	},
};
