import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Cart() {
	const navigate = useNavigate();
	const [cartItems, setCartItems] = useState([]);

	const deliveryFeeFromDistance = (items) => {
		const distances = items
			.map((item) => Number(item.distance_km))
			.filter((distance) => Number.isFinite(distance) && distance >= 0);

		const longestDistance = distances.length > 0 ? Math.max(...distances) : 0;
		const baseFee = 1.5;
		const perKmFee = 0.35;

		return baseFee + longestDistance * perKmFee;
	};

	useEffect(() => {
		loadCart();
	}, []);

	const loadCart = () => {
		const savedCart = localStorage.getItem('fooder_cart');
		setCartItems(savedCart ? JSON.parse(savedCart) : []);
	};

	const handleRemoveFromCart = (foodId) => {
		const updatedCart = cartItems.filter(item => item.food_id !== foodId);
		setCartItems(updatedCart);
		localStorage.setItem('fooder_cart', JSON.stringify(updatedCart));
		window.dispatchEvent(new Event('storage'));
	};

	const handleClearCart = () => {
		setCartItems([]);
		localStorage.removeItem('fooder_cart');
		window.dispatchEvent(new Event('storage'));
	};

	const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
	const deliveryFee = deliveryFeeFromDistance(cartItems).toFixed(2);
	const grandTotal = (parseFloat(totalPrice) + parseFloat(deliveryFee)).toFixed(2);

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
			<div className="pt-58 px-4 pb-32 max-w-2xl mx-auto w-full">
				{cartItems.length === 0 ? (
					<div className="text-center py-12">
						<FaShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-500">Your cart is empty</p>
						<p className="text-sm text-gray-400 mt-2">Add items from the swipe deck</p>
					</div>
				) : (
					<>
						<div className="space-y-4 mb-6">
							{cartItems.map((item) => (
								<div
									key={item.food_id}
									className="bg-white rounded-xl p-4 shadow-sm flex gap-4"
								>
									<img
										src={item.image_url}
										alt={item.name}
										className="w-20 h-20 object-cover rounded-lg"
									/>
									<div className="flex-1">
										<h3 className="font-semibold text-gray-900">{item.name}</h3>
										<p className="text-sm text-gray-500">{item.restaurant_name}</p>
										<p className="text-lg font-bold text-gray-900 mt-1">${parseFloat(item.price).toFixed(2)}</p>
									</div>
									<button
										onClick={() => handleRemoveFromCart(item.food_id)}
										className="text-red-500 hover:text-red-700 transition-colors self-start"
									>
										<FaTrash />
									</button>
								</div>
							))}
						</div>

						<div className="bg-white rounded-xl p-6 shadow-sm">
							<div className="flex justify-between items-center mb-4">
								<span className="text-gray-600">Subtotal</span>
								<span className="text-xl font-bold text-gray-900">${totalPrice}</span>
							</div>
							<div className="flex justify-between items-center mb-6">
								<span className="text-gray-600">Delivery fee</span>
								<span className="text-gray-900">${deliveryFee}</span>
							</div>
							<div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
								<span className="text-lg font-semibold text-gray-900">Total</span>
								<span className="text-2xl font-bold text-gray-900">${grandTotal}</span>
							</div>
							<button
								onClick={handleClearCart}
								className="w-full py-3 px-4 rounded-xl border border-red-300 text-red-600 font-medium hover:bg-red-50 transition-colors mb-3"
							>
								Clear Cart
							</button>
							<button
								onClick={() => navigate('/checkout')}
								className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
							>
								Checkout
							</button>
						</div>
					</>
				)}
			</div>
			<Footer />
		</div>
	);
}
