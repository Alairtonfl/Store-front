import axios from 'axios';

const apiClient = axios.create({
  baseURL: "",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const apiMessage = data?.Message ?? data?.message;
    if (typeof apiMessage === 'string' && apiMessage.trim() !== '') {
      error.message = apiMessage;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
