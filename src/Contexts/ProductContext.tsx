import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product, fetchProductsByClientIdPaged } from '../Services/ProductService';

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
        fetchProductsByClientIdPaged: fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
