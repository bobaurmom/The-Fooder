import api from './api';

export const registerUser = async (email, password, username) => {
  const response = await api.post('/auth/register', {
    email,
    password,
    username
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/user');
  return response.data;
};
