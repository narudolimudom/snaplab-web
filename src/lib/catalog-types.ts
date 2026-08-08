export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
}

export type ProductStatus = 'draft' | 'published' | 'archived';

export interface ProductImage {
  id: string;
  productId: string;
  path: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string | null;
  color: string | null;
  priceOverride: string | null;
  stockQuantity: number;
  tracksSerialNumbers: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}

export interface ProductDetail extends Product {
  variants: ProductVariant[];
  category: Category;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type StockMovementReason =
  | 'initial'
  | 'restock'
  | 'adjustment'
  | 'order_placed';

export interface StockMovement {
  id: string;
  productVariantId: string | null;
  skuSnapshot: string;
  reason: StockMovementReason;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  note: string | null;
  orderId: string | null;
  createdBy: string | null;
  createdAt: string;
  createdByUser: { fullName: string } | null;
}

export type SerialUnitStatus = 'in_stock' | 'sold';

export interface SerialUnit {
  id: string;
  productVariantId: string | null;
  skuSnapshot: string;
  serialNumber: string;
  status: SerialUnitStatus;
  note: string | null;
  orderItemId: string | null;
  receivedBy: string | null;
  receivedAt: string;
  soldAt: string | null;
  receivedByUser: { fullName: string } | null;
}
