import { ordersRepository } from '../repositories/ordersRepository.js';
import { calculateDeliveryFee, haversineDistanceKm } from '../utils/orderPricing.js';

const buildOrderGroups = (foods, items, userLocation) => {
	const foodById = new Map(foods.map((food) => [Number(food.food_id), food]));
	const groups = new Map();

	for (const rawItem of items) {
		const foodId = Number(rawItem.food_id ?? rawItem.foodId);
		const quantity = Math.max(1, Number(rawItem.quantity ?? 1));
		const food = foodById.get(foodId);

		if (!food) {
			throw new Error(`Food item ${foodId} was not found`);
		}

		const restaurant = food.restaurants;
		const restaurantId = Number(food.restaurant_id ?? restaurant?.restaurant_id);
		const restaurantKey = String(restaurantId);

		if (!groups.has(restaurantKey)) {
			groups.set(restaurantKey, {
				restaurant_id: restaurantId,
				restaurant_name: restaurant?.name || 'Restaurant',
				restaurant_address: restaurant?.address || 'Address not available',
				restaurant_latitude: restaurant?.latitude != null ? Number(restaurant.latitude) : null,
				restaurant_longitude: restaurant?.longitude != null ? Number(restaurant.longitude) : null,
				items: [],
				subtotal: 0,
				delivery_distance_km: null,
				delivery_fee: 0,
				total_price: 0
			});
		}

		const group = groups.get(restaurantKey);
		const itemPrice = Number(food.price) || 0;

		group.items.push({
			food_id: food.food_id,
			name: food.name,
			quantity,
			price_at_purchase: itemPrice
		});
		group.subtotal += itemPrice * quantity;
	}

	const normalizedUserLocation = userLocation && Number.isFinite(Number(userLocation.latitude)) && Number.isFinite(Number(userLocation.longitude))
		? {
			latitude: Number(userLocation.latitude),
			longitude: Number(userLocation.longitude)
		}
		: null;

	for (const group of groups.values()) {
		if (normalizedUserLocation && group.restaurant_latitude != null && group.restaurant_longitude != null) {
			group.delivery_distance_km = Number(
				haversineDistanceKm(
					normalizedUserLocation.latitude,
					normalizedUserLocation.longitude,
					group.restaurant_latitude,
					group.restaurant_longitude
				).toFixed(2)
			);
		} else {
			group.delivery_distance_km = 0;
		}

		group.delivery_fee = calculateDeliveryFee(group.delivery_distance_km);
		group.total_price = Number((group.subtotal + group.delivery_fee).toFixed(2));
	}

	return Array.from(groups.values());
};

const summarizeGroups = (groups) => {
	const subtotal = Number(groups.reduce((sum, group) => sum + group.subtotal, 0).toFixed(2));
	const deliveryFee = Number(groups.reduce((sum, group) => sum + group.delivery_fee, 0).toFixed(2));
	const totalPrice = Number((subtotal + deliveryFee).toFixed(2));

	return {
		subtotal,
		delivery_fee: deliveryFee,
		total_price: totalPrice,
		groups
	};
};

export const ordersService = {
	async quoteOrder(items, userLocation) {
		if (!Array.isArray(items) || items.length === 0) {
			throw new Error('At least one cart item is required');
		}

		const foodIds = items.map((item) => Number(item.food_id ?? item.foodId)).filter(Number.isFinite);
		if (foodIds.length === 0) {
			throw new Error('No valid food items were provided');
		}

		const { data: foods, error } = await ordersRepository.getFoodsByIds(foodIds);
		if (error) {
			throw new Error(error.message);
		}

		if (!foods || foods.length === 0) {
			throw new Error('No matching food items were found');
		}

		const groups = buildOrderGroups(foods, items, userLocation);
		return summarizeGroups(groups);
	},

	async createOrder(userId, items, userLocation, deliveryAddress) {
		const quote = await this.quoteOrder(items, userLocation);
		const createdOrders = [];
		const resolvedAddress = deliveryAddress || (userLocation ? `Coordinates: ${userLocation.latitude}, ${userLocation.longitude}` : 'Delivery address unavailable');

		for (const group of quote.groups) {
			const { data: order, error: orderError } = await ordersRepository.createOrder({
				user_id: userId,
				restaurant_id: group.restaurant_id,
				promo_id: null,
				delivery_address: resolvedAddress,
				subtotal: group.subtotal,
				discount_amount: 0,
				delivery_fee: group.delivery_fee,
				total_price: group.total_price,
				order_status: 'pending'
			});

			if (orderError) {
				throw new Error(orderError.message);
			}

			const orderItems = group.items.map((item) => ({
				order_id: order.order_id,
				food_id: item.food_id,
				quantity: item.quantity,
				price_at_purchase: item.price_at_purchase
			}));

			const { error: orderItemsError } = await ordersRepository.createOrderItems(orderItems);
			if (orderItemsError) {
				throw new Error(orderItemsError.message);
			}

			createdOrders.push({
				order_id: order.order_id,
				restaurant_id: group.restaurant_id,
				restaurant_name: group.restaurant_name,
				delivery_fee: group.delivery_fee,
				delivery_distance_km: group.delivery_distance_km,
				subtotal: group.subtotal,
				total_price: group.total_price
			});
		}

		return {
			success: true,
			...quote,
			orders: createdOrders
		};
	}
};
