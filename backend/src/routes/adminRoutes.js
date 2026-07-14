import express from 'express';
import multer from 'multer';
import { adminController } from '../controllers/adminController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'), false);
    }
  }
});

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(verifyAdmin);

// Database Backup & Recovery
router.get('/backup/download', adminController.downloadBackup);
router.post('/backup/restore', upload.single('backup'), adminController.restoreBackup);

// Order & Delivery Management
router.get('/orders', adminController.getAllOrders);
router.get('/orders/stats', adminController.getOrderStats);
router.get('/orders/:orderId', adminController.getOrderById);
router.put('/orders/:orderId/status', adminController.updateOrderStatus);

// Merchant & Restaurant Management
router.get('/restaurants', adminController.getAllRestaurants);
router.post('/restaurants', adminController.createRestaurant);
router.put('/restaurants/:restaurantId', adminController.updateRestaurant);
router.delete('/restaurants/:restaurantId', adminController.deleteRestaurant);
router.get('/restaurants/:restaurantId/stats', adminController.getRestaurantStats);

// System Settings & Security
router.get('/settings', adminController.getSystemSettings);
router.put('/settings', adminController.updateSystemSettings);
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);

export default router;
