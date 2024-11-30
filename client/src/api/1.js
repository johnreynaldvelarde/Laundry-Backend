import axios from 'axios';
import useAuth from "../contexts/AuthContext";

const API_URL = 'http://localhost:3002/api'; 

export const axiosPublic = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

export const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});


axiosPrivate.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuth(); // Use the hook to get accessToken
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosPrivate.interceptors.response.use(
  response => response,
  error => {
    // Handle errors globally here
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    console.log('Global error handler:', errorMessage); // Log only the error message
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
// axiosPrivate.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle errors here
//     const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
//     console.error("API Error:", errorMessage); // Log to console for debugging
//     return Promise.reject(new Error(errorMessage));
//   }
// );
