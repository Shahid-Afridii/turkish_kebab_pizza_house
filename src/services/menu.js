import api from './api';

// Function to fetch menu items
export const fetchMenu = async () => {
  try {
    const response = await api.get('/menu/menu');
    return response.data;
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
};
