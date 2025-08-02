import apiClient from '././ApiClient';

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erro no login');
  }
}
