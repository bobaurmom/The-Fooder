-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  permission_id SERIAL PRIMARY KEY,
  permission_name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  resource VARCHAR(50) NOT NULL, -- e.g., 'users', 'orders', 'restaurants'
  action VARCHAR(50) NOT NULL, -- e.g., 'create', 'read', 'update', 'delete'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role-Permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_permission_id SERIAL PRIMARY KEY,
  role_id INTEGER REFERENCES roles(role_id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(permission_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- User Grants table (for custom permissions assigned to individual users)
CREATE TABLE IF NOT EXISTS user_grants (
  grant_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(permission_id) ON DELETE CASCADE,
  granted_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, permission_id)
);

-- Insert default roles
INSERT INTO roles (role_name, description, is_system_role) VALUES
  ('super_admin', 'Super administrator with full system access', TRUE),
  ('admin', 'Administrator with limited access based on grants', TRUE),
  ('restaurant_owner', 'Restaurant owner managing their restaurant', TRUE),
  ('customer', 'Regular customer user', TRUE)
ON CONFLICT (role_name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (permission_name, description, resource, action) VALUES
  -- User management
  ('users.create', 'Create new users', 'users', 'create'),
  ('users.read', 'View user information', 'users', 'read'),
  ('users.update', 'Update user information', 'users', 'update'),
  ('users.delete', 'Delete users', 'users', 'delete'),
  ('users.manage_roles', 'Assign and manage user roles', 'users', 'manage_roles'),
  
  -- Order management
  ('orders.create', 'Create orders', 'orders', 'create'),
  ('orders.read', 'View orders', 'orders', 'read'),
  ('orders.update', 'Update orders', 'orders', 'update'),
  ('orders.delete', 'Delete orders', 'orders', 'delete'),
  ('orders.manage_status', 'Update order status', 'orders', 'manage_status'),
  ('orders.view_all', 'View all orders across the system', 'orders', 'view_all'),
  
  -- Restaurant management
  ('restaurants.create', 'Create restaurants', 'restaurants', 'create'),
  ('restaurants.read', 'View restaurant information', 'restaurants', 'read'),
  ('restaurants.update', 'Update restaurant information', 'restaurants', 'update'),
  ('restaurants.delete', 'Delete restaurants', 'restaurants', 'delete'),
  ('restaurants.manage_menu', 'Manage restaurant menu items', 'restaurants', 'manage_menu'),
  
  -- Food items management
  ('foods.create', 'Create food items', 'foods', 'create'),
  ('foods.read', 'View food items', 'foods', 'read'),
  ('foods.update', 'Update food items', 'foods', 'update'),
  ('foods.delete', 'Delete food items', 'foods', 'delete'),
  
  -- System management
  ('system.backup', 'Create and download system backups', 'system', 'backup'),
  ('system.restore', 'Restore system from backup', 'system', 'restore'),
  ('system.settings', 'Manage system settings', 'system', 'settings'),
  ('system.analytics', 'View system analytics', 'system', 'analytics'),
  
  -- Role and permission management
  ('roles.create', 'Create new roles', 'roles', 'create'),
  ('roles.read', 'View roles', 'roles', 'read'),
  ('roles.update', 'Update roles', 'roles', 'update'),
  ('roles.delete', 'Delete roles', 'roles', 'delete'),
  ('roles.assign_permissions', 'Assign permissions to roles', 'roles', 'assign_permissions'),
  ('grants.create', 'Grant permissions to users', 'grants', 'create'),
  ('grants.read', 'View user grants', 'grants', 'read'),
  ('grants.update', 'Update user grants', 'grants', 'update'),
  ('grants.delete', 'Revoke user grants', 'grants', 'delete')
ON CONFLICT (permission_name) DO NOTHING;

-- Assign all permissions to super_admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE r.role_name = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign basic permissions to admin role (default - can be customized via grants)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p ON p.permission_name IN (
  'users.read',
  'orders.read',
  'orders.view_all',
  'orders.manage_status',
  'restaurants.read',
  'foods.read',
  'system.analytics'
)
WHERE r.role_name = 'admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign restaurant-specific permissions to restaurant_owner
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p ON p.permission_name IN (
  'restaurants.read',
  'restaurants.update',
  'restaurants.manage_menu',
  'foods.create',
  'foods.read',
  'foods.update',
  'foods.delete',
  'orders.read',
  'orders.manage_status'
)
WHERE r.role_name = 'restaurant_owner'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign customer permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p ON p.permission_name IN (
  'orders.create',
  'orders.read',
  'restaurants.read',
  'foods.read'
)
WHERE r.role_name = 'customer'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_grants_user_id ON user_grants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_grants_permission_id ON user_grants(permission_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(role_name);
CREATE INDEX IF NOT EXISTS idx_permissions_name ON permissions(permission_name);
