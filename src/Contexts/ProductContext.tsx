import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product, fetchProductsByClientIdPaged, createProductService, updateProductService, deleteProductService } from '../Services/ProductService';
import { useError } from './ErrorContext';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  pageIndex: number;
  pageSize: number;
  fetchProductsByClientIdPaged: (clientId: number, pageIndex?: number, pageSize?: number) => Promise<void>;
  createProduct: (clientId: number, name: string, stock: number, price: number) => Promise<Product>;
  updateProduct: (id: number) => Promise<Product>;
  deleteProduct: (id: number) => Promise<boolean>;
  clearProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const { showError, showSuccess } = useError();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10000);

  const clearProducts = () => {
    setProducts([]);
  };

  const fetchProducts = async (
    clientId: number,
    requestedPageIndex = pageIndex,
    requestedPageSize = pageSize
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchProductsByClientIdPaged(clientId, requestedPageIndex, requestedPageSize);
      setProducts(res.data);
      setPageIndex(res.pageIndex);
      setPageSize(res.pageSize);
    } catch (err: any) {
      const msg = err.message || 'Erro ao buscar produtos';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (clientId: number, name: string, stock: number, price: number) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await createProductService({ clientId, name, stock, price });
      setProducts((prev) => [...prev, newProduct]);
      showSuccess('Produto criado com sucesso');
      return newProduct;
    } catch (err: any) {
      const apiMessage = err.response?.data?.message || 'Erro ao criar produto';
      setError(apiMessage);
      showError(apiMessage);
      throw new Error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProductService(id);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...updated, id: p.id } : p)));
      showSuccess('Estoque atualizado');
      return { ...updated, id };
    } catch (err: any) {
      const apiMessage = err.response?.data?.message || 'Erro ao atualizar estoque';
      setError(apiMessage);
      showError(apiMessage);
      throw new Error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProductService(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showSuccess('Produto removido');
      return true;
    } catch (err: any) {
      const apiMessage = err.response?.data?.message || 'Erro ao remover produto';
      setError(apiMessage);
      showError(apiMessage);
      throw new Error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        pageIndex,
        pageSize,
        fetchProductsByClientIdPaged: fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        clearProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct deve ser usado dentro de um ProductProvider');
  }
  return context;
};
