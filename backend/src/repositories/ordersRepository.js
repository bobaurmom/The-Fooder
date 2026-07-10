import { supabase } from '../../supabaseClient.js';

export const ordersRepository = {
	async getFoodsByIds(foodIds) {
		const { data, error } = await supabase
			.from('food_items')
			.select(`
				food_id,
				name,
				description,
				price,
				restaurant_id,
				restaurants (
					restaurant_id,
					name,
					address,
					latitude,
					longitude
				)
			`)
			.in('food_id', foodIds);

		return { data, error };
	},

	async createOrder(orderPayload) {
		const { data, error } = await supabase
			.from('orders')
			.insert(orderPayload)
			.select()
			.single();

		return { data, error };
	},

	async createOrderItems(orderItems) {
		const { data, error } = await supabase
			.from('order_items')
			.insert(orderItems)
			.select();

		return { data, error };
	}
};
