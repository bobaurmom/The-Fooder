import { useState, useEffect } from 'react';
import { FiHome, FiPlus, FiEdit, FiTrash2, FiEye, FiLoader } from 'react-icons/fi';
import { adminService } from '../services/adminService.js';

export default function RestaurantManagement() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedRestaurantStats, setSelectedRestaurantStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    rating: 0,
    is_active: true
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllRestaurants();
      setRestaurants(data.restaurants || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      rating: 0,
      is_active: true
    });
    setShowModal(true);
  };

  const handleEdit = (restaurant) => {
    setIsEditing(true);
    setSelectedRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      address: restaurant.address,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      rating: restaurant.rating,
      is_active: restaurant.is_active
    });
    setShowModal(true);
  };

  const handleViewStats = async (restaurantId) => {
    try {
      const stats = await adminService.getRestaurantStats(restaurantId);
      setSelectedRestaurantStats(stats);
      setSelectedRestaurant(restaurants.find(r => r.restaurant_id === restaurantId));
      setShowStatsModal(true);
    } catch (error) {
      console.error('Error fetching restaurant stats:', error);
    }
  };

  const handleDelete = async (restaurantId) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    
    try {
      await adminService.deleteRestaurant(restaurantId);
      await fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Failed to delete restaurant');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await adminService.updateRestaurant(selectedRestaurant.restaurant_id, formData);
      } else {
        await adminService.createRestaurant(formData);
      }
      setShowModal(false);
      await fetchRestaurants();
    } catch (error) {
      console.error('Error saving restaurant:', error);
      alert('Failed to save restaurant');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Merchant & Restaurant Management</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus />
          Add Restaurant
        </button>
      </div>

      {/* Restaurants Grid */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center">
          <FiLoader className="animate-spin text-2xl text-gray-400" />
        </div>
      ) : restaurants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          No restaurants found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.restaurant_id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                  <p className="text-sm text-gray-500">{restaurant.address}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  restaurant.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center gap-1 mb-3">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium">{restaurant.rating?.toFixed(1) || 'N/A'}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewStats(restaurant.restaurant_id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                >
                  <FiEye />
                  Stats
                </button>
                <button
                  onClick={() => handleEdit(restaurant)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition"
                >
                  <FiEdit />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(restaurant.restaurant_id)}
                  className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isEditing ? 'Edit Restaurant' : 'Add Restaurant'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && selectedRestaurant && selectedRestaurantStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">{selectedRestaurant.name} - Stats</h3>
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedRestaurantStats.totalOrders}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">${selectedRestaurantStats.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Orders by Status</p>
                  <div className="space-y-2">
                    {Object.entries(selectedRestaurantStats.byStatus).map(([status, count]) => (
                      <div key={status} className="flex justify-between text-sm">
                        <span className="capitalize">{status.replace('_', ' ')}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Food Items</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedRestaurantStats.totalFoodItems}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-orange-600">{selectedRestaurantStats.availableFoodItems}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
