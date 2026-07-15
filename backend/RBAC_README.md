# User Privilege and Roles Management System

This document describes the Role-Based Access Control (RBAC) system implemented for The Fooder application.

## Overview

The RBAC system provides granular control over user permissions through:
- **Roles**: Predefined sets of permissions (super_admin, admin, restaurant_owner, customer)
- **Permissions**: Specific actions on resources (e.g., users.create, orders.read)
- **User Grants**: Custom permissions assigned to individual users, overriding or supplementing role permissions

## Database Schema

### Tables

1. **roles**: Stores system and custom roles
   - role_id, role_name, description, is_system_role, created_at, updated_at

2. **permissions**: Stores available permissions
   - permission_id, permission_name, description, resource, action, created_at

3. **role_permissions**: Junction table for role-permission assignments
   - role_permission_id, role_id, permission_id, created_at

4. **user_grants**: Stores custom permission grants to users
   - grant_id, user_id, permission_id, granted_by, granted_at, expires_at, is_active

## Default Roles

### super_admin
- Full system access
- Can create admins with specific grants
- All permissions assigned by default

### admin
- Limited access based on assigned permissions
- Default permissions: users.read, orders.read, orders.view_all, orders.manage_status, restaurants.read, foods.read, system.analytics
- Can be extended with custom grants

### restaurant_owner
- Restaurant-specific permissions
- Permissions: restaurants.read/update, restaurants.manage_menu, foods.create/read/update/delete, orders.read, orders.manage_status

### customer
- Basic user permissions
- Permissions: orders.create/read, restaurants.read, foods.read

## API Endpoints

### Role Management
- `GET /api/rbac/roles` - List all roles
- `GET /api/rbac/roles/:roleId` - Get role details with permissions
- `POST /api/rbac/roles` - Create new role (requires roles.create)
- `PUT /api/rbac/roles/:roleId` - Update role (requires roles.update)
- `DELETE /api/rbac/roles/:roleId` - Delete role (requires roles.delete)

### Permission Management
- `GET /api/rbac/permissions` - List all permissions
- `GET /api/rbac/permissions/:permissionId` - Get permission details
- `POST /api/rbac/permissions` - Create new permission (requires roles.create)
- `PUT /api/rbac/permissions/:permissionId` - Update permission (requires roles.update)
- `DELETE /api/rbac/permissions/:permissionId` - Delete permission (requires roles.delete)

### Role-Permission Assignment
- `POST /api/rbac/roles/:roleId/permissions/:permissionId` - Assign permission to role (requires roles.assign_permissions)
- `DELETE /api/rbac/roles/:roleId/permissions/:permissionId` - Remove permission from role (requires roles.assign_permissions)
- `POST /api/rbac/roles/:roleId/permissions/bulk` - Bulk assign permissions to role (requires roles.assign_permissions)

### User Grant Management
- `GET /api/rbac/users/:userId/grants` - Get user's permission grants (requires grants.read)
- `GET /api/rbac/grants` - List all user grants (requires grants.read)
- `POST /api/rbac/users/:userId/grants/:permissionId` - Grant permission to user (requires grants.create)
- `DELETE /api/rbac/users/:userId/grants/:permissionId` - Revoke user grant (requires grants.delete)
- `PUT /api/rbac/users/:userId/grants/:permissionId` - Update user grant (requires grants.update)

### Permission Checking
- `GET /api/rbac/users/:userId/permissions` - Get user's effective permissions (role + grants)
- `GET /api/rbac/users/:userId/permissions/check?permissionName=X` - Check if user has specific permission

### Super Admin: Create Admin with Grants
- `POST /api/admin/admins/create-with-grants` - Create admin with specific permission grants (super_admin only)

## Middleware

### verifyToken
- Authenticates user using JWT token
- Populates req.user with user information

### verifyAdmin
- Checks if user has admin or super_admin role
- Used for general admin routes

### verifySuperAdmin
- Checks if user has super_admin role
- Used for sensitive operations

### verifyPermission(permissionName)
- Checks if user has specific permission
- Combines role permissions and user grants
- Returns 403 if permission not granted

### verifyAnyPermission(permissionNames)
- Checks if user has any of the specified permissions
- Useful for routes that accept multiple permissions

## Usage Examples

### Creating an Admin with Specific Grants

```javascript
// Only super_admin can access this endpoint
POST /api/admin/admins/create-with-grants
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "adminData": {
    "username": "new_admin",
    "email": "admin@example.com",
    "password_hash": "hashed_password"
  },
  "grants": [
    "users.create",
    "users.update",
    "orders.manage_status",
    "restaurants.create"
  ]
}
```

### Granting Permission to User

```javascript
POST /api/rbac/users/123/grants/456
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "expiresAt": "2024-12-31T23:59:59Z" // Optional
}
```

### Checking User Permissions

```javascript
GET /api/rbac/users/123/permissions/check?permissionName=users.create
Headers: {
  "Authorization": "Bearer <token>"
}
Response: {
  "hasPermission": true
}
```

### Using Permission Middleware in Routes

```javascript
import { verifyPermission } from '../middleware/authMiddleware.js';

router.get('/users', verifyPermission('users.read'), userController.getAllUsers);
router.post('/users', verifyPermission('users.create'), userController.createUser);
```

## Database Migration

To set up the RBAC system, run the SQL migration:

```bash
# Execute the migration file
psql -U your_user -d your_database -f backend/database/migrations/create_roles_permissions.sql
```

Or run it through Supabase SQL editor.

## Security Considerations

1. **System Roles**: Cannot be modified or deleted to prevent accidental privilege escalation
2. **Grant Expiration**: Grants can have expiration dates for temporary access
3. **Audit Trail**: All grants track who granted them and when
4. **Permission Inheritance**: Users inherit permissions from their role, which can be supplemented by grants
5. **Super Admin Verification**: Critical operations require super_admin role verification

## Default Permissions

The system includes the following default permissions:

### User Management
- users.create, users.read, users.update, users.delete, users.manage_roles

### Order Management
- orders.create, orders.read, orders.update, orders.delete, orders.manage_status, orders.view_all

### Restaurant Management
- restaurants.create, restaurants.read, restaurants.update, restaurants.delete, restaurants.manage_menu

### Food Items
- foods.create, foods.read, foods.update, foods.delete

### System
- system.backup, system.restore, system.settings, system.analytics

### Roles & Permissions
- roles.create, roles.read, roles.update, roles.delete, roles.assign_permissions
- grants.create, grants.read, grants.update, grants.delete

## Notes

- The users table needs a role_id foreign key to the roles table
- The middleware dynamically imports the rolePermissionRepository to avoid circular dependencies
- Permission checks combine both role permissions and user grants for maximum flexibility
- Expired grants are automatically excluded from permission checks
