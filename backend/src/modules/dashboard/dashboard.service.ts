import { randomUUID } from "node:crypto";
import {
  ActivityModel,
  CommissionHistoryModel,
  CommissionLevelModel,
  EarningsMonthModel,
  findUserById,
  NotificationModel,
  ReferralModel,
  ReferralTreeModel,
  toPublicUser,
  WithdrawalModel,
} from "../../database/store";
import type { WithdrawalRequest } from "../../types/domain";
import { HttpError } from "../../utils/http-error";

async function requireUser(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
}

export function getReferralLink(referralCode: string) {
  return `https://giotobangladesh.com/register?ref=${referralCode}`;
}

export async function getDashboard(userId: string) {
  const user = await requireUser(userId);
  const [commissionLevels, activities, notificationDocs, totalNetwork, activeMembers] =
    await Promise.all([
      CommissionLevelModel.find().sort({ level: 1 }).lean(),
      ActivityModel.find().sort({ createdAt: 1 }).lean(),
      NotificationModel.find().sort({ createdAt: -1 }).lean(),
      ReferralModel.countDocuments(),
      ReferralModel.countDocuments({ status: "Active" }),
    ]);
  const currentLevel =
    commissionLevels.find((item) => item.status === "In Progress") ??
    commissionLevels[0];

  return {
    user: toPublicUser(user),
    stats: {
      totalReferrals: user.referrals,
      currentLevel: user.level,
      totalEarned: user.earned,
      pendingCommission: currentLevel?.earning ?? 0,
      totalNetwork,
      activeMembers,
    },
    referralLink: getReferralLink(user.referralCode),
    commissionLevels,
    activities,
    notifications: notificationDocs.map((item) => item.message),
  };
}

export async function getCommissions(userId: string) {
  await requireUser(userId);
  const [levels, history] = await Promise.all([
    CommissionLevelModel.find().sort({ level: 1 }).lean(),
    CommissionHistoryModel.find().sort({ createdAt: 1 }).lean(),
  ]);
  const totalEarned = levels
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.earning, 0);
  const potential = levels.reduce((sum, item) => sum + item.earning, 0);
  const currentLevel =
    levels.find((item) => item.status === "In Progress") ?? levels[0];

  return {
    totalEarned,
    potential,
    currentLevel,
    history,
    levels,
  };
}

export async function getReferrals(userId: string) {
  const user = await requireUser(userId);
  const rows = await ReferralModel.find().sort({ createdAt: 1 }).lean();

  return {
    summary: {
      directReferrals: user.referrals,
      totalNetwork: rows.length,
      newThisMonth: 11,
    },
    rows,
  };
}

export async function getWings(userId: string) {
  await requireUser(userId);
  const [tree, totalNetwork] = await Promise.all([
    ReferralTreeModel.findOne({ key: "default" }).lean(),
    ReferralModel.countDocuments(),
  ]);

  return {
    summary: {
      leftWing: 12,
      rightWing: 18,
      activeMembers: 26,
      inactiveMembers: 4,
      totalNetwork,
    },
    tree: tree?.tree,
  };
}

export async function getEarnings(userId: string) {
  const user = await requireUser(userId);
  const [userWithdrawals, earningsByMonth] = await Promise.all([
    WithdrawalModel.find({ userId: user.id }).sort({ createdAt: -1 }).lean(),
    EarningsMonthModel.find().sort({ createdAt: 1 }).lean(),
  ]);
  const paidWithdrawals = userWithdrawals
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    balance: Math.max(0, user.earned + 1980 - paidWithdrawals),
    minimumWithdrawal: 200,
    earningsByMonth,
    withdrawals: userWithdrawals,
  };
}

export async function createWithdrawal(
  userId: string,
  values: { amount: number; method: string; account: string },
) {
  const user = await requireUser(userId);

  const withdrawal: WithdrawalRequest = {
    id: randomUUID(),
    userId: user.id,
    date: new Date().toISOString(),
    amount: values.amount,
    method: values.method,
    account: values.account,
    status: "Pending",
  };

  return WithdrawalModel.create(withdrawal);
}
