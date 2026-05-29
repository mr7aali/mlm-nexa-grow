import { Schema, model, models } from "mongoose";
import type { Product } from "../../../lib/mock-data";
import type {
  AppUser,
  Order,
  PublicUser,
  RefreshSession,
  WithdrawalRequest,
} from "../types/domain";

export type RefreshTokenRecord = RefreshSession & {
  token: string;
};

type NotificationRecord = {
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

const productSchema = new Schema<Product>(
  {
    id: { type: String, required: true, unique: true, index: true },
  },
  { strict: false, timestamps: true },
);

const looseSchema = new Schema(
  {
    id: { type: String, index: true },
  },
  { strict: false, timestamps: true },
);

const notificationSchema = new Schema<NotificationRecord>(
  {
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
  models.Product || model<Product>("Product", productSchema);
export const CommissionLevelModel =
  models.CommissionLevel || model("CommissionLevel", looseSchema);
export const ReferralModel =
  models.Referral || model("Referral", looseSchema);
export const ActivityModel =
  models.Activity || model("Activity", looseSchema);
export const CommissionHistoryModel =
  models.CommissionHistory || model("CommissionHistory", looseSchema);
export const EarningsMonthModel =
  models.EarningsMonth || model("EarningsMonth", looseSchema);
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
