import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.API_BASE_URL || "http://localhost:8888/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    // You can add token or any other request interceptors here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  },
);

export default apiClient;
