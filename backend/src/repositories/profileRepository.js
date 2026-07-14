import { supabase } from '../../supabaseClient.js';

export const profileRepository = {
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, username, email, created_at')
      .eq('user_id', userId)
      .single();

    return { data, error };
  },

  async getUserFavorites(userId) {
    const { data, error } = await supabase
      .from('swipe_logs')
      .select(`
        food_id,
        swiped_at,
        food_items (
          food_id,
          name,
          description,
          image_url,
          price,
          restaurants (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .eq('action', 'favorite')
      .order('swiped_at', { ascending: false });

    return { data, error };
  },

  async addFavorite(userId, foodId) {
    const { data, error } = await supabase
      .from('swipe_logs')
      .insert({
        user_id: userId,
        food_id: foodId,
        action: 'favorite'
      })
      .select();

    return { data, error };
  },

  async removeFavorite(userId, foodId) {
    const { data, error } = await supabase
      .from('swipe_logs')
      .delete()
      .eq('user_id', userId)
      .eq('food_id', foodId)
      .eq('action', 'favorite');

    return { data, error };
  },

  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        order_id,
        total_price,
        order_status,
        ordered_at,
        restaurants (
          name
        ),
        order_items (
          quantity,
          price_at_purchase,
          food_items (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('ordered_at', { ascending: false });

    return { data, error };
  },

  async updateProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('users')
      .update(profileData)
      .eq('user_id', userId)
      .select('user_id, username, email, created_at')
      .single();

    return { data, error };
  },

  async changePassword(userId, newPassword) {
    // Note: Password changes should be done through Supabase Auth, not directly in the users table
    // This is a placeholder for the actual implementation
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    return { data, error };
  }
};
