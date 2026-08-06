// Must stay in sync with FREE_SHIPPING_THRESHOLD/FLAT_SHIPPING_FEE in
// api/src/modules/orders/orders.service.ts — the API is the source of truth
// for the actual charge; this is only used for display before checkout.
export const FREE_SHIPPING_THRESHOLD = 2000;
export const FLAT_SHIPPING_FEE = 50;

export function calculateShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}

// Placeholder bank account for manual bank-transfer payment. Not
// admin-configurable yet — update here until a real settings system exists.
export const BANK_ACCOUNT = {
  bankName: 'ธนาคารกสิกรไทย',
  accountNumber: '000-0-00000-0',
  accountName: 'บริษัท SnapLab Camera จำกัด',
};
