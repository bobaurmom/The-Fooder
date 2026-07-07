import express from 'express';
import { foodsController } from '../controllers/foodsController.js';

const router = express.Router();

router.get('/tags', foodsController.getTags);
router.get('/foods', foodsController.getFoods);
router.post('/foods/filter', foodsController.filterFoods);

export default router;
