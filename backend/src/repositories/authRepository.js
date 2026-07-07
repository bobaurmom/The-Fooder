import { supabase } from '../../supabaseClient.js';

export const authRepository = {
  async signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });
    return { data, error };
  },

  async signInWithPassword(email, password) {
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
