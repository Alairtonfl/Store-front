import apiClient from './ApiClient';

export interface Product {
  id: number;
  clientId: number;
  name: string;
  stock: number;
  price: number;
  creationDate: string;
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

export async function createProductService({
  clientId,
  name,
  stock,
  price,
}: {
  clientId: number;
  name: string;
  stock: number;
  price: number;
}): Promise<Product> {
  const response = await apiClient.post('/api/product/create', {
    clientId,
    name,
    stock,
    price,
  });
  return response.data.data;
}

export async function updateProductService(id: number): Promise<Product> {
  const response = await apiClient.put(`/api/product/update/${id}`);
  return response.data.data;
}

export async function deleteProductService(id: number): Promise<void> {
  await apiClient.delete(`/api/product/delete/${id}`);
}
