import { authRepository } from '../repositories/authRepository.js';

export const authService = {
  async register(email, password, username) {
    if (!email || !password || !username) {
      throw new Error('Email, password, and username are required');
    }

    const { data, error } = await authRepository.signUp(email, password, username);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: 'Registration successful',
      user: data.user,
      session: data.session
    };
  },

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const { data, error } = await authRepository.signInWithPassword(email, password);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: 'Login successful',
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_in: data.session?.expires_in,
      token_type: data.session?.token_type,
      user: data.user
    };
  },

  async getUser(sessionToken) {
    const { data, error } = await authRepository.getUser(sessionToken);

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  }
};
