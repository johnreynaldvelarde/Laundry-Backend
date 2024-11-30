import axios from "axios";

const API_URL = "http://localhost:3002/api";

export const axiosPublic = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request and response interceptors
axiosPrivate.interceptors.request.use(
  (config) => {
    // You can add authorization headers or other configurations here
    return config;
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

axiosPrivate.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log only if it's not a 400 error
    if (error.response && error.response.status !== 400) {
      console.error("API Error:", error.response || error.message);
    }
    return Promise.reject(error);
  }
);

// import axios from 'axios';

// const API_URL = 'http://localhost:3002/api';

// export const axiosPublic = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// export const axiosPrivate = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// import axios from 'axios';

// const API_URL = 'http://localhost:3002/api';

// export const axiosPublic = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// export const axiosPrivate = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// // Add request and response interceptors
// axiosPrivate.interceptors.request.use(
//   (config) => {
//     // You can add authorization headers or other configurations here
//     return config;
//   },
//   (error) => {
//     // Handle request error here
//     return Promise.reject(error);
//   }
// );

// axiosPrivate.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Suppress console logging for specific errors
//     if (error.response && error.response.status === 400) {
//       // Optionally handle 400 errors or suppress logs
//     } else {
//       console.error("API Error:", error);
//     }
//     return Promise.reject(error);
//   }
// );
