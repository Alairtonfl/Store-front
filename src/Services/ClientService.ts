import apiClient from './ApiClient';

export interface Client {
  id: number;
  userId: number;
  name: string;
}

export interface PagedClientsResponse {
  data: Client[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export async function fetchClientsPaged(pageIndex: number, pageSize: number): Promise<PagedClientsResponse> {
  const response = await apiClient.get('/api/client/getbyuseridpaged', {
    params: { pageIndex, pageSize },
  });
  return response.data;
}

export async function createClient(data: { name: string }): Promise<Client> {
  const response = await apiClient.post('/api/client/create', data);
  return response.data.data;
}

export async function updateClient(id: number, data: Partial<Client>): Promise<Client> {
  const response = await apiClient.put(`/api/clients/${id}`, data);
  return response.data.data;
}

export async function getTotalStockValueByClientId(id: number): Promise<number> {
  const response = await apiClient.put(`/api/clients/stock-value/${id}`);
  console.log(response);
  return response.data.data;
}

export async function deleteClient(id: number): Promise<void> {
  await apiClient.delete(`/api/clients/${id}`);
}
