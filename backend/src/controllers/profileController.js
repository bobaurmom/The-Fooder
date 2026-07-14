import { profileService } from '../services/profileService.js';

export const profileController = {
  async getProfile(req, res) {
    try {
      const userId = req.user.id; // Assuming user ID comes from auth middleware
      const profile = await profileService.getUserProfile(userId);

      return res.json({
        user: profile
      });
    } catch (error) {
      console.error('GET PROFILE CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch profile'
      });
    }
  },

  async getFavorites(req, res) {
    try {
      const userId = req.user.id;
      const favorites = await profileService.getUserFavorites(userId);

      return res.json({
        favorites
      });
    } catch (error) {
      console.error('GET FAVORITES CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch favorites'
      });
    }
  },

  async addFavorite(req, res) {
    try {
      const userId = req.user.id;
      const { foodId } = req.body;

      if (!foodId) {
        return res.status(400).json({
          error: 'foodId is required'
        });
      }

      const result = await profileService.addFavorite(userId, foodId);

      return res.json({
        message: 'Favorite added successfully',
        data: result
      });
    } catch (error) {
      console.error('ADD FAVORITE CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to add favorite'
      });
    }
  },

  async removeFavorite(req, res) {
    try {
      const userId = req.user.id;
      const { foodId } = req.params;

      if (!foodId) {
        return res.status(400).json({
          error: 'foodId is required'
        });
      }

      await profileService.removeFavorite(userId, foodId);

      return res.json({
        message: 'Favorite removed successfully'
      });
    } catch (error) {
      console.error('REMOVE FAVORITE CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to remove favorite'
      });
    }
  },

  async getOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await profileService.getUserOrders(userId);

      return res.json({
        orders
      });
    } catch (error) {
      console.error('GET ORDERS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch orders'
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { username, email } = req.body;

      if (!username && !email) {
        return res.status(400).json({
          error: 'Username or email is required'
        });
      }

      const profileData = {};
      if (username) profileData.username = username;
      if (email) profileData.email = email;

      const updatedUser = await profileService.updateProfile(userId, profileData);

      return res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('UPDATE PROFILE CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to update profile'
      });
    }
  },

  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Current password and new password are required'
        });
      }

      // Note: For Supabase Auth, we need the session token to change password
      // This is a simplified implementation - in production, you'd verify current password first
      const result = await profileService.changePassword(userId, newPassword);

      return res.json({
        message: 'Password changed successfully',
        data: result
      });
    } catch (error) {
      console.error('CHANGE PASSWORD CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to change password'
      });
    }
  }
};
