import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:7283',
  withCredentials: true,
});

export default apiClient;
