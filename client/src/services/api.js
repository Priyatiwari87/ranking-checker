import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Response Interceptor for user-friendly error formatting
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response && error.response.data && error.response.data.error) {
      message = error.response.data.error;
    } else if (error.message.includes('timeout')) {
      message = 'Request timed out. Please check your network connection.';
    } else if (error.code === 'ERR_NETWORK') {
      message = 'Unable to connect to RankCheck server. Make sure the backend is running.';
    }
    return Promise.reject(new Error(message));
  }
);

export const checkRankingApi = (data) => api.post('/ranking/check', data);
export const getHistoryApi = (params) => api.get('/history', { params });
export const getHistoryByIdApi = (id) => api.get(`/history/${id}`);
export const deleteHistoryApi = (id) => api.delete(`/history/${id}`);
export const getAnalyticsApi = () => api.get('/analytics');
export const getHealthApi = () => api.get('/health');

export default api;
