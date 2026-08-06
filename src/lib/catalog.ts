import 'server-only';
import { apiFetch } from './api';
import type {
  Category,
  PaginatedResult,
  Product,
  ProductDetail,
} from './catalog-types';

export { getPublicUploadUrl } from './upload-url';

export function getCategories() {
  return apiFetch<Category[]>('/categories');
}

export function getCategoryBySlug(slug: string) {
  return apiFetch<Category>(`/categories/${encodeURIComponent(slug)}`);
}

export interface ProductQuery {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc';
}

function toQueryString<T extends object>(query: T): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function getProducts(query: ProductQuery = {}) {
  return apiFetch<PaginatedResult<Product>>(
    `/products${toQueryString(query)}`,
  );
}

export function getProductBySlug(slug: string) {
  return apiFetch<ProductDetail>(`/products/${encodeURIComponent(slug)}`);
}

export interface AdminProductQuery extends ProductQuery {
  status?: 'draft' | 'published' | 'archived';
}

export function getAdminProducts(
  query: AdminProductQuery,
  accessToken: string,
) {
  return apiFetch<PaginatedResult<Product>>(
    `/admin/products${toQueryString(query)}`,
    { accessToken },
  );
}

export function getAdminProductById(id: string, accessToken: string) {
  return apiFetch<ProductDetail>(`/admin/products/${id}`, { accessToken });
}
