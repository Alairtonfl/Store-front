import React, { createContext, useState, useContext, ReactNode } from 'react';
import apiClient from '../Services/ApiClient';

export interface Product {
  id: number;
  clientId: number;
  name: string;
  stock: number;
  value: number;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  pageIndex: number;
  pageSize: number;
  fetchProductsByClientIdPaged: (clientId: number, pageIndex?: number, pageSize?: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: false,
  error: null,
  pageIndex: 0,
  pageSize: 10,
  fetchProductsByClientIdPaged: async () => {},
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchProductsByClientIdPaged = async (
    clientId: number,
    requestedPageIndex = pageIndex,
    requestedPageSize = pageSize
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/product/getbyclientidpaged', {
        params: {
          clientId,
          pageIndex: requestedPageIndex,
          pageSize: requestedPageSize,
        },
      });
      setProducts(response.data.data);
      setPageIndex(requestedPageIndex);
      setPageSize(requestedPageSize);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar produtos');
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
        fetchProductsByClientIdPaged,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
