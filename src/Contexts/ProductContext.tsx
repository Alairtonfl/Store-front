import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product, fetchProductsByClientIdPaged, createProductService } from '../Services/ProductService';
import { useError } from './ErrorContext';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  pageIndex: number;
  pageSize: number;
  fetchProductsByClientIdPaged: (clientId: number, pageIndex?: number, pageSize?: number) => Promise<void>;
  createProduct: (clientId: number, name: string, stock: number, price: number) => Promise<Product>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const { showError } = useError();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        pageIndex,
        pageSize,
        fetchProductsByClientIdPaged: fetchProducts,
        createProduct
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
