import { supabase } from '../../supabaseClient.js';

export const rolePermissionRepository = {
  // Role operations
  async getAllRoles() {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      return { data, error };
    } catch (err) {
      console.error('getAllRoles error:', err);
      return { data: null, error: { message: err.message } };
    }
  },

  async getRoleById(roleId) {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('role_id', roleId)
      .single();
    
    return { data, error };
  },

  async getRoleByName(roleName) {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('role_name', roleName)
      .single();
    
    return { data, error };
  },

  async createRole(roleData) {
    const { data, error } = await supabase
      .from('roles')
      .insert(roleData)
      .select()
      .single();
    
    return { data, error };
  },

  async updateRole(roleId, roleData) {
    const { data, error } = await supabase
      .from('roles')
      .update({ ...roleData, updated_at: new Date().toISOString() })
      .eq('role_id', roleId)
      .select()
      .single();
    
    return { data, error };
  },

  async deleteRole(roleId) {
    const { data, error } = await supabase
      .from('roles')
      .delete()
      .eq('role_id', roleId)
      .select()
      .single();
    
    return { data, error };
  },

  // Permission operations
  async getAllPermissions() {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('resource', { ascending: true });
      
      return { data, error };
    } catch (err) {
      console.error('getAllPermissions error:', err);
      return { data: null, error: { message: err.message } };
    }
  },

  async getPermissionById(permissionId) {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('permission_id', permissionId)
      .single();
    
    return { data, error };
  },

  async getPermissionByName(permissionName) {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('permission_name', permissionName)
      .single();
    
    return { data, error };
  },

  async createPermission(permissionData) {
    const { data, error } = await supabase
      .from('permissions')
      .insert(permissionData)
      .select()
      .single();
    
    return { data, error };
  },

  async updatePermission(permissionId, permissionData) {
    const { data, error } = await supabase
      .from('permissions')
      .update(permissionData)
      .eq('permission_id', permissionId)
      .select()
      .single();
    
    return { data, error };
  },

  async deletePermission(permissionId) {
    const { data, error } = await supabase
      .from('permissions')
      .delete()
      .eq('permission_id', permissionId)
      .select()
      .single();
    
    return { data, error };
  },

  // Role-Permission operations
  async getRolePermissions(roleId) {
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`
        *,
        permissions(*)
      `)
      .eq('role_id', roleId);
    
    return { data, error };
  },

  async assignPermissionToRole(roleId, permissionId) {
    const { data, error } = await supabase
      .from('role_permissions')
      .insert({ role_id: roleId, permission_id: permissionId })
      .select()
      .single();
    
    return { data, error };
  },

  async removePermissionFromRole(roleId, permissionId) {
    const { data, error } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId)
      .eq('permission_id', permissionId)
      .select()
      .single();
    
    return { data, error };
  },

  async bulkAssignPermissionsToRole(roleId, permissionIds) {
    const assignments = permissionIds.map(permissionId => ({
      role_id: roleId,
      permission_id: permissionId
    }));

    const { data, error } = await supabase
      .from('role_permissions')
      .insert(assignments)
      .select();
    
    return { data, error };
  },

  // User Grant operations
  async getUserGrants(userId) {
    const { data, error } = await supabase
      .from('user_grants')
      .select(`
        *,
        permissions(*),
        granted_by_user:users!user_grants_granted_by_fkey(username, email)
      `)
      .eq('user_id', userId)
      .eq('is_active', true);
    
    return { data, error };
  },

  async getUserGrant(userId, permissionId) {
    const { data, error } = await supabase
      .from('user_grants')
      .select('*')
      .eq('user_id', userId)
      .eq('permission_id', permissionId)
      .eq('is_active', true)
      .single();
    
    return { data, error };
  },

  async grantPermissionToUser(userId, permissionId, grantedBy, expiresAt = null) {
    const { data, error } = await supabase
      .from('user_grants')
      .insert({
        user_id: userId,
        permission_id: permissionId,
        granted_by: grantedBy,
        expires_at: expiresAt,
        is_active: true
      })
      .select()
      .single();
    
    return { data, error };
  },

  async revokeUserGrant(userId, permissionId) {
    const { data, error } = await supabase
      .from('user_grants')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('permission_id', permissionId)
      .select()
      .single();
    
    return { data, error };
  },

  async updateUserGrant(userId, permissionId, updateData) {
    const { data, error } = await supabase
      .from('user_grants')
      .update(updateData)
      .eq('user_id', userId)
      .eq('permission_id', permissionId)
      .select()
      .single();
    
    return { data, error };
  },

  async getAllUserGrants(page = 1, limit = 20) {
    const { data, error } = await supabase
      .from('user_grants')
      .select(`
        *,
        permissions(*),
        users:user_id(username, email),
        granted_by_user:users!user_grants_granted_by_fkey(username, email)
      `)
      .eq('is_active', true)
      .range((page - 1) * limit, page * limit - 1)
      .order('granted_at', { ascending: false });
    
    return { data, error };
  },

  // User permissions check (combines role permissions + user grants)
  async getUserEffectivePermissions(userId) {
    // Get user's role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role_id, roles(*)')
      .eq('user_id', userId)
      .single();

    if (userError || !userData) {
      return { data: null, error: userError || { message: 'User not found' } };
    }

    // Get role permissions
    let rolePermissions = [];
    if (userData.role_id) {
      const { data: rolePerms, error: rolePermsError } = await supabase
        .from('role_permissions')
        .select('permissions(*)')
        .eq('role_id', userData.role_id);

      if (!rolePermsError && rolePerms) {
        rolePermissions = rolePerms.map(rp => rp.permissions);
      }
    }

    // Get user grants
    const { data: grants, error: grantsError } = await supabase
      .from('user_grants')
      .select('permissions(*)')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());

    let grantPermissions = [];
    if (!grantsError && grants) {
      grantPermissions = grants.map(g => g.permissions);
    }

    // Combine permissions (grants can override or add to role permissions)
    const allPermissions = [...rolePermissions, ...grantPermissions];

    return {
      data: {
        role: userData.roles,
        role_permissions: rolePermissions,
        user_grants: grantPermissions,
        effective_permissions: allPermissions
      },
      error: null
    };
  },

  async checkUserPermission(userId, permissionName) {
    const { data, error } = await this.getUserEffectivePermissions(userId);

    if (error) {
      return { hasPermission: false, error };
   }

    const hasPermission = data.effective_permissions.some(
      perm => perm.permission_name === permissionName
    );

    return { hasPermission, error: null };
  }
};
