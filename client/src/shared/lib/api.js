import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const BASE_URL = "https://stockticker-production.up.railway.app";

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new Event("auth:session-expired"));
    }
    return Promise.reject(error);
  }
);
