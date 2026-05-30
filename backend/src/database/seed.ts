import {
  ActivityModel,
  CommissionHistoryModel,
  CommissionLevelModel,
  EarningsMonthModel,
  NotificationModel,
  ProductModel,
  ReferralModel,
  ReferralTreeModel,
  UserModel,
  WithdrawalModel,
} from "./models";

const legacyDemoEmails = [
  "rafi@giotobangladesh.com",
  "tania@giotobangladesh.com",
  "mahin@giotobangladesh.com",
  "sabiha@giotobangladesh.com",
  "arman@giotobangladesh.com",
  "nadia@giotobangladesh.com",
  "admin@giotobangladesh.com",
];

const legacyProductIds = ["health-kit", "beauty-care", "learn-pro", "home-plus"];

export async function seedDatabase() {
  await Promise.all([
    UserModel.deleteMany({ email: { $in: legacyDemoEmails } }),
    ProductModel.deleteMany({ id: { $in: legacyProductIds } }),
    CommissionLevelModel.deleteMany({}),
    ReferralModel.deleteMany({ ownerUserId: { $exists: false } }),
    ActivityModel.deleteMany({ ownerUserId: { $exists: false } }),
    CommissionHistoryModel.deleteMany({ userId: { $exists: false } }),
    EarningsMonthModel.deleteMany({ userId: { $exists: false } }),
    NotificationModel.deleteMany({ ownerUserId: { $exists: false } }),
    ReferralTreeModel.deleteMany({}),
    WithdrawalModel.deleteMany({ userId: "u1" }),
  ]);
}
