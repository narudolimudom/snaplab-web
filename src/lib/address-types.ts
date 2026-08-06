export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
}
