export interface CartItem {
  id: string;
  productVariantId: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  product: {
    id: string;
    name: string;
    slug: string;
    imagePath: string | null;
  };
  variant: {
    sku: string;
    size: string | null;
    color: string | null;
    stockQuantity: number;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: string;
  itemCount: number;
}
