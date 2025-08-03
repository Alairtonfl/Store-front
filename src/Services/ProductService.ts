import apiClient from './ApiClient';

export interface Product {
  id: number;
  clientId: number;
  name: string;
  stock: number;
  value: number;
}

export interface PagedProductsResponse {
  data: Product[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export async function fetchProductsByClientIdPaged(
  clientId: number,
  pageIndex: number,
  pageSize: number
): Promise<PagedProductsResponse> {
  const response = await apiClient.get('/api/product/getbyclientidpaged', {
    params: {
      clientId,
      pageIndex,
      pageSize,
    },
  });
  return response.data;
}
