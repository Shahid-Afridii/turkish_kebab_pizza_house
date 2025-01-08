import api from './api';

// Place a new order
export const placeOrder = async (orderDetails) => {
  const { data } = await api.post('/orders', orderDetails);
  return data; // Returns the order confirmation details
};

// Fetch the user's order history
export const fetchOrderHistory = async () => {
  const { data } = await api.get('/orders');
  return data; // Returns an array of past orders
};
