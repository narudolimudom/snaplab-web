import type { OrderStatus } from '@/lib/order-types';
import type { Dictionary } from '@/lib/dictionaries';

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending_payment: 'bg-amber-100 text-amber-800',
  pending_verification: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  shipped: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-zinc-200 text-zinc-700',
};

const STATUS_KEY: Record<OrderStatus, keyof Dictionary['orderStatus']> = {
  pending_payment: 'pendingPayment',
  pending_verification: 'pendingVerification',
  confirmed: 'confirmed',
  rejected: 'rejected',
  shipped: 'shipped',
  completed: 'completed',
  cancelled: 'cancelled',
};

export function OrderStatusBadge({
  status,
  dict,
}: {
  status: OrderStatus;
  dict: Dictionary;
}) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[12.8px] font-bold ${STATUS_STYLE[status]}`}
    >
      {dict.orderStatus[STATUS_KEY[status]]}
    </span>
  );
}
