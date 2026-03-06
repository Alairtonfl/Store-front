import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:7283',
  withCredentials: true,
});

// Usa Message (ou message) do response da API como mensagem de erro no popup
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
