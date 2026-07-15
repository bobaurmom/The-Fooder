import { rolePermissionRepository } from '../repositories/rolePermissionRepository.js';
import { supabase } from '../../supabaseClient.js';

export const rolePermissionService = {
  // Role management
  async getAllRoles() {
    const { data, error } = await rolePermissionRepository.getAllRoles();
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getRoleById(roleId) {
    const { data, error } = await rolePermissionRepository.getRoleById(roleId);
    
    if (error) {
      throw new Error(error.message);
    }

    // Get permissions for this role
    const { data: permissions, error: permError } = await rolePermissionRepository.getRolePermissions(roleId);
    
    if (permError) {
      throw new Error(permError.message);
    }

    return {
      ...data,
      permissions: permissions?.map(p => p.permissions) || []
    };
  },

  async createRole(roleData) {
    // Check if role name already exists
    const existingRole = await rolePermissionRepository.getRoleByName(roleData.role_name);
    if (existingRole.data) {
      throw new Error('Role with this name already exists');
    }

    const { data, error } = await rolePermissionRepository.createRole(roleData);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateRole(roleId, roleData) {
    // Check if role exists
    const existingRole = await rolePermissionRepository.getRoleById(roleId);
    if (!existingRole.data) {
      throw new Error('Role not found');
    }

    // Prevent modifying system roles
    if (existingRole.data.is_system_role) {
      throw new Error('Cannot modify system roles');
    }

    const { data, error } = await rolePermissionRepository.updateRole(roleId, roleData);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async deleteRole(roleId) {
    // Check if role exists
    const existingRole = await rolePermissionRepository.getRoleById(roleId);
    if (!existingRole.data) {
      throw new Error('Role not found');
    }

    // Prevent deleting system roles
    if (existingRole.data.is_system_role) {
      throw new Error('Cannot delete system roles');
    }

    // Check if role is in use
    const { data: usersWithRole, error: checkError } = await supabase
      .from('users')
      .select('user_id')
      .eq('role_id', roleId)
      .limit(1);

    if (checkError) {
      throw new Error(checkError.message);
    }

    if (usersWithRole && usersWithRole.length > 0) {
      throw new Error('Cannot delete role that is assigned to users');
    }

    const { data, error } = await rolePermissionRepository.deleteRole(roleId);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Permission management
  async getAllPermissions() {
    const { data, error } = await rolePermissionRepository.getAllPermissions();
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getPermissionById(permissionId) {
    const { data, error } = await rolePermissionRepository.getPermissionById(permissionId);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async createPermission(permissionData) {
    // Check if permission name already exists
    const existingPerm = await rolePermissionRepository.getPermissionByName(permissionData.permission_name);
    if (existingPerm.data) {
      throw new Error('Permission with this name already exists');
    }

    const { data, error } = await rolePermissionRepository.createPermission(permissionData);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updatePermission(permissionId, permissionData) {
    const { data, error } = await rolePermissionRepository.updatePermission(permissionId, permissionData);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async deletePermission(permissionId) {
    // Check if permission is assigned to any roles or grants
    const { data: rolePerms, error: roleCheckError } = await supabase
      .from('role_permissions')
      .select('role_permission_id')
      .eq('permission_id', permissionId)
      .limit(1);

    if (roleCheckError) {
      throw new Error(roleCheckError.message);
    }

    const { data: userGrants, error: grantCheckError } = await supabase
      .from('user_grants')
      .select('grant_id')
      .eq('permission_id', permissionId)
      .eq('is_active', true)
      .limit(1);

    if (grantCheckError) {
      throw new Error(grantCheckError.message);
    }

    if ((rolePerms && rolePerms.length > 0) || (userGrants && userGrants.length > 0)) {
      throw new Error('Cannot delete permission that is in use');
    }

    const { data, error } = await rolePermissionRepository.deletePermission(permissionId);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // Role-Permission management
  async assignPermissionToRole(roleId, permissionId) {
    // Check if role exists
    const roleCheck = await rolePermissionRepository.getRoleById(roleId);
    if (!roleCheck.data) {
      throw new Error('Role not found');
    }

    // Check if permission exists
    const permCheck = await rolePermissionRepository.getPermissionById(permissionId);
    if (!permCheck.data) {
      throw new Error('Permission not found');
    }

    const { data, error } = await rolePermissionRepository.assignPermissionToRole(roleId, permissionId);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async removePermissionFromRole(roleId, permissionId) {
    const { data, error } = await rolePermissionRepository.removePermissionFromRole(roleId, permissionId);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async bulkAssignPermissionsToRole(roleId, permissionIds) {
    // Check if role exists
    const roleCheck = await rolePermissionRepository.getRoleById(roleId);
    if (!roleCheck.data) {
      throw new Error('Role not found');
    }

    // Validate all permissions exist
    for (const permId of permissionIds) {
      const permCheck = await rolePermissionRepository.getPermissionById(permId);
      if (!permCheck.data) {
        throw new Error(`Permission with ID ${permId} not found`);
      }
    }

    const { data, error } = await rolePermissionRepository.bulkAssignPermissionsToRole(roleId, permissionIds);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // User Grant management
  async getUserGrants(userId) {
    const { data, error } = await rolePermissionRepository.getUserGrants(userId);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getAllUserGrants(page = 1, limit = 20) {
    const { data, error } = await rolePermissionRepository.getAllUserGrants(page, limit);
    
    if (error) {
      throw new Error(error.message);
    }

    return {
      grants: data || [],
      page,
      limit
    };
  },

  async grantPermissionToUser(userId, permissionId, grantedBy, expiresAt = null) {
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id, username')
      .eq('user_id', userId)
      .single();

    if (userError || !user) {
      throw new Error('User not found');
    }

    // Check if permission exists
    const permCheck = await rolePermissionRepository.getPermissionById(permissionId);
    if (!permCheck.data) {
      throw new Error('Permission not found');
    }

    // Check if grant already exists
    const existingGrant = await rolePermissionRepository.getUserGrant(userId, permissionId);
    if (existingGrant.data) {
      // Reactivate if inactive
      if (!existingGrant.data.is_active) {
        const { data, error } = await rolePermissionRepository.updateUserGrant(userId, permissionId, {
          is_active: true,
          expires_at: expiresAt,
          granted_by: grantedBy,
          granted_at: new Date().toISOString()
        });
        
        if (error) {
          throw new Error(error.message);
        }

        return data;
      } else {
        throw new Error('User already has this permission grant');
      }
    }

    const { data, error } = await rolePermissionRepository.grantPermissionToUser(userId, permissionId, grantedBy, expiresAt);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async revokeUserGrant(userId, permissionId) {
    const { data, error } = await rolePermissionRepository.revokeUserGrant(userId, permissionId);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateUserGrant(userId, permissionId, updateData) {
    const { data, error } = await rolePermissionRepository.updateUserGrant(userId, permissionId, updateData);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // User permission checking
  async getUserEffectivePermissions(userId) {
    const { data, error } = await rolePermissionRepository.getUserEffectivePermissions(userId);
    
    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async checkUserPermission(userId, permissionName) {
    const { hasPermission, error } = await rolePermissionRepository.checkUserPermission(userId, permissionName);
    
    if (error) {
      throw new Error(error.message);
    }

    return { hasPermission };
  },

  // Super Admin specific: Create admin with specific grants
  async createAdminWithGrants(adminData, grants, superAdminId) {
    // Verify the requester is a super admin
    const { data: requester, error: requesterError } = await supabase
      .from('users')
      .select('role_id, roles(*)')
      .eq('user_id', superAdminId)
      .single();

    if (requesterError || !requester) {
      throw new Error('Requester not found');
    }

    if (requester.roles?.role_name !== 'super_admin') {
      throw new Error('Only super admins can create admins with specific grants');
    }

    // Get the admin role
    const { data: adminRole, error: roleError } = await rolePermissionRepository.getRoleByName('admin');
    if (roleError || !adminRole) {
      throw new Error('Admin role not found');
    }

    // Create the user with admin role
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        username: adminData.username,
        email: adminData.email,
        password_hash: adminData.password_hash || 'supabase_auth',
        role_id: adminRole.role_id
      })
      .select()
      .single();

    if (createError) {
      throw new Error(createError.message);
    }

    // Grant the specified permissions
    const grantedPermissions = [];
    for (const permissionName of grants) {
      try {
        const { data: permission } = await rolePermissionRepository.getPermissionByName(permissionName);
        if (permission) {
          const grant = await this.grantPermissionToUser(newUser.user_id, permission.permission_id, superAdminId);
          grantedPermissions.push(grant);
        }
      } catch (error) {
        console.error(`Failed to grant permission ${permissionName}:`, error);
      }
    }

    return {
      user: newUser,
      granted_permissions: grantedPermissions
    };
  }
};
