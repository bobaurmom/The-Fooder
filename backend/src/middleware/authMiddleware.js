
import { supabase } from '../../supabaseClient.js';

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Fetch user data from custom users table using the auth user's email
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_id, username, email, role')
      .eq('email', user.email)
      .single();

    // If user doesn't exist in custom table, create them
    if (userError || !userData) {
      console.log('User not found in custom table, creating...');
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          username: user.user_metadata?.username || user.email.split('@')[0],
          email: user.email,
          password_hash: 'supabase_auth'
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user in custom table:', createError);
        // Fall back to using Supabase auth data
        userData = {
          user_id: user.id,
          username: user.user_metadata?.username || user.email.split('@')[0],
          email: user.email
        };
      } else {
        userData = newUser;
      }
    }

    req.user = {
      id: userData.user_id,
      username: userData.username,
      email: userData.email,
      role: userData.role || 'customer',
      auth: user
    };
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

export async function verifyAdmin(req, res, next) {
  try {
    // Check if user has admin role
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(403).json({ error: 'Admin verification failed' });
  }
}

export async function verifySuperAdmin(req, res, next) {
  try {
    // Check if user has super_admin role
    const isSuperAdmin = req.user.role === 'super_admin';
    
    if (!isSuperAdmin) {
      return res.status(403).json({ error: 'Super admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Super admin verification error:', error);
    res.status(403).json({ error: 'Super admin verification failed' });
  }
}

export function verifyPermission(permissionName) {
  return async (req, res, next) => {
    try {
      const { rolePermissionRepository } = await import('../repositories/rolePermissionRepository.js');
      
      const { hasPermission, error } = await rolePermissionRepository.checkUserPermission(
        req.user.id,
        permissionName
      );

      if (error) {
        console.error('Permission check error:', error);
        return res.status(500).json({ error: 'Permission check failed' });
      }

      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: permissionName
        });
      }

      next();
    } catch (error) {
      console.error('Permission verification error:', error);
      res.status(500).json({ error: 'Permission verification failed' });
    }
  };
}

export function verifyAnyPermission(permissionNames) {
  return async (req, res, next) => {
    try {
      const { rolePermissionRepository } = await import('../repositories/rolePermissionRepository.js');
      
      // Check if user has any of the required permissions
      let hasAnyPermission = false;
      for (const permissionName of permissionNames) {
        const { hasPermission, error } = await rolePermissionRepository.checkUserPermission(
          req.user.id,
          permissionName
        );
        
        if (error) {
          console.error('Permission check error:', error);
          continue;
        }

        if (hasPermission) {
          hasAnyPermission = true;
          break;
        }
      }

      if (!hasAnyPermission) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          required: permissionNames
        });
      }

      next();
    } catch (error) {
      console.error('Permission verification error:', error);
      res.status(500).json({ error: 'Permission verification failed' });
    }
  };
}

export function requireGuest(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      // If token exists, user is already authenticated
      return res.status(400).json({ 
        error: 'Already authenticated',
        message: 'You are already logged in. Please logout first.'
      });
    }

    next();
  } catch (error) {
    console.error('Guest verification error:', error);
    res.status(500).json({ error: 'Guest verification failed' });
  }
}