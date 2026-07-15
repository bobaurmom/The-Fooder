import express from 'express';
import multer from 'multer';
import { adminController } from '../controllers/adminController.js';
import { verifyToken, verifyAdmin, verifySuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit cuz supabase only allow 50MB file upload
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'), false);
    }
  }
});

// All admin routes require authentication
router.use(verifyToken);

// Database Backup & Recovery (require admin role)
router.get('/backup/download', verifyAdmin, adminController.downloadBackup);
router.post('/backup/restore', verifyAdmin, upload.single('backup'), adminController.restoreBackup);

// Order & Delivery Management (require admin role)
router.get('/orders', verifyAdmin, adminController.getAllOrders);
router.get('/orders/stats', verifyAdmin, adminController.getOrderStats);
router.get('/orders/:orderId', verifyAdmin, adminController.getOrderById);
router.put('/orders/:orderId/status', verifyAdmin, adminController.updateOrderStatus);

// Merchant & Restaurant Management (require admin role)
router.get('/restaurants', verifyAdmin, adminController.getAllRestaurants);
router.post('/restaurants', verifyAdmin, adminController.createRestaurant);
router.put('/restaurants/:restaurantId', verifyAdmin, adminController.updateRestaurant);
router.delete('/restaurants/:restaurantId', verifyAdmin, adminController.deleteRestaurant);
router.get('/restaurants/:restaurantId/stats', verifyAdmin, adminController.getRestaurantStats);

// System Settings & Security (require admin role)
router.get('/settings', verifyAdmin, adminController.getSystemSettings);
router.put('/settings', verifyAdmin, adminController.updateSystemSettings);
router.get('/users', verifyAdmin, adminController.getAllUsers);
router.put('/users/:userId/role', verifyAdmin, adminController.updateUserRole);
router.delete('/users/:userId', verifyAdmin, adminController.deleteUser);

// Super Admin: Create admin with specific grants (require super admin role)
router.post('/admins/create-with-grants', verifySuperAdmin, adminController.createAdminWithGrants);

export default router;
