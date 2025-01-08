import api from './api';

// Login the user
export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data; // Returns the user data and token
};

// Fetch user details
export const getUserDetails = async () => {
  const { data } = await api.get('/user/details');
  return data; // Returns the user's details
};

// Logout the user
export const logoutUser = async () => {
  await api.post('/auth/logout');
};
