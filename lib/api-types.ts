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
  stock?: number;
  sku: string;
  delivery?: string;
  description?: string;
  full?: string;
  highlights?: string[];
  includes?: string[];
  details?: Array<{ label: string; value: string }>;
};

export type ProductCountResponse = {
  count: number;
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
  requiredPurchases?: number;
  earning: number;
  current: number;
  currentPurchases?: number;
  totalPurchases?: number;
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

export type WithdrawalMethod = "bKash" | "Nagad" | "Rocket" | "Bank" | "Card";

export type PayoutDetails = {
  provider: WithdrawalMethod;
  accountType?: string;
  accountName?: string;
  accountNumber?: string;
  phone?: string;
  bankName?: string;
  branchName?: string;
  routingNumber?: string;
  cardLast4?: string;
  note?: string;
};

export type Withdrawal = {
  id: string;
  date: string;
  amount: number;
  method: WithdrawalMethod;
  status: string;
  account?: string;
  payoutDetails?: PayoutDetails;
};

export type AdminUser = AuthUser & {
  currentBalance?: number;
};

export type AdminWithdrawal = Withdrawal & {
  userId: string;
};

export type AdminPayment = AdminWithdrawal & {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    currentBalance: number;
  } | null;
};

export type OrderStatus = "Pending" | "Confirmed" | "Cancelled";

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
  stock?: number;
  sku: string;
  delivery?: string;
  description?: string;
  full?: string;
  highlights?: string[];
  includes?: string[];
  details?: Array<{ label: string; value: string }>;
};

export type ProductUpdateInput = Partial<Omit<ProductInput, "id">>;

export type ProductImageUpload = {
  url: string;
  publicId: string;
};

export type Order = {
  id: string;
  userId: string;
  productId: string;
  sponsorUserId?: string | null;
  sponsorCode?: string | null;
  quantity: number;
  email: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  paymentProvider?: string;
  paymentStatus?: "Pending" | "Paid" | "Failed" | "Cancelled";
  paymentTransactionId?: string;
  paymentGatewayTransactionId?: string;
  paymentVerifiedAt?: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type AdminOrder = Order & {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    referralCode: string;
    role: Role;
  } | null;
  product: Pick<Product, "id" | "name" | "sku" | "image" | "category" | "price"> | null;
};

export type PurchaseResponse = {
  order: Order;
  auth: AuthPayload | null;
  payment?: {
    provider: "eps";
    redirectUrl: string;
    transactionId: string;
  } | null;
};

export type DashboardResponse = {
  user: AuthUser;
  stats: {
    totalReferrals: number;
    productPurchases: number;
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
  productPurchases: number;
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
  paidWithdrawals?: number;
  reservedWithdrawals?: number;
  earningsByMonth: EarningsMonth[];
  withdrawals: Withdrawal[];
};
