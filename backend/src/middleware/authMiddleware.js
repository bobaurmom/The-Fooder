
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
    const isAdmin = req.user.role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(403).json({ error: 'Admin verification failed' });
  }
}