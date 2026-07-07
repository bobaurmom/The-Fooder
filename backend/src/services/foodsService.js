import { foodsRepository } from '../repositories/foodsRepository.js';

export const foodsService = {
  async getTags(type) {
    if (!type) {
      throw new Error('Type parameter is required');
    }

    const { data, error } = await foodsRepository.getTags(type);

    if (error) {
      throw new Error(error.message);
    }

    if (type === 'category') {
      const tagNames = data.map(item => item.tag_name);
      return { tags: tagNames };
    }

    throw new Error('Invalid type parameter');
  },

  async getFoods(lat, lng, tag, distance, maxBudget, search) {
    let foods;

    // If user location is provided, use the RPC function to calculate distances
    if (lat && lng) {
      const { data: rpcData, error: rpcError } = await foodsRepository.getFoodsWithLocation(lat, lng);

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      foods = rpcData;
    } else {
      // Fallback: fetch all foods without distance calculation
      const { data, error } = await foodsRepository.getFoodsWithoutLocation();

      if (error) {
        throw new Error(error.message);
      }

      // Filter by category/tag if provided
      let filteredData = data;
      if (tag) {
        filteredData = data.filter(food =>
          food.food_tags?.some(ft => ft.tags?.tag_name === tag && ft.tags?.tag_type === 'category')
        );
      }

      // Filter by search query if provided
      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(food =>
          food.name?.toLowerCase().includes(searchLower) ||
          food.description?.toLowerCase().includes(searchLower) ||
          food.restaurants?.name?.toLowerCase().includes(searchLower)
        );
      }

      // Filter by max budget if provided
      if (maxBudget !== undefined) {
        console.log('Filtering by maxBudget:', maxBudget);
        filteredData = filteredData.filter(food => {
          const price = parseFloat(food.price);
          const max = parseFloat(maxBudget);
          console.log(`Food: ${food.name}, Price: ${price}, Max: ${max}, Pass: ${price <= max}`);
          return price <= max;
        });
      }

      // Transform data to match frontend expectations with null distance
      foods = filteredData.map(food => ({
        food_id: food.food_id,
        name: food.name,
        description: food.description,
        image_url: food.image_url,
        price: food.price,
        distance_km: null,
        restaurant_name: food.restaurants?.name || 'Restaurant',
        restaurant_address: food.restaurants?.address || 'Address not available',
        gallery: [food.image_url]
      }));
    }

    // Filter by distance if provided and location data is available
    if (distance && foods.some(f => f.distance_km !== null)) {
      const maxDistance = parseFloat(distance);
      foods = foods.filter(food => food.distance_km <= maxDistance);
    }

    // Filter by max budget if provided (for RPC data with location)
    if (maxBudget !== undefined && lat && lng) {
      foods = foods.filter(food => {
        const price = parseFloat(food.price);
        const max = parseFloat(maxBudget);
        return price <= max;
      });
    }

    // Transform data to match frontend expectations
    const transformedFoods = foods.map(food => ({
      food_id: food.food_id,
      name: food.name,
      description: food.description,
      image_url: food.image_url,
      price: food.price,
      distance_km: food.distance_km !== null ? Number(food.distance_km.toFixed(1)) : null,
      restaurant_name: food.restaurant_name || 'Restaurant',
      restaurant_address: food.restaurant_address || 'Address not available',
      gallery: [food.image_url]
    }));

    return { foods: transformedFoods };
  },

  async filterFoods(minBudget, maxBudget, distance, categories) {
    const { data, error } = await foodsRepository.filterFoods(minBudget, maxBudget, distance, categories);

    if (error) {
      throw new Error(error.message);
    }

    return { foods: data };
  }
};
