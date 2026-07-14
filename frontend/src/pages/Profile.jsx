import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaHeart, FaHistory, FaCog, FaEdit, FaArrowLeft, FaTimes, FaSave, FaLock } from 'react-icons/fa';
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
	const [favoritesLoaded, setFavoritesLoaded] = useState(false);
	const [ordersLoaded, setOrdersLoaded] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [editForm, setEditForm] = useState({ username: '', email: '' });
	const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
	const [message, setMessage] = useState({ type: '', text: '' });

	const handleLogout = () => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('user');
		navigate('/login');
	};

	// Fetch user profile on mount
	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				const token = localStorage.getItem('access_token');
				if (!token) {
					navigate('/login');
					return;
				}

				const profileResponse = await api.get('/profile');
				setUser(profileResponse.data.user);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching profile data:', error);
				setLoading(false);
			}
		};

		fetchProfileData();
	}, [navigate]);

	// Lazy load favorites when tab is activated
	useEffect(() => {
		if (activeTab === 'favorites' && !favoritesLoaded) {
			const fetchFavorites = async () => {
				try {
					const favoritesResponse = await api.get('/swipes/favorites');
					setFavorites(favoritesResponse.data.favorites || []);
					setFavoritesLoaded(true);
				} catch (error) {
					console.error('Error fetching favorites:', error);
				}
			};
			fetchFavorites();
		}
	}, [activeTab, favoritesLoaded]);

	// Lazy load orders when tab is activated
	useEffect(() => {
		if (activeTab === 'orders' && !ordersLoaded) {
			const fetchOrders = async () => {
				try {
					const ordersResponse = await api.get('/orders');
					setOrders(ordersResponse.data.orders || []);
					setOrdersLoaded(true);
				} catch (error) {
					console.error('Error fetching orders:', error);
				}
			};
			fetchOrders();
		}
	}, [activeTab, ordersLoaded]);

	const handleEditProfile = () => {
		setEditForm({ username: user?.username || '', email: user?.email || '' });
		setShowEditModal(true);
	};

	const handleSaveProfile = async (e) => {
		e.preventDefault();
		try {
			const response = await api.put('/profile', {
				username: editForm.username,
				email: editForm.email
			});
			setUser(response.data.user);
			setShowEditModal(false);
			setMessage({ type: 'success', text: 'Profile updated successfully!' });
			setTimeout(() => setMessage({ type: '', text: '' }), 3000);
		} catch (error) {
			console.error('Error updating profile:', error);
			setMessage({ type: 'error', text: 'Failed to update profile' });
		}
	};

	const handleChangePassword = () => {
		setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
		setShowPasswordModal(true);
	};

	const handleSavePassword = async (e) => {
		e.preventDefault();
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			setMessage({ type: 'error', text: 'Passwords do not match' });
			return;
		}
		if (passwordForm.newPassword.length < 6) {
			setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
			return;
		}
		try {
			await api.post('/change-password', {
				currentPassword: passwordForm.currentPassword,
				newPassword: passwordForm.newPassword
			});
			setShowPasswordModal(false);
			setMessage({ type: 'success', text: 'Password changed successfully!' });
			setTimeout(() => setMessage({ type: '', text: '' }), 3000);
		} catch (error) {
			console.error('Error changing password:', error);
			setMessage({ type: 'error', text: 'Failed to change password' });
		}
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
				<div className="pt-24 pb-24 px-4">
					<div className="max-w-4xl mx-auto">
						{/* Skeleton Profile Header */}
						<div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
							<div className="flex items-center gap-6">
								<div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
								<div className="flex-1 space-y-3">
									<div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
									<div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
								</div>
								<div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
							</div>
						</div>

						{/* Skeleton Tabs */}
						<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
							<div className="flex border-b">
								<div className="flex-1 h-16 bg-gray-100 animate-pulse"></div>
								<div className="flex-1 h-16 bg-gray-50 animate-pulse"></div>
								<div className="flex-1 h-16 bg-gray-50 animate-pulse"></div>
							</div>
							<div className="p-6 space-y-4">
								<div className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
								<div className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
							</div>
						</div>
					</div>
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
											<button
												onClick={handleChangePassword}
												className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
											>
												<span>Change Password</span>
												<FaArrowLeft className="rotate-180 text-gray-400" />
											</button>
											<button className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between opacity-50 cursor-not-allowed">
												<span>Notification Settings</span>
												<span className="text-gray-400 text-sm">Coming soon</span>
											</button>
											<button className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between opacity-50 cursor-not-allowed">
												<span>Privacy Settings</span>
												<span className="text-gray-400 text-sm">Coming soon</span>
											</button>
										</div>
									</div>
									<button onClick={handleLogout} className="w-full px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium">
										Logout
									</button>
									{message.text && (
										<div className={`mt-4 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
											{message.text}
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer />

			{/* Edit Profile Modal */}
			{showEditModal && (
				<div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
							<button
								onClick={() => setShowEditModal(false)}
								className="text-gray-500 hover:text-gray-700 transition-colors"
							>
								<FaTimes />
							</button>
						</div>
						<form onSubmit={handleSaveProfile} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
								<input
									type="text"
									value={editForm.username}
									onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
								<input
									type="email"
									value={editForm.email}
									onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
									required
								/>
							</div>
							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={() => setShowEditModal(false)}
									className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium flex items-center justify-center gap-2"
								>
									<FaSave /> Save Changes
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Change Password Modal */}
			{showPasswordModal && (
				<div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
							<button
								onClick={() => setShowPasswordModal(false)}
								className="text-gray-500 hover:text-gray-700 transition-colors"
							>
								<FaTimes />
							</button>
						</div>
						<form onSubmit={handleSavePassword} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
								<input
									type="password"
									value={passwordForm.currentPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
								<input
									type="password"
									value={passwordForm.newPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
									required
									minLength="6"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
								<input
									type="password"
									value={passwordForm.confirmPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
									required
									minLength="6"
								/>
							</div>
							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={() => setShowPasswordModal(false)}
									className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium flex items-center justify-center gap-2"
								>
									<FaLock /> Change Password
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
