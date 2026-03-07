import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  Client,
  fetchClientsPaged,
  fetchDeletedClientsPaged,
  createClient as createClientService,
  updateClient as updateClientService,
  deleteClient as deleteClientService,
  getTotalStockValueByClientId as getTotalStockValueByClientIdService,
} from '../Services/ClientService';
import { useError } from './ErrorContext';

interface ClientContextType {
  clients: Client[];
  deletedClients: Client[];
  loading: boolean;
  loadingDeleted: boolean;
  error: string | null;
  pageIndex: number;
  pageSize: number;
  fetchClients: (pageIndex?: number, pageSize?: number) => Promise<void>;
  fetchDeletedClients: (pageIndex?: number, pageSize?: number) => Promise<void>;
  createClient: (data: { name: string }) => Promise<Client | null>;
  updateClient: (id: number, data: Partial<Client>) => Promise<Client | null>;
  deleteClient: (id: number) => Promise<boolean>;
  getTotalStockValueByClientId: (id: number) => Promise<number>;
}

const ClientContext = createContext<ClientContextType>({
  clients: [],
  deletedClients: [],
  loading: false,
  loadingDeleted: false,
  error: null,
  pageIndex: 0,
  pageSize: 10000,
  fetchClients: async () => { },
  fetchDeletedClients: async () => { },
  createClient: async () => null,
  updateClient: async () => null,
  deleteClient: async () => false,
  getTotalStockValueByClientId: async () => 0
});

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const { showError } = useError();
  const [clients, setClients] = useState<Client[]>([]);
  const [deletedClients, setDeletedClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDeleted, setLoadingDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10000);

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
      const msg = err.message || 'Erro ao buscar clientes';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedClients = async (
    requestedPageIndex = pageIndex,
    requestedPageSize = pageSize
  ) => {
    setLoadingDeleted(true);
    setError(null);
    try {
      const res = await fetchDeletedClientsPaged(requestedPageIndex, requestedPageSize);
      setDeletedClients(res.data);
    } catch (err: any) {
      const msg = err.message || 'Erro ao buscar clientes excluídos';
      setError(msg);
      showError(msg);
    } finally {
      setLoadingDeleted(false);
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
      showError(apiMessage);
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
      const msg = err.message || 'Erro ao atualizar cliente';
      setError(msg);
      showError(msg);
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
      const msg = err.message || 'Erro ao deletar cliente';
      setError(msg);
      showError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getTotalStockValueByClientId = async (id: number): Promise<number> => {
    setLoading(true);
    setError(null);
    try {
      const totalValue = await getTotalStockValueByClientIdService(id);
      return totalValue;
    } catch (err: any) {
      const apiMessage = err.response?.data?.message || 'Erro ao obter valor total do estoque';
      setError(apiMessage);
      showError(apiMessage);
      throw new Error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        deletedClients,
        loading,
        loadingDeleted,
        error,
        pageIndex,
        pageSize,
        fetchClients,
        fetchDeletedClients,
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
