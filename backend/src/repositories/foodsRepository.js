import { supabase } from '../../supabaseClient.js';

export const foodsRepository = {
  async getTags(type) {
    const { data, error } = await supabase
      .from('tags')
      .select('tag_name')
      .eq('tag_type', type);
    return { data, error };
  },

  async getFoodsWithLocation(lat, lng) {
    const { data, error } = await supabase.rpc('get_foods_with_distance', {
      user_lat: parseFloat(lat),
      user_lng: parseFloat(lng)
    });
    return { data, error };
  },

  async getFoodsWithoutLocation() {
    const { data, error } = await supabase
      .from('food_items')
      .select(`
        *,
        restaurants (
          name,
          address
        ),
        food_tags (
          tags (
            tag_name,
            tag_type
          )
        )
      `)
      .eq('is_available', true);
    return { data, error };
  },

  async filterFoods(minBudget, maxBudget, distance, categories) {
    let query = supabase
      .from('foods')
      .select('*')
      .gte('price', minBudget || 0)
      .lte('price', maxBudget || 999999)
      .lte('distance_km', distance || 999999);

    if (categories && categories.length > 0) {
      query = query.in('category', categories);
    }

    const { data, error } = await query;
    return { data, error };
  }
};
