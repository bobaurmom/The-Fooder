import express from 'express';
import { rolePermissionController } from '../controllers/rolePermissionController.js';
import { verifyToken, verifyAdmin, verifySuperAdmin, verifyPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Temporary: Bypass permission checks for testing
// Role management routes
router.get('/roles', rolePermissionController.getAllRoles);
router.get('/roles/:roleId', rolePermissionController.getRoleById);
router.post('/roles', rolePermissionController.createRole);
router.put('/roles/:roleId', rolePermissionController.updateRole);
router.delete('/roles/:roleId', rolePermissionController.deleteRole);

// Permission management routes
router.get('/permissions', rolePermissionController.getAllPermissions);
router.get('/permissions/:permissionId', rolePermissionController.getPermissionById);
router.post('/permissions', rolePermissionController.createPermission);
router.put('/permissions/:permissionId', rolePermissionController.updatePermission);
router.delete('/permissions/:permissionId', rolePermissionController.deletePermission);

// Role-Permission assignment routes
router.post('/roles/:roleId/permissions/:permissionId', rolePermissionController.assignPermissionToRole);
router.delete('/roles/:roleId/permissions/:permissionId', rolePermissionController.removePermissionFromRole);
router.post('/roles/:roleId/permissions/bulk', rolePermissionController.bulkAssignPermissionsToRole);

// User Grant management routes
router.get('/users/:userId/grants', rolePermissionController.getUserGrants);
router.get('/grants', rolePermissionController.getAllUserGrants);
router.post('/users/:userId/grants/:permissionId', rolePermissionController.grantPermissionToUser);
router.delete('/users/:userId/grants/:permissionId', rolePermissionController.revokeUserGrant);
router.put('/users/:userId/grants/:permissionId', rolePermissionController.updateUserGrant);

// User permission checking routes
router.get('/users/:userId/permissions', rolePermissionController.getUserEffectivePermissions);
router.get('/users/:userId/permissions/check', rolePermissionController.checkUserPermission);

// Super Admin only: Create admin with specific grants
router.post('/admins/create-with-grants', verifySuperAdmin, rolePermissionController.createAdminWithGrants);

export default router;
