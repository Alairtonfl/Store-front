import apiClient from './ApiClient';

export interface User {
  id: string;
  name: string;
  email: string;
}


export async function login(email: string, password: string): Promise<User> {
  try {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro no login');
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/auth/logout');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro no logout');
  }
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient.get('/api/auth/me');
    return response.data.data;
  } catch {
    return null;
  }
}
