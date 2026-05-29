import { Schema, model, models } from "mongoose";
import type {
  ActivityRecord,
  AppUser,
  CommissionHistoryRecord,
  EarningsMonthRecord,
  Order,
  ProductRecord,
  PublicUser,
  ReferralRecord,
  RefreshSession,
  WithdrawalRequest,
} from "../types/domain";

export type RefreshTokenRecord = RefreshSession & {
  token: string;
};

type NotificationRecord = {
  ownerUserId?: string;
  message: string;
};

type TreeRecord = {
  key: string;
  tree: unknown;
};

const userSchema = new Schema<AppUser>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, required: true },
    level: { type: Number, required: true, default: 1 },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Banned"],
      required: true,
      default: "Active",
    },
    referralCode: { type: String, required: true, unique: true },
    joined: { type: String, required: true },
    earned: { type: Number, required: true, default: 0 },
    referrals: { type: Number, required: true, default: 0 },
    role: { type: String, enum: ["member", "admin"], required: true },
    referredByUserId: { type: String, default: null, index: true },
    referredByCode: { type: String, default: null },
    passwordHash: { type: String, required: true },
    resetOtp: String,
    resetOtpExpiresAt: Number,
    resetToken: String,
    resetTokenExpiresAt: Number,
  },
  { timestamps: true },
);

const refreshTokenSchema = new Schema<RefreshTokenRecord>(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    expiresAt: { type: Number, required: true },
  },
  { timestamps: true },
);

const orderSchema = new Schema<Order>(
  {
    id: { type: String, required: true, unique: true, index: true },
    productId: { type: String, required: true, index: true },
    quantity: { type: Number, required: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { timestamps: true },
);

const withdrawalSchema = new Schema<WithdrawalRequest>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    account: { type: String, default: "" },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

const productSchema = new Schema<ProductRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
  },
  { strict: false, timestamps: true },
);

const commissionLevelSchema = new Schema(
  {
    level: { type: Number, required: true, unique: true, index: true },
    required: { type: Number, required: true },
    earning: { type: Number, required: true },
    current: { type: Number, required: true, default: 0 },
    color: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

const referralSchema = new Schema<ReferralRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    ownerUserId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    level: { type: Number, required: true },
    joinDate: { type: String, required: true },
    referralCount: { type: Number, required: true, default: 0 },
    status: { type: String, required: true },
    commissionEarned: { type: Number, required: true, default: 0 },
    downline: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const activitySchema = new Schema<ActivityRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    ownerUserId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true },
);

const commissionHistorySchema = new Schema<CommissionHistoryRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    level: { type: String, required: true },
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

const earningsMonthSchema = new Schema<EarningsMonthRecord>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    month: { type: String, required: true },
    income: { type: Number, required: true, default: 0 },
    pending: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const notificationSchema = new Schema<NotificationRecord>(
  {
    ownerUserId: { type: String, index: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

const treeSchema = new Schema<TreeRecord>(
  {
    key: { type: String, required: true, unique: true },
    tree: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

export const UserModel =
  models.User || model<AppUser>("User", userSchema);
export const RefreshTokenModel =
  models.RefreshToken ||
  model<RefreshTokenRecord>("RefreshToken", refreshTokenSchema);
export const OrderModel =
  models.Order || model<Order>("Order", orderSchema);
export const WithdrawalModel =
  models.Withdrawal ||
  model<WithdrawalRequest>("Withdrawal", withdrawalSchema);
export const ProductModel =
  models.Product || model<ProductRecord>("Product", productSchema);
export const CommissionLevelModel =
  models.CommissionLevel || model("CommissionLevel", commissionLevelSchema);
export const ReferralModel =
  models.Referral || model<ReferralRecord>("Referral", referralSchema);
export const ActivityModel =
  models.Activity || model<ActivityRecord>("Activity", activitySchema);
export const CommissionHistoryModel =
  models.CommissionHistory || model<CommissionHistoryRecord>("CommissionHistory", commissionHistorySchema);
export const EarningsMonthModel =
  models.EarningsMonth || model<EarningsMonthRecord>("EarningsMonth", earningsMonthSchema);
export const NotificationModel =
  models.Notification ||
  model<NotificationRecord>("Notification", notificationSchema);
export const ReferralTreeModel =
  models.ReferralTree || model<TreeRecord>("ReferralTree", treeSchema);

export type UserDocumentLike = AppUser & {
  toObject?: () => AppUser;
};

export function toPublicUser(user: UserDocumentLike): PublicUser {
  const plainUser = user.toObject ? user.toObject() : user;

  return {
    id: plainUser.id,
    name: plainUser.name,
    email: plainUser.email,
    phone: plainUser.phone,
    level: plainUser.level,
    status: plainUser.status,
    referralCode: plainUser.referralCode,
    joined: plainUser.joined,
    earned: plainUser.earned,
    referrals: plainUser.referrals,
    role: plainUser.role,
  };
}
