import type { OrderItem, OrderSummary, PaymentSlipStatus } from './order-types';

export interface AdminPaymentSlipListItem {
  id: string;
  orderId: string;
  imagePath: string;
  imageUrl: string;
  uploadedAt: string;
  status: PaymentSlipStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  order: OrderSummary;
}

export interface AdminPaymentSlipDetail
  extends Omit<AdminPaymentSlipListItem, 'order'> {
  order: OrderSummary & { items: OrderItem[] };
}
