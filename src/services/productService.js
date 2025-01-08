import api from './api';

// Fetch all products
export const fetchProducts = async () => {
  const { data } = await api.get('/products');
  return data; // Returns an array of products
};

// Fetch product details by ID
export const fetchProductDetails = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data; // Returns details of the specific product
};
