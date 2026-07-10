import { supabase } from '../../supabaseClient.js';

export const authRepository = {
  async signUp(email, password, username, role = 'user') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });

    if (error) return { data, error };

    // Create user record in custom users table
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          username,
          email,
          password_hash: 'supabase_auth', // Password is managed by Supabase Auth
          role
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user in custom table:', userError);
        // Don't fail registration if custom table insert fails
      }
    }

    return { data, error };
  },

  async signInWithPassword(identifier, password) {
    // Check if identifier is username or email
    let email = identifier;
    
    // If identifier doesn't contain @, treat it as username
    if (!identifier.includes('@')) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('username', identifier)
        .single();
      
      if (userError || !userData) {
        return { data: null, error: { message: 'User not found' } };
      }
      
      email = userData.email;
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async getUser(sessionToken) {
    const { data, error } = await supabase.auth.getUser(sessionToken);
    return { data, error };
  }
};
