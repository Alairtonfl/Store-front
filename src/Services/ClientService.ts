import apiClient from './ApiClient';

export interface Client {
  id: number;
  userId: number;
  name: string;
  deletionDate?: string;
}

export interface PagedClientsResponse {
  data: Client[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export interface PayClientAccountResult {
  success: boolean;
  message: string;
}

export async function fetchClientsPaged(pageIndex: number, pageSize: number): Promise<PagedClientsResponse> {
  const response = await apiClient.get('/api/client/getbyuseridpaged', {
    params: { pageIndex, pageSize },
  });
  return response.data;
}

export async function fetchDeletedClientsPaged(pageIndex: number, pageSize: number): Promise<PagedClientsResponse> {
  const response = await apiClient.get('/api/client/getdeletedbyuseridpaged', {
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
  const response = await apiClient.get(`/api/client/stock-value/${id}`);
  return response.data.data;
}

export async function deleteClient(id: number): Promise<void> {
  await apiClient.delete(`/api/client/delete/${id}`);
}

export async function payClientAccount(id: number): Promise<PayClientAccountResult> {
  const response = await apiClient.post(`/api/client/pay-account/${id}`);
  const data: any = response.data ?? {};

  const success: boolean = data.success ?? true;
  const message: string = data.message;

  return { success, message };
}

export async function generatePdf(id: number, clientName: string): Promise<void> {
  const response = await apiClient.get(`/api/client/generate-pdf/${id}`, {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `relatorio_${clientName.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
