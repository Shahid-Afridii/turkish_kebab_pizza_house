import axios from 'axios';

console.log("Environment Variables Loaded:");
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

if (!import.meta.env.VITE_API_URL) {
  console.error("⚠️ ERROR: VITE_API_URL is undefined! Make sure .env.local or .env is correctly configured.");
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Environment variable for the API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the Authorization header dynamically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Log the final API base URL being used
console.log("Final API Base URL:", api.defaults.baseURL);

export default api;
