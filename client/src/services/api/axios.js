import axios from "axios";

const fallbackURL = "https://web-production-dd1d.up.railway.app/api";

const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = fallbackURL;

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
