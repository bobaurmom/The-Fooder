import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';
import { getCurrentLocation } from '../utils/geolocation';

export default function Checkout() {
	const navigate = useNavigate();
	const [cartItems, setCartItems] = useState([]);
	const [selectedPayment, setSelectedPayment] = useState('credit');
	const [saveCard, setSaveCard] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [quote, setQuote] = useState(null);
	const [quoteLoading, setQuoteLoading] = useState(false);
	const [quoteError, setQuoteError] = useState('');
	const [creatingOrder, setCreatingOrder] = useState(false);
	const [userLocation, setUserLocation] = useState(null);

	useEffect(() => {
		loadCart();
		getCurrentLocation()
			.then((location) => setUserLocation(location))
			.catch((error) => {
				console.error('Failed to get location for checkout quote:', error.message);
				setUserLocation(null);
			});
	}, []);

	useEffect(() => {
		const fetchQuote = async () => {
			if (cartItems.length === 0) {
				setQuote(null);
				setQuoteError('');
				return;
			}

			try {
				setQuoteLoading(true);
				setQuoteError('');

				const response = await api.post('/orders/quote', {
					items: cartItems.map((item) => ({
						food_id: item.food_id,
						quantity: item.quantity || 1
					})),
					userLocation
				});

				setQuote(response.data);
			} catch (error) {
				console.error('Failed to fetch checkout quote:', error);
				setQuoteError(error.response?.data?.error || 'Failed to calculate order total');
				setQuote(null);
			} finally {
				setQuoteLoading(false);
			}
		};

		fetchQuote();
	}, [cartItems, userLocation]);

	const loadCart = () => {
		const savedCart = localStorage.getItem('fooder_cart');
		setCartItems(savedCart ? JSON.parse(savedCart) : []);
	};

	const subtotal = quote?.subtotal ?? 0;
	const deliveryFee = quote?.delivery_fee ?? 0;
	const total = quote?.total_price ?? 0;

	const handlePayNow = async () => {
		try {
			setCreatingOrder(true);
			setQuoteError('');

			const response = await api.post('/orders', {
				items: cartItems.map((item) => ({
					food_id: item.food_id,
					quantity: item.quantity || 1
				})),
				userLocation
			});

			setQuote(response.data);
			setShowSuccess(true);
			localStorage.removeItem('fooder_cart');
			window.dispatchEvent(new Event('storage'));
		} catch (error) {
			console.error('Failed to create order:', error);
			setQuoteError(error.response?.data?.error || 'Failed to create order');
		} finally {
			setCreatingOrder(false);
		}
	};

	const handleGoBack = () => {
		navigate('/fyp');
	};

	if (showSuccess) {
		return (
			<div className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
				<div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<FaCheckCircle className="w-12 h-12 text-green-500" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Success!</h2>
					<p className="text-gray-600 mb-6">
						Your payment was successful. A receipt for this purchase has been sent to your email.
					</p>
					<button
						onClick={handleGoBack}
						className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-pink-500 to-purple-500 text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100">
			<Header />
			<div className="pt-38 px-4 pb-32 max-w-2xl mx-auto w-full">
				<button
					onClick={() => navigate('/cart')}
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
				>
					<FaArrowLeft />
					<span>Back to Cart</span>
				</button>

				<h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

				{/* Order Summary */}
				<div className="bg-white rounded-xl p-6 shadow-sm mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>
					<div className="space-y-3 mb-4">
						{cartItems.map((item) => (
							<div key={item.food_id} className="flex justify-between text-sm">
								<span className="text-gray-600">{item.name}</span>
								<span className="text-gray-900">${parseFloat(item.price).toFixed(2)}</span>
							</div>
						))}
					</div>
					<div className="border-t border-gray-200 pt-3 space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-gray-600">Order total</span>
							<span className="text-gray-900">{quoteLoading ? '...' : `$${subtotal.toFixed(2)}`}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-600">Delivery fees</span>
							<span className="text-gray-900">{quoteLoading ? '...' : `$${deliveryFee.toFixed(2)}`}</span>
						</div>
						<div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
							<span>Total</span>
							<span>{quoteLoading ? '...' : `$${total.toFixed(2)}`}</span>
						</div>
					</div>
					{quoteError && <p className="mt-4 text-sm text-red-600">{quoteError}</p>}
					<div className="mt-4 p-3 bg-purple-50 rounded-lg">
						<p className="text-sm text-purple-700">
							<strong>Estimated delivery time:</strong> 15 - 30 mins
						</p>
					</div>
				</div>

				{/* Payment Methods */}
				<div className="bg-white rounded-xl p-6 shadow-sm mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Payment methods</h2>
					<div className="space-y-3">
						<label
							className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
								selectedPayment === 'credit'
									? 'border-pink-500 bg-pink-50'
									: 'border-gray-200 hover:border-gray-300'
							}`}
						>
							<input
								type="radio"
								name="payment"
								value="credit"
								checked={selectedPayment === 'credit'}
								onChange={(e) => setSelectedPayment(e.target.value)}
								className="sr-only"
							/>
							<div className="w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center">
								{selectedPayment === 'credit' && (
									<div className="w-3 h-3 bg-pink-500 rounded-full" />
								)}
							</div>
							<FaCreditCard className="text-gray-600 mr-3" />
							<div className="flex-1">
								<p className="font-medium text-gray-900">Credit card</p>
								<p className="text-sm text-gray-500">Mastercard ending in 0505</p>
							</div>
						</label>

						<label
							className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
								selectedPayment === 'debit'
									? 'border-pink-500 bg-pink-50'
									: 'border-gray-200 hover:border-gray-300'
							}`}
						>
							<input
								type="radio"
								name="payment"
								value="debit"
								checked={selectedPayment === 'debit'}
								onChange={(e) => setSelectedPayment(e.target.value)}
								className="sr-only"
							/>
							<div className="w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center">
								{selectedPayment === 'debit' && (
									<div className="w-3 h-3 bg-pink-500 rounded-full" />
								)}
							</div>
							<FaCreditCard className="text-gray-600 mr-3" />
							<div className="flex-1">
								<p className="font-medium text-gray-900">Debit card</p>
								<p className="text-sm text-gray-500">VISA ending in 0505</p>
							</div>
						</label>
					</div>

					<label className="flex items-center mt-4 cursor-pointer">
						<input
							type="checkbox"
							checked={saveCard}
							onChange={(e) => setSaveCard(e.target.checked)}
							className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
						/>
						<span className="ml-2 text-sm text-gray-600">Save card details for future payments</span>
					</label>
				</div>

				{/* Total and Pay Button */}
				<div className="bg-white rounded-xl p-6 shadow-sm">
					<div className="flex justify-between items-center mb-4">
						<span className="text-lg text-gray-600">Total price</span>
						<span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
					</div>
					<button
						onClick={handlePayNow}
						disabled={creatingOrder || quoteLoading || cartItems.length === 0}
						className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-pink-500 to-purple-500 text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
					>
						{creatingOrder ? 'Processing...' : 'Pay Now'}
					</button>
				</div>
			</div>
			<Footer />
		</div>
	);
}
