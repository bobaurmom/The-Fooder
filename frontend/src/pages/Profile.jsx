import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaHeart, FaHistory, FaCog, FaEdit, FaArrowLeft } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';

export default function Profile() {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [favorites, setFavorites] = useState([]);
	const [orders, setOrders] = useState([]);
	const [activeTab, setActiveTab] = useState('favorites');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const token = localStorage.getItem('access_token');
				if (!token) {
					navigate('/login');
					return;
				}

				// Fetch user profile
				const profileResponse = await api.get('/profile');
				setUser(profileResponse.data.user);

				// Fetch favorites
				const favoritesResponse = await api.get('/favorites');
				setFavorites(favoritesResponse.data.favorites || []);

				// Fetch orders
				const ordersResponse = await api.get('/orders');
				setOrders(ordersResponse.data.orders || []);

				setLoading(false);
			} catch (error) {
				console.error('Error fetching profile data:', error);
				setLoading(false);
			}
		};

		fetchProfileData();
	}, [navigate]);

	const handleEditProfile = () => {
		// Navigate to edit profile page (to be implemented)
		console.log('Edit profile clicked');
	};

	const handleRemoveFavorite = async (foodId) => {
		try {
			await api.delete(`/favorites/${foodId}`);
			const updatedFavorites = favorites.filter(f => f.food_id !== foodId);
			setFavorites(updatedFavorites);
		} catch (error) {
			console.error('Error removing favorite:', error);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
				<Header />
				<div className="pt-24 pb-24 px-4 flex items-center justify-center min-h-screen">
					<div className="text-center text-gray-500">Loading profile...</div>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
			<div className="pt-24 pb-24 px-4">
				<div className="max-w-4xl mx-auto">
					{/* Back button */}
					<button
						onClick={() => navigate('/fyp')}
						className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
					>
						<FaArrowLeft /> Back to Home
					</button>

					{/* Profile Header */}
					<div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
						<div className="flex items-center gap-6">
							<div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
								{user?.username?.charAt(0).toUpperCase() || 'U'}
							</div>
							<div className="flex-1">
								<h1 className="text-3xl font-bold text-gray-800">{user?.username || 'User'}</h1>
								<div className="flex items-center gap-2 text-gray-600 mt-1">
									<FaEnvelope />
									<span>{user?.email || 'user@example.com'}</span>
								</div>
							</div>
							<button
								onClick={handleEditProfile}
								className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md"
							>
								<FaEdit /> Edit Profile
							</button>
						</div>
					</div>

					{/* Tabs */}
					<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
						<div className="flex border-b">
							<button
								onClick={() => setActiveTab('favorites')}
								className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors ${
									activeTab === 'favorites'
										? 'text-red-600 border-b-2 border-red-600 bg-red-50'
										: 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
								}`}
							>
								<FaHeart /> Favorites
							</button>
							<button
								onClick={() => setActiveTab('orders')}
								className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors ${
									activeTab === 'orders'
										? 'text-red-600 border-b-2 border-red-600 bg-red-50'
										: 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
								}`}
							>
								<FaHistory /> Order History
							</button>
							<button
								onClick={() => setActiveTab('settings')}
								className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-colors ${
									activeTab === 'settings'
										? 'text-red-600 border-b-2 border-red-600 bg-red-50'
										: 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
								}`}
							>
								<FaCog /> Settings
							</button>
						</div>

						{/* Tab Content */}
						<div className="p-6">
							{activeTab === 'favorites' && (
								<div>
									{favorites.length === 0 ? (
										<div className="text-center text-gray-500 py-8">
											<FaHeart className="text-4xl mb-4 mx-auto text-gray-300" />
											<p>No favorites yet</p>
										</div>
									) : (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{favorites.map((food) => (
												<div key={food.food_id} className="bg-gray-50 rounded-xl p-4 flex gap-4">
													<img
														src={food.image_url}
														alt={food.name}
														className="w-20 h-20 object-cover rounded-lg"
													/>
													<div className="flex-1">
														<h3 className="font-semibold text-gray-800">{food.name}</h3>
														<p className="text-sm text-gray-600">{food.restaurant_name}</p>
														<p className="text-red-600 font-bold mt-1">${Number(food.price).toFixed(2)}</p>
													</div>
													<button
														onClick={() => handleRemoveFavorite(food.food_id)}
														className="text-red-500 hover:text-red-700 transition-colors"
													>
														<FaHeart />
													</button>
												</div>
											))}
										</div>
									)}
								</div>
							)}

							{activeTab === 'orders' && (
								<div>
									{orders.length === 0 ? (
										<div className="text-center text-gray-500 py-8">
											<FaHistory className="text-4xl mb-4 mx-auto text-gray-300" />
											<p>No orders yet</p>
										</div>
									) : (
										<div className="space-y-4">
											{orders.map((order) => (
												<div key={order.id} className="bg-gray-50 rounded-xl p-4">
													<div className="flex justify-between items-start mb-2">
														<div>
															<h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
															<p className="text-sm text-gray-600">{order.date}</p>
														</div>
														<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
															{order.status}
														</span>
													</div>
													<div className="border-t pt-2 mt-2">
														<p className="text-sm text-gray-600">{order.items} items</p>
														<p className="font-bold text-gray-800 mt-1">${order.total.toFixed(2)}</p>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							)}

							{activeTab === 'settings' && (
								<div className="space-y-4">
									<div className="bg-gray-50 rounded-xl p-4">
										<h3 className="font-semibold text-gray-800 mb-4">Account Settings</h3>
										<div className="space-y-3">
											<button className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
												<span>Change Password</span>
												<FaArrowLeft className="rotate-180 text-gray-400" />
											</button>
											<button className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
												<span>Notification Settings</span>
												<FaArrowLeft className="rotate-180 text-gray-400" />
											</button>
											<button className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
												<span>Privacy Settings</span>
												<FaArrowLeft className="rotate-180 text-gray-400" />
											</button>
										</div>
									</div>
									<div className="bg-gray-50 rounded-xl p-4">
										<h3 className="font-semibold text-gray-800 mb-4">App Settings</h3>
										<div className="space-y-3">
											<button className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
												<span>Language</span>
												<span className="text-gray-500">English</span>
											</button>
											<button className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between">
												<span>Currency</span>
												<span className="text-gray-500">USD</span>
											</button>
										</div>
									</div>
									<button className="w-full px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium">
										Logout
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}
