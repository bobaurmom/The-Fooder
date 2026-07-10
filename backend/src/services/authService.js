import { authRepository } from '../repositories/authRepository.js';

export const authService = {
  async register(email, password, username, role = 'user') {
    if (!email || !password || !username) {
      throw new Error('Email, password, and username are required');
    }

    const { data, error } = await authRepository.signUp(email, password, username, role);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: 'Registration successful',
      user: data.user,
      session: data.session
    };
  },

  async login(identifier, password) {
    if (!identifier || !password) {
      throw new Error('Identifier (email or username) and password are required');
    }

    const { data, error } = await authRepository.signInWithPassword(identifier, password);

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
  },
  async updateProfile(sessionToken, profileData) {
    const { data, error } = await authRepository.updateProfile(sessionToken, profileData);

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  },
  async forgotPassword(email) {
    const { data, error } = await authRepository.forgotPassword(email);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },
  async resetPassword(token, password) {
    const { data, error } = await authRepository.resetPassword(token, password);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
};
