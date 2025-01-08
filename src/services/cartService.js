import api from './api';

// Fetch the user's cart
export const fetchCart = async () => {
  const { data } = await api.get('/cart');
  return data; // Returns the user's cart
};

// Add an item to the cart
export const addToCart = async (item) => {
  const { data } = await api.post('/cart', item);
  return data; // Returns the updated cart
};

// Remove an item from the cart
export const removeFromCart = async (itemId) => {
  const { data } = await api.delete(`/cart/${itemId}`);
  return data; // Returns the updated cart
};
