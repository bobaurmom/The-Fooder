import { authService } from '../services/authService.js';

export const authController = {
  async register(req, res) {
    try {
      const { email, password, username } = req.body;

      console.log('REGISTER BODY:', req.body);

      const result = await authService.register(email, password, username);

      console.log('REGISTER RESULT:', result);

      return res.status(201).json(result);
    } catch (error) {
      console.error('REGISTER CONTROLLER ERROR:', error);
      return res.status(400).json({
        error: error.message || 'Registration failed'
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      console.log('LOGIN BODY:', req.body);

      const result = await authService.login(email, password);

      console.log('LOGIN RESULT:', result);

      return res.json(result);
    } catch (error) {
      console.error('LOGIN CONTROLLER ERROR:', error);
      return res.status(401).json({
        error: error.message || 'Login failed'
      });
    }
  },

  async getUser(req, res) {
    try {
      const user = req.user;
      return res.json({
        message: 'Protected route success',
        user
      });
    } catch (error) {
      console.error('GET USER CONTROLLER ERROR:', error);
      return res.status(500).json({
        error: error.message || 'Failed to fetch user'
      });
    }
  }
};
