import axios from 'axios';
import { apiBaseUrl } from '../config/runtime';

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('autobg_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const handleApiError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.';
  throw new Error(message);
};

export default api;
