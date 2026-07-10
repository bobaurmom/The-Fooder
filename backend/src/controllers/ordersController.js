import { ordersService } from '../services/ordersService.js';

export const ordersController = {
	async quoteOrder(req, res) {
		try {
			const { items, userLocation } = req.body;
			const result = await ordersService.quoteOrder(items, userLocation);

			return res.json({
				success: true,
				...result
			});
		} catch (error) {
			console.error('QUOTE ORDER CONTROLLER ERROR:', error);
			return res.status(400).json({
				error: error.message || 'Failed to calculate delivery fee'
			});
		}
	},

	async createOrder(req, res) {
		try {
			const { items, userLocation, deliveryAddress } = req.body;
			const userId = req.user.id;
			const result = await ordersService.createOrder(userId, items, userLocation, deliveryAddress);

			return res.status(201).json(result);
		} catch (error) {
			console.error('CREATE ORDER CONTROLLER ERROR:', error);
			return res.status(400).json({
				error: error.message || 'Failed to create order'
			});
		}
	}
};
