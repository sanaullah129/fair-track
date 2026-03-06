/**
 * 
 * This is not in use currently, but it can be used to handle 401 errors globally in the future if needed.
 * For now, we are handling 401 errors directly in the React Query configuration in main.tsx.
 * 
 * If you want to use this interceptor, you can import and use the `api` instance instead of axios in your API calls.
 */

import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.assign('/logout');
        }
        return Promise.reject(error);
    }
);

export default api;