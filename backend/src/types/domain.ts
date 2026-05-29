export type Role = "member" | "admin";
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
  productId: string;
  quantity: number;
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
