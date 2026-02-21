export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};
