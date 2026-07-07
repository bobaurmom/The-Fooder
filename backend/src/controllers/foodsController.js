import { foodsService } from '../services/foodsService.js';

export const foodsController = {
  async getTags(req, res) {
    try {
      const { type } = req.query;

      const result = await foodsService.getTags(type);

      console.log('TAGS DATA:', result);

      return res.json(result);
    } catch (error) {
      console.error('GET TAGS CONTROLLER ERROR:', error);
      return res.status(400).json({
        error: error.message || 'Failed to fetch tags'
      });
    }
  },

  async getFoods(req, res) {
    try {
      const { lat, lng, tag, distance, maxBudget, search } = req.query;

      const result = await foodsService.getFoods(lat, lng, tag, distance, maxBudget, search);

      return res.json(result);
    } catch (error) {
      console.error('GET FOODS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch foods'
      });
    }
  },

  async filterFoods(req, res) {
    try {
      const { minBudget, maxBudget, distance, categories } = req.body;

      const result = await foodsService.filterFoods(minBudget, maxBudget, distance, categories);

      return res.json(result);
    } catch (error) {
      console.error('FILTER FOODS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to filter foods'
      });
    }
  }
};
