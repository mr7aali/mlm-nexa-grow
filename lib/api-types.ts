export type LevelStatus = "Locked" | "In Progress" | "Unlocked" | "Paid";

export type Product = {
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

export type TreeNode = {
  id: string;
  name: string;
  level: number;
  joined: string;
  referrals: number;
  active: boolean;
  children?: TreeNode[];
};

export type Role = "member" | "admin" | "super-admin";
export type UserStatus = "Active" | "Inactive" | "Banned";

export type AuthUser = {
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

export type AuthPayload = {
  accessToken: string;
  user: AuthUser;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CommissionLevel = {
  level: number;
  required: number;
  earning: number;
  current: number;
  color: string;
  status: LevelStatus;
};

export type Activity = {
  id: string;
  text: string;
  time: string;
};

export type Referral = {
  id: string;
  name: string;
  phone: string;
  level: number;
  joinDate: string;
  referralCount: number;
  status: string;
  commissionEarned: number;
  downline: number;
};

export type CommissionHistoryItem = {
  id: string;
  level: string;
  date: string;
  amount: number;
  status: string;
};

export type EarningsMonth = {
  month: string;
  income: number;
  pending: number;
};

export type Withdrawal = {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: string;
  account?: string;
};

export type AdminUser = AuthUser;

export type AdminWithdrawal = Withdrawal & {
  userId: string;
};

export type ProductInput = {
  id?: string;
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
  status: string;
  createdAt: string;
};

export type DashboardResponse = {
  user: AuthUser;
  stats: {
    totalReferrals: number;
    currentLevel: number;
    totalEarned: number;
    pendingCommission: number;
    totalNetwork: number;
    activeMembers: number;
  };
  referralLink: string;
  commissionLevels: CommissionLevel[];
  activities: Activity[];
  notifications: string[];
};

export type CommissionsResponse = {
  totalEarned: number;
  potential: number;
  currentLevel: CommissionLevel;
  history: CommissionHistoryItem[];
  levels: CommissionLevel[];
};

export type ReferralsResponse = {
  summary: {
    directReferrals: number;
    totalNetwork: number;
    newThisMonth: number;
  };
  rows: Referral[];
};

export type WingsResponse = {
  summary: {
    leftWing: number;
    rightWing: number;
    activeMembers: number;
    inactiveMembers: number;
    totalNetwork: number;
  };
  tree: TreeNode;
};

export type EarningsResponse = {
  balance: number;
  minimumWithdrawal: number;
  earningsByMonth: EarningsMonth[];
  withdrawals: Withdrawal[];
};
