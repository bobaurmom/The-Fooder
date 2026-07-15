import api from './api.js';

export const rbacService = {
  // Role Management
  async getAllRoles() {
    const response = await api.get('/rbac/roles');
    return response.data;
  },

  async getRoleById(roleId) {
    const response = await api.get(`/rbac/roles/${roleId}`);
    return response.data;
  },

  async createRole(roleData) {
    const response = await api.post('/rbac/roles', roleData);
    return response.data;
  },

  async updateRole(roleId, roleData) {
    const response = await api.put(`/rbac/roles/${roleId}`, roleData);
    return response.data;
  },

  async deleteRole(roleId) {
    const response = await api.delete(`/rbac/roles/${roleId}`);
    return response.data;
  },

  // Permission Management
  async getAllPermissions() {
    const response = await api.get('/rbac/permissions');
    return response.data;
  },

  async getPermissionById(permissionId) {
    const response = await api.get(`/rbac/permissions/${permissionId}`);
    return response.data;
  },

  async createPermission(permissionData) {
    const response = await api.post('/rbac/permissions', permissionData);
    return response.data;
  },

  async updatePermission(permissionId, permissionData) {
    const response = await api.put(`/rbac/permissions/${permissionId}`, permissionData);
    return response.data;
  },

  async deletePermission(permissionId) {
    const response = await api.delete(`/rbac/permissions/${permissionId}`);
    return response.data;
  },

  // Role-Permission Assignment
  async assignPermissionToRole(roleId, permissionId) {
    const response = await api.post(`/rbac/roles/${roleId}/permissions/${permissionId}`);
    return response.data;
  },

  async removePermissionFromRole(roleId, permissionId) {
    const response = await api.delete(`/rbac/roles/${roleId}/permissions/${permissionId}`);
    return response.data;
  },

  async bulkAssignPermissionsToRole(roleId, permissionIds) {
    const response = await api.post(`/rbac/roles/${roleId}/permissions/bulk`, { permissionIds });
    return response.data;
  },

  // User Grant Management
  async getUserGrants(userId) {
    const response = await api.get(`/rbac/users/${userId}/grants`);
    return response.data;
  },

  async getAllUserGrants(page = 1, limit = 20) {
    const response = await api.get('/rbac/grants', {
      params: { page, limit }
    });
    return response.data;
  },

  async grantPermissionToUser(userId, permissionId, expiresAt = null) {
    const response = await api.post(`/rbac/users/${userId}/grants/${permissionId}`, { expiresAt });
    return response.data;
  },

  async revokeUserGrant(userId, permissionId) {
    const response = await api.delete(`/rbac/users/${userId}/grants/${permissionId}`);
    return response.data;
  },

  async updateUserGrant(userId, permissionId, updateData) {
    const response = await api.put(`/rbac/users/${userId}/grants/${permissionId}`, updateData);
    return response.data;
  },

  // User Permission Checking
  async getUserEffectivePermissions(userId) {
    const response = await api.get(`/rbac/users/${userId}/permissions`);
    return response.data;
  },

  async checkUserPermission(userId, permissionName) {
    const response = await api.get(`/rbac/users/${userId}/permissions/check`, {
      params: { permissionName }
    });
    return response.data;
  },

  // Super Admin: Create Admin with Grants
  async createAdminWithGrants(adminData, grants) {
    const response = await api.post('/admin/admins/create-with-grants', { adminData, grants });
    return response.data;
  }
};
