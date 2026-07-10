import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { ordersController } from '../controllers/ordersController.js';

const router = express.Router();

router.use(verifyToken);

router.post('/quote', ordersController.quoteOrder);
router.post('/', ordersController.createOrder);

export default router;
