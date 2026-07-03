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
  userId: string;
  name: string;
  profilePicture?: string;
  level: number;
  joined: string;
  referrals: number;
  active: boolean;
  position: "Root" | "Left" | "Right";
  left: TreeNode | null;
  right: TreeNode | null;
};

export type Role = "member" | "admin" | "super-admin";
export type UserStatus = "Active" | "Inactive" | "Banned";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  dateOfBirth?: string;
  religion?: string;
  gender?: string;
  bloodGroup?: string;
  nidOrBirthCertificate?: string;
  nomineeName?: string;
  nomineeRelation?: string;
  nomineeAddress?: string;
  nomineeVillage?: string;
  nomineePostOffice?: string;
  nomineeDistrict?: string;
  profilePicture?: string;
  profilePicturePublicId?: string;
  mission?: string;
  level: number;
  status: UserStatus;
  referralCode: string;
  joined: string;
  earned: number;
  generationCoins?: number;
  referrals: number;
  role: Role;
  referredByCode?: string | null;
};

export type ProfileUpdateInput = {
  fullName: string;
  phone: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  dateOfBirth?: string;
  religion?: string;
  gender?: string;
  bloodGroup?: string;
  nidOrBirthCertificate?: string;
  nomineeName?: string;
  nomineeRelation?: string;
  nomineeAddress?: string;
  nomineeVillage?: string;
  nomineePostOffice?: string;
  nomineeDistrict?: string;
  profilePicture?: string;
  profilePicturePublicId?: string;
  mission?: string;
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

export type NotificationItem = {
  id: string;
  message: string;
  type: string;
  readAt: string | null;
  createdAt: string;
  unread: boolean;
};

export type NotificationsResponse = {
  items: NotificationItem[];
  unreadCount: number;
  total: number;
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

export type WingCommissionLevel = {
  level: number;
  required: number;
  current: number;
  earning: number;
  status: LevelStatus;
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

export type AdminPaymentsResponse = PaginatedResponse<AdminPayment> & {
  summary: {
    paidTotal: number;
    reviewTotal: number;
    paidCount: number;
    reviewCount: number;
  };
};

export type AdminCommissionExpense = CommissionHistoryItem & {
  type: "Referral Bonus" | "Generation Income" | "Wings Income" | "Other";
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    referralCode: string;
  } | null;
};

export type AdminCommissionExpensesResponse =
  PaginatedResponse<AdminCommissionExpense> & {
    summary: {
      totalAmount: number;
      totalCount: number;
      referralTotal: number;
      generationTotal: number;
      wingsTotal: number;
    };
  };

export type AdminGenerationCoinUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
  referralCode: string;
  joined: string;
  generationCoins: number;
  earned: number;
};

export type AdminGenerationCoinsResponse =
  PaginatedResponse<AdminGenerationCoinUser> & {
    summary: {
      totalCoins: number;
      averageCoins: number;
      usersWithCoins: number;
      maxCoins: number;
    };
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

export type PurchasedProduct = Order & {
  product: Pick<Product, "id" | "name" | "sku" | "image" | "category" | "price"> | null;
};

export type PurchasedProductsResponse = PaginatedResponse<PurchasedProduct> & {
  stats: {
    totalOrders: number;
    paidOrders: number;
    pendingOrders: number;
    failedOrders: number;
    cancelledOrders: number;
    totalSpent: number;
    totalQuantity: number;
    categoryBreakdown: Array<{
      category: string;
      count: number;
      quantity: number;
      totalSpent: number;
    }>;
    topProducts: Array<{
      productId: string;
      name: string;
      image: string;
      category: string;
      orders: number;
      quantity: number;
      totalSpent: number;
      lastPurchasedAt: string;
    }>;
  };
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
  wingsIncome?: {
    totalEarned: number;
    dailyCap: number;
    paidToday: number;
    remainingToday: number;
    completedLevels: number;
    nextReward: number;
    history: CommissionHistoryItem[];
    levels: WingCommissionLevel[];
  };
  referralIncome?: {
    totalEarned: number;
    bonusAmount: number;
    history: CommissionHistoryItem[];
  };
  generationIncome?: {
    coins: number;
    totalEarned: number;
    potential: number;
    currentLevel: CommissionLevel;
    history: CommissionHistoryItem[];
    levels: CommissionLevel[];
  };
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
  dailyPairs: {
    businessDate: string;
    leftVolume: number;
    rightVolume: number;
    pairCount: number;
    pairLimit: number;
    commissionAmount: number;
    commissionPaid: boolean;
    resetsAtTimeZone: string;
  };
  pendingPlacements: Array<{
    id: string;
    name: string;
    phone: string;
    joined: string;
    active: boolean;
  }>;
  tree: TreeNode;
};

export type WingMemberDetailsResponse = {
  user: AuthUser;
  placement: {
    parentUserId: string;
    parentName: string;
    sponsorUserId: string;
    sponsorName: string;
    sponsorCode: string;
    sponsorWing: "Left" | "Right";
    position: "Left" | "Right";
    placedAt: string;
  } | null;
  network: {
    directReferrals: number;
    binaryDownline: number;
    leftNodeCount: number;
    rightNodeCount: number;
    left: { id: string; name: string; active: boolean } | null;
    right: { id: string; name: string; active: boolean } | null;
  };
  purchases: {
    confirmedOrders: number;
    totalPaid: number;
    lastOrderAt: string | null;
  };
  commissions: {
    totalEarned: number;
    paid: number;
    latest: Array<{
      id: string;
      userId: string;
      level: string;
      date: string;
      amount: number;
      status: string;
    }>;
  };
};

export type ReferralPlacementTokens = {
  referralCode: string;
  left: string;
  right: string;
};

export type EarningsResponse = {
  balance: number;
  minimumWithdrawal: number;
  paidWithdrawals?: number;
  reservedWithdrawals?: number;
  earningsByMonth: EarningsMonth[];
  withdrawals: Withdrawal[];
};
