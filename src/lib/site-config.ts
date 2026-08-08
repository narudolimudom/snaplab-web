export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3002'
).replace(/\/$/, '');

const FREE_SHIPPING_THRESHOLD = 2000;
const FLAT_SHIPPING_FEE = 50;

export function calculateShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}

export const BANK_ACCOUNT = {
  bankName: 'ธนาคารกสิกรไทย (KBank)',
  accountNumber: '123-4-56789-0',
  accountName: 'SnapLab Camera Co., Ltd.',
};
