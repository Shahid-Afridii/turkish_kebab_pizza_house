import axios from "axios";



if (!import.meta.env.VITE_API_URL) {
  console.error(
    "⚠️ ERROR: VITE_API_URL is undefined! Make sure .env.local or .env is correctly configured."
  );
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Environment variable for the API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Function to set Authorization header dynamically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ✅ Load token from localStorage on app start
const storedToken = localStorage.getItem("authToken");
if (storedToken) {
  setAuthToken(storedToken);
}



export default api;
