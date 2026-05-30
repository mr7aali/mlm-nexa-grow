export type Role = "member" | "admin" | "super-admin";
export type UserStatus = "Active" | "Inactive" | "Banned";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: number;
  status: UserStatus;
  referralCode: string;
  joined: string;
  earned: number;
  referrals: number;
  role: Role;
};

export type AppUser = PublicUser & {
  referredByUserId?: string | null;
  referredByCode?: string | null;
  passwordHash: string;
  resetOtp?: string;
  resetOtpExpiresAt?: number;
  resetToken?: string;
  resetTokenExpiresAt?: number;
};

export type RefreshSession = {
  userId: string;
  expiresAt: number;
};

export type Order = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  email: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
};

export type WithdrawalRequest = {
  id: string;
  userId: string;
  date: string;
  amount: number;
  method: string;
  account: string;
  status: "Pending" | "Review" | "Paid" | "Rejected";
};

export type ProductRecord = {
  id: string;
  icon?: string;
  image: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  offer?: string;
  offerEnds?: string;
  commission?: number;
  stock?: string;
  sku: string;
  delivery?: string;
  description?: string;
  full?: string;
  highlights?: string[];
  includes?: string[];
  details?: Array<{ label: string; value: string }>;
};

export type ReferralRecord = {
  id: string;
  ownerUserId: string;
  userId: string;
  name: string;
  phone: string;
  level: number;
  joinDate: string;
  referralCount: number;
  status: "Active" | "Inactive";
  commissionEarned: number;
  downline: number;
};

export type ActivityRecord = {
  id: string;
  ownerUserId: string;
  text: string;
  time: string;
};

export type CommissionHistoryRecord = {
  id: string;
  userId: string;
  level: string;
  date: string;
  amount: number;
  status: string;
};

export type EarningsMonthRecord = {
  id: string;
  userId: string;
  month: string;
  income: number;
  pending: number;
};
