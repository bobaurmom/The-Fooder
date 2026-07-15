import { rolePermissionService } from '../services/rolePermissionService.js';

export const rolePermissionController = {
  // Role management endpoints
  async getAllRoles(req, res) {
    try {
      console.log('Fetching all roles...');
      const roles = await rolePermissionService.getAllRoles();
      console.log('Roles fetched successfully:', roles);
      return res.json(roles);
    } catch (error) {
      console.error('GET ALL ROLES CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch roles',
        details: error.toString()
      });
    }
  },

  async getRoleById(req, res) {
    try {
      const { roleId } = req.params;
      const role = await rolePermissionService.getRoleById(roleId);
      return res.json(role);
    } catch (error) {
      console.error('GET ROLE BY ID CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch role'
      });
    }
  },

  async createRole(req, res) {
    try {
      const role = await rolePermissionService.createRole(req.body);
      return res.status(201).json(role);
    } catch (error) {
      console.error('CREATE ROLE CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to create role'
      });
    }
  },

  async updateRole(req, res) {
    try {
      const { roleId } = req.params;
      const role = await rolePermissionService.updateRole(roleId, req.body);
      return res.json(role);
    } catch (error) {
      console.error('UPDATE ROLE CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to update role'
      });
    }
  },

  async deleteRole(req, res) {
    try {
      const { roleId } = req.params;
      await rolePermissionService.deleteRole(roleId);
      return res.json({ message: 'Role deleted successfully' });
    } catch (error) {
      console.error('DELETE ROLE CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to delete role'
      });
    }
  },

  // Permission management endpoints
  async getAllPermissions(req, res) {
    try {
      console.log('Fetching all permissions...');
      const permissions = await rolePermissionService.getAllPermissions();
      console.log('Permissions fetched successfully:', permissions);
      return res.json(permissions);
    } catch (error) {
      console.error('GET ALL PERMISSIONS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch permissions',
        details: error.toString()
      });
    }
  },

  async getPermissionById(req, res) {
    try {
      const { permissionId } = req.params;
      const permission = await rolePermissionService.getPermissionById(permissionId);
      return res.json(permission);
    } catch (error) {
      console.error('GET PERMISSION BY ID CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch permission'
      });
    }
  },

  async createPermission(req, res) {
    try {
      const permission = await rolePermissionService.createPermission(req.body);
      return res.status(201).json(permission);
    } catch (error) {
      console.error('CREATE PERMISSION CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to create permission'
      });
    }
  },

  async updatePermission(req, res) {
    try {
      const { permissionId } = req.params;
      const permission = await rolePermissionService.updatePermission(permissionId, req.body);
      return res.json(permission);
    } catch (error) {
      console.error('UPDATE PERMISSION CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to update permission'
      });
    }
  },

  async deletePermission(req, res) {
    try {
      const { permissionId } = req.params;
      await rolePermissionService.deletePermission(permissionId);
      return res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
      console.error('DELETE PERMISSION CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to delete permission'
      });
    }
  },

  // Role-Permission management endpoints
  async assignPermissionToRole(req, res) {
    try {
      const { roleId, permissionId } = req.params;
      const assignment = await rolePermissionService.assignPermissionToRole(roleId, permissionId);
      return res.status(201).json(assignment);
    } catch (error) {
      console.error('ASSIGN PERMISSION TO ROLE CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to assign permission to role'
      });
    }
  },

  async removePermissionFromRole(req, res) {
    try {
      const { roleId, permissionId } = req.params;
      await rolePermissionService.removePermissionFromRole(roleId, permissionId);
      return res.json({ message: 'Permission removed from role successfully' });
    } catch (error) {
      console.error('REMOVE PERMISSION FROM ROLE CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to remove permission from role'
      });
    }
  },

  async bulkAssignPermissionsToRole(req, res) {
    try {
      const { roleId } = req.params;
      const { permissionIds } = req.body;
      const assignments = await rolePermissionService.bulkAssignPermissionsToRole(roleId, permissionIds);
      return res.status(201).json(assignments);
    } catch (error) {
      console.error('BULK ASSIGN PERMISSIONS TO ROLE CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to bulk assign permissions to role'
      });
    }
  },

  // User Grant management endpoints
  async getUserGrants(req, res) {
    try {
      const { userId } = req.params;
      const grants = await rolePermissionService.getUserGrants(userId);
      return res.json(grants);
    } catch (error) {
      console.error('GET USER GRANTS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch user grants'
      });
    }
  },

  async getAllUserGrants(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const grants = await rolePermissionService.getAllUserGrants(parseInt(page), parseInt(limit));
      return res.json(grants);
    } catch (error) {
      console.error('GET ALL USER GRANTS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch all user grants'
      });
    }
  },

  async grantPermissionToUser(req, res) {
    try {
      const { userId, permissionId } = req.params;
      const { expiresAt } = req.body;
      const grant = await rolePermissionService.grantPermissionToUser(
        userId,
        permissionId,
        req.user.id,
        expiresAt
      );
      return res.status(201).json(grant);
    } catch (error) {
      console.error('GRANT PERMISSION TO USER CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to grant permission to user'
      });
    }
  },

  async revokeUserGrant(req, res) {
    try {
      const { userId, permissionId } = req.params;
      await rolePermissionService.revokeUserGrant(userId, permissionId);
      return res.json({ message: 'User grant revoked successfully' });
    } catch (error) {
      console.error('REVOKE USER GRANT CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to revoke user grant'
      });
    }
  },

  async updateUserGrant(req, res) {
    try {
      const { userId, permissionId } = req.params;
      const grant = await rolePermissionService.updateUserGrant(userId, permissionId, req.body);
      return res.json(grant);
    } catch (error) {
      console.error('UPDATE USER GRANT CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to update user grant'
      });
    }
  },

  // User permission checking endpoints
  async getUserEffectivePermissions(req, res) {
    try {
      const { userId } = req.params;
      const permissions = await rolePermissionService.getUserEffectivePermissions(userId);
      return res.json(permissions);
    } catch (error) {
      console.error('GET USER EFFECTIVE PERMISSIONS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch user effective permissions'
      });
    }
  },

  async checkUserPermission(req, res) {
    try {
      const { userId } = req.params;
      const { permissionName } = req.query;
      const result = await rolePermissionService.checkUserPermission(userId, permissionName);
      return res.json(result);
    } catch (error) {
      console.error('CHECK USER PERMISSION CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to check user permission'
      });
    }
  },

  // Super Admin: Create admin with specific grants
  async createAdminWithGrants(req, res) {
    try {
      const { adminData, grants } = req.body;
      const result = await rolePermissionService.createAdminWithGrants(
        adminData,
        grants,
        req.user.id
      );
      return res.status(201).json(result);
    } catch (error) {
      console.error('CREATE ADMIN WITH GRANTS CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to create admin with grants'
      });
    }
  }
};
