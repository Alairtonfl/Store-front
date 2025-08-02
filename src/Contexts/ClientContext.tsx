import React, { createContext, useState, useContext, ReactNode } from 'react';
import apiClient from '../Services/ApiClient';

export interface Client {
  id: number;
  userId: number;
  name: string;
}

interface ClientContextType {
  clients: Client[];
  loading: boolean;
  error: string | null;
  pageIndex: number;
  pageSize: number;
  fetchClients: (pageIndex?: number, pageSize?: number) => Promise<void>;
  createClient: (data: { name: string }) => Promise<Client | null>; 
  updateClient: (id: number, data: Partial<Client>) => Promise<Client | null>;
  deleteClient: (id: number) => Promise<boolean>;
}

const ClientContext = createContext<ClientContextType>({
  clients: [],
  loading: false,
  error: null,
  pageIndex: 0,   
  pageSize: 10,
  fetchClients: async () => {},
  createClient: async () => null,
  updateClient: async () => null,
  deleteClient: async () => false,
});

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchClients = async (
    requestedPageIndex = pageIndex,
    requestedPageSize = pageSize
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/client/getbyuseridpaged', {
        params: {
          pageIndex: requestedPageIndex,
          pageSize: requestedPageSize,
        },
      });
      setClients(response.data.data);
      setPageIndex(requestedPageIndex);
      setPageSize(requestedPageSize);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar clientes');
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (data: { name: string }): Promise<Client | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/api/client/create', data);
      const newClient = response.data.data;
      setClients((prev) => [...prev, newClient]);
      return newClient;
    } catch (err: any) {
      const apiMessage = err.response?.data?.message || 'Erro ao criar cliente';
      setError(apiMessage);
      throw new Error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: number, data: Partial<Client>): Promise<Client | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.put(`/api/clients/${id}`, data);
      const updatedClient = response.data.data;
      setClients((prev) => prev.map(c => (c.id === id ? updatedClient : c)));
      return updatedClient;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar cliente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/api/clients/${id}`);
      setClients((prev) => prev.filter(c => c.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar cliente');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        loading,
        error,
        pageIndex,
        pageSize,
        fetchClients,
        createClient,
        updateClient,
        deleteClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
