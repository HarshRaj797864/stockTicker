import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:10000").trim();
const AUTH_BASE_URL = (import.meta.env.VITE_AUTH_URL || "http://localhost:11000").trim();

function attachInterceptors(instance) {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        window.dispatchEvent(new Event("auth:session-expired"));
      }
      return Promise.reject(error);
    }
  );
}

export const api = axios.create({ baseURL: `${BASE_URL}/api` });
export const authApi = axios.create({ baseURL: `${AUTH_BASE_URL}/api` });

attachInterceptors(api);
attachInterceptors(authApi);
