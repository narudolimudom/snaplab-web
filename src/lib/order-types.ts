export type OrderStatus =
  | 'pending_payment'
  | 'pending_verification'
  | 'confirmed'
  | 'rejected'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export interface ShippingAddressSnapshot {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productVariantId: string | null;
  productNameSnapshot: string;
  variantLabelSnapshot: string | null;
  skuSnapshot: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  subtotal: string;
  shippingFee: string;
  total: string;
  shippingAddress: ShippingAddressSnapshot;
  createdAt: string;
  updatedAt: string;
}

export type PaymentSlipStatus = 'pending' | 'approved' | 'rejected';

export interface CustomerPaymentSlip {
  id: string;
  orderId: string;
  uploadedAt: string;
  status: PaymentSlipStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

export interface OrderDetail extends OrderSummary {
  items: OrderItem[];
  paymentSlips: CustomerPaymentSlip[];
}
