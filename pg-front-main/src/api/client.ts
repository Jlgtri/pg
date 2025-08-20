import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";

// Base URL from environment
const BASE_URL = import.meta.env.VITE_API_URL || "https://api-mock.yourapp.com";

// Create axios instance for httpOnly cookie authentication
export const apiClient = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true, // This ensures cookies are sent with requests
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Authentication expired, please login again");
    }

    if (error.response?.status === 403) {
      console.error("Access forbidden - insufficient permissions");
    }

    if (error.response?.status === 404) {
      console.error("Resource not found");
    }

    if (error.response && error.response.status >= 500) {
      console.error("Server error, please try again later");
    }

    if (!error.response) {
      console.error("Network error - please check your connection");
    }

    return Promise.reject(error);
  }
);

export const extractData = <T>(response: AxiosResponse<T>): T => response.data;

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message);
  }
  throw new Error("Unknown error occurred");
};

export default apiClient;
