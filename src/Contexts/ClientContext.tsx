import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  Client,
  fetchClientsPaged,
  createClient as createClientService,
  updateClient as updateClientService,
  deleteClient as deleteClientService,
} from '../Services/ClientService';

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
  getTotalStockValueByClientId: (id: number) => Promise<number>;
}

const ClientContext = createContext<ClientContextType>({
  clients: [],
  loading: false,
  error: null,
  pageIndex: 0,
  pageSize: 100,
  fetchClients: async () => {},
  createClient: async () => null,
  updateClient: async () => null,
  deleteClient: async () => false,
  getTotalStockValueByClientId: async () => 0
});

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(100);

  const fetchClients = async (
    requestedPageIndex = pageIndex,
    requestedPageSize = pageSize
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchClientsPaged(requestedPageIndex, requestedPageSize);
      setClients(res.data);
      setPageIndex(pageIndex);
      setPageSize(pageSize);
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
      const newClient = await createClientService(data);
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
      const updatedClient = await updateClientService(id, data);
      setClients((prev) => prev.map((c) => (c.id === id ? updatedClient : c)));
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
      await deleteClientService(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar cliente');
      return false;
    } finally {
      setLoading(false);
    }
  };

    const getTotalStockValueByClientId = async (id: number): Promise<number> => {
    setLoading(true);
    setError(null);
    try {
      const totalValue = await getTotalStockValueByClientId(id);
      return totalValue;
    } catch (err: any) {
      const apiMessage = err.response?.data?.message || 'Erro ao obter valor total do estoque';
      setError(apiMessage);
      throw new Error(apiMessage);
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
        getTotalStockValueByClientId
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
