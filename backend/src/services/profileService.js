import { profileRepository } from '../repositories/profileRepository.js';

export const profileService = {
  async getUserProfile(userId) {
    const { data, error } = await profileRepository.getUserProfile(userId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getUserFavorites(userId) {
    const { data, error } = await profileRepository.getUserFavorites(userId);

    if (error) {
      throw new Error(error.message);
    }

    // Transform data to match frontend expectations
    const favorites = data.map(item => ({
      food_id: item.food_items.food_id,
      name: item.food_items.name,
      description: item.food_items.description,
      image_url: item.food_items.image_url,
      price: item.food_items.price,
      restaurant_name: item.food_items.restaurants.name
    }));

    return favorites;
  },

  async addFavorite(userId, foodId) {
    const { data, error } = await profileRepository.addFavorite(userId, foodId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async removeFavorite(userId, foodId) {
    const { data, error } = await profileRepository.removeFavorite(userId, foodId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getUserOrders(userId) {
    const { data, error } = await profileRepository.getUserOrders(userId);

    if (error) {
      throw new Error(error.message);
    }

    // Transform data to match frontend expectations
    const orders = data.map(order => ({
      id: order.order_id,
      date: new Date(order.ordered_at).toLocaleDateString(),
      status: order.order_status,
      items: order.order_items.length,
      total: order.total_price,
      restaurant: order.restaurants.name
    }));

    return orders;
  },

  async updateProfile(userId, profileData) {
    const { data, error } = await profileRepository.updateProfile(userId, profileData);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async changePassword(userId, newPassword) {
    const { data, error } = await profileRepository.changePassword(userId, newPassword);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
};
