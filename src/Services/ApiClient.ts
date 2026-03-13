import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
    }
    const data = error.response?.data;
    const apiMessage = data?.Message ?? data?.message;
    if (typeof apiMessage === 'string' && apiMessage.trim() !== '') {
      error.message = apiMessage;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
