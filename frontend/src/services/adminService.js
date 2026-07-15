import api from './api.js';

export const adminService = {
  // Database Backup & Recovery
  async downloadBackup() {
    const response = await api.get('/admin/backup/download', {
      responseType: 'blob'
    });
    return response;
  },

  async restoreBackup(file) {
    const formData = new FormData();
    formData.append('backup', file);

    const response = await api.post('/admin/backup/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Order & Delivery Management
  async getAllOrders(status, page = 1, limit = 20) {
    const params = { page, limit };
    if (status) params.status = status;

    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  async getOrderById(orderId) {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data;
  },

  async updateOrderStatus(orderId, status) {
    const response = await api.put(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  async getOrderStats() {
    const response = await api.get('/admin/orders/stats');
    return response.data;
  },

  // Merchant & Restaurant Management
  async getAllRestaurants(page = 1, limit = 20) {
    const response = await api.get('/admin/restaurants', {
      params: { page, limit }
    });
    return response.data;
  },

  async createRestaurant(restaurantData) {
    const response = await api.post('/admin/restaurants', restaurantData);
    return response.data;
  },

  async updateRestaurant(restaurantId, restaurantData) {
    const response = await api.put(`/admin/restaurants/${restaurantId}`, restaurantData);
    return response.data;
  },

  async deleteRestaurant(restaurantId) {
    const response = await api.delete(`/admin/restaurants/${restaurantId}`);
    return response.data;
  },

  async getRestaurantStats(restaurantId) {
    const response = await api.get(`/admin/restaurants/${restaurantId}/stats`);
    return response.data;
  },

  // System Settings & Security
  async getSystemSettings() {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  async updateSystemSettings(settings) {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },

  async getAllUsers(page = 1, limit = 20) {
    const response = await api.get('/admin/users', {
      params: { page, limit }
    });
    return response.data;
  },

  async updateUserRole(userId, role) {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Super Admin: Create Admin with Grants
  async createAdminWithGrants(adminData, grants) {
    const response = await api.post('/admin/admins/create-with-grants', { adminData, grants });
    return response.data;
  }
};
