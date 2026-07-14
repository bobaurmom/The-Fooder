import { adminService } from '../services/adminService.js';

export const adminController = {
  async downloadBackup(req, res) {
    try {
      const backup = await adminService.createBackup();
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=backup-${backup.timestamp}.json`);
      
      return res.send(backup.data);
    } catch (error) {
      console.error('DOWNLOAD BACKUP CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to create backup'
      });
    }
  },

  async restoreBackup(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No backup file provided'
        });
      }

      const result = await adminService.restoreBackup(req.file);
      
      return res.json({
        success: true,
        message: 'Database restored successfully',
        details: result
      });
    } catch (error) {
      console.error('RESTORE BACKUP CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to restore backup'
      });
    }
  },

  // Order & Delivery Management
  async getAllOrders(req, res) {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const orders = await adminService.getAllOrders(status, parseInt(page), parseInt(limit));
      return res.json(orders);
    } catch (error) {
      console.error('GET ALL ORDERS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch orders'
      });
    }
  },

  async getOrderById(req, res) {
    try {
      const { orderId } = req.params;
      const order = await adminService.getOrderById(orderId);
      return res.json(order);
    } catch (error) {
      console.error('GET ORDER BY ID CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch order'
      });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const order = await adminService.updateOrderStatus(orderId, status);
      return res.json(order);
    } catch (error) {
      console.error('UPDATE ORDER STATUS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to update order status'
      });
    }
  },

  async getOrderStats(req, res) {
    try {
      const stats = await adminService.getOrderStats();
      return res.json(stats);
    } catch (error) {
      console.error('GET ORDER STATS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch order stats'
      });
    }
  },

  // Merchant & Restaurant Management
  async getAllRestaurants(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const restaurants = await adminService.getAllRestaurants(parseInt(page), parseInt(limit));
      return res.json(restaurants);
    } catch (error) {
      console.error('GET ALL RESTAURANTS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch restaurants'
      });
    }
  },

  async createRestaurant(req, res) {
    try {
      const restaurant = await adminService.createRestaurant(req.body);
      return res.status(201).json(restaurant);
    } catch (error) {
      console.error('CREATE RESTAURANT CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to create restaurant'
      });
    }
  },

  async updateRestaurant(req, res) {
    try {
      const { restaurantId } = req.params;
      const restaurant = await adminService.updateRestaurant(restaurantId, req.body);
      return res.json(restaurant);
    } catch (error) {
      console.error('UPDATE RESTAURANT CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to update restaurant'
      });
    }
  },

  async deleteRestaurant(req, res) {
    try {
      const { restaurantId } = req.params;
      await adminService.deleteRestaurant(restaurantId);
      return res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
      console.error('DELETE RESTAURANT CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to delete restaurant'
      });
    }
  },

  async getRestaurantStats(req, res) {
    try {
      const { restaurantId } = req.params;
      const stats = await adminService.getRestaurantStats(restaurantId);
      return res.json(stats);
    } catch (error) {
      console.error('GET RESTAURANT STATS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch restaurant stats'
      });
    }
  },

  // System Settings & Security
  async getSystemSettings(req, res) {
    try {
      const settings = await adminService.getSystemSettings();
      return res.json(settings);
    } catch (error) {
      console.error('GET SYSTEM SETTINGS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch system settings'
      });
    }
  },

  async updateSystemSettings(req, res) {
    try {
      const settings = await adminService.updateSystemSettings(req.body);
      return res.json(settings);
    } catch (error) {
      console.error('UPDATE SYSTEM SETTINGS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to update system settings'
      });
    }
  },

  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const users = await adminService.getAllUsers(parseInt(page), parseInt(limit));
      return res.json(users);
    } catch (error) {
      console.error('GET ALL USERS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch users'
      });
    }
  },

  async updateUserRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      const user = await adminService.updateUserRole(userId, role);
      return res.json(user);
    } catch (error) {
      console.error('UPDATE USER ROLE CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to update user role'
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      await adminService.deleteUser(userId);
      return res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('DELETE USER CONTROLLER ERROR:', error);
      return res.status(error.status || 500).json({
        error: error.message || 'Failed to delete user'
      });
    }
  }
};
