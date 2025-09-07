import axios, { AxiosError } from "axios";

const PROTECTED_PATHS = ["/dashboard", "/profile", "/orders"];

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    const currentPath = window.location.pathname;

    if (PROTECTED_PATHS.includes(currentPath) && !token) {
      // No token but trying to access protected route
      console.warn("No token found! Redirecting to login...");
      window.location.href = "/login";
      return Promise.reject(new Error("Unauthorized - No token"));
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Unauthorized! Redirecting to login...");

        // Clear invalid token
        localStorage.removeItem("accessToken");

        const currentPath = window.location.pathname;
        if (PROTECTED_PATHS.includes(currentPath)) {
          window.location.href = "/login";
        }
      }

      if (error.response.status === 500) {
        console.error("Server error, please try again later.");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
