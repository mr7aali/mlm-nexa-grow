import { randomUUID } from "node:crypto";
import {
  ActivityModel,
  CommissionHistoryModel,
  EarningsMonthModel,
  findUserById,
  NotificationModel,
  ReferralModel,
  toPublicUser,
  WithdrawalModel,
} from "../../database/store";
import type { ReferralRecord, WithdrawalRequest } from "../../types/domain";
import { HttpError } from "../../utils/http-error";

const commissionPlan = [
  { level: 1, required: 6, earning: 200, color: "emerald" },
  { level: 2, required: 36, earning: 600, color: "sky" },
  { level: 3, required: 216, earning: 2000, color: "amber" },
  { level: 4, required: 1296, earning: 10000, color: "rose" },
  { level: 5, required: 7776, earning: 50000, color: "violet" },
  { level: 6, required: 46656, earning: 300000, color: "gold" },
];

type NetworkTreeNode = {
  id: string;
  name: string;
  level: number;
  joined: string;
  referrals: number;
  active: boolean;
  children?: NetworkTreeNode[];
};

async function requireUser(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
}

export function getReferralLink(referralCode: string) {
  return referralCode;
}

function buildCommissionLevels(currentDirectReferrals: number, paidLevels: number[] = []) {
  const firstUnmet = commissionPlan.find(
    (item) => currentDirectReferrals < item.required,
  )?.level;

  return commissionPlan.map((item) => ({
    ...item,
    current: Math.min(currentDirectReferrals, item.required),
    status: paidLevels.includes(item.level)
      ? "Paid"
      : currentDirectReferrals >= item.required
        ? "Unlocked"
        : item.level === firstUnmet
          ? "In Progress"
          : "Locked",
  }));
}

async function countDownline(userId: string): Promise<number> {
  const direct = await ReferralModel.find({ ownerUserId: userId }).lean();
  const nested = await Promise.all(
    direct.map((item) => countDownline(item.userId)),
  );

  return direct.length + nested.reduce((sum, item) => sum + item, 0);
}

async function buildTreeNode(userId: string, depth = 0): Promise<NetworkTreeNode> {
  const user = await requireUser(userId);
  const direct = await ReferralModel.find({ ownerUserId: user.id })
    .sort({ createdAt: 1 })
    .lean();
  const children = await Promise.all(
    direct.map((item) => buildTreeNode(item.userId, depth + 1)),
  );

  return {
    id: depth === 0 ? "root" : user.id,
    name: user.name,
    level: depth,
    joined: user.joined,
    referrals: direct.length,
    active: user.status === "Active",
    children,
  };
}

export async function getDashboard(userId: string) {
  const user = await requireUser(userId);
  const [directReferrals, activeMembers, activities, notificationDocs, history] =
    await Promise.all([
      ReferralModel.countDocuments({ ownerUserId: user.id }),
      ReferralModel.countDocuments({ ownerUserId: user.id, status: "Active" }),
      ActivityModel.find({ ownerUserId: user.id }).sort({ createdAt: -1 }).lean(),
      NotificationModel.find({
        $or: [{ ownerUserId: user.id }, { ownerUserId: { $exists: false } }],
      }).sort({ createdAt: -1 }).lean(),
      CommissionHistoryModel.find({ userId: user.id }).lean(),
    ]);
  const totalNetwork = await countDownline(user.id);
  const paidLevels = history
    .filter((item) => item.status === "Paid")
    .map((item) => Number(String(item.level).replace(/\D/g, "")))
    .filter(Boolean);
  const pendingCommission = history
    .filter((item) => item.status !== "Paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const commissionLevels = buildCommissionLevels(directReferrals, paidLevels);

  return {
    user: toPublicUser(user),
    stats: {
      totalReferrals: directReferrals,
      currentLevel: user.level,
      totalEarned: user.earned,
      pendingCommission,
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
  const user = await requireUser(userId);
  const [directReferrals, history] = await Promise.all([
    ReferralModel.countDocuments({ ownerUserId: user.id }),
    CommissionHistoryModel.find({ userId: user.id }).sort({ createdAt: 1 }).lean(),
  ]);
  const paidLevels = history
    .filter((item) => item.status === "Paid")
    .map((item) => Number(String(item.level).replace(/\D/g, "")))
    .filter(Boolean);
  const levels = buildCommissionLevels(directReferrals, paidLevels);
  const totalEarned = history
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);
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
  const rows = await ReferralModel.find({ ownerUserId: user.id })
    .sort({ createdAt: 1 })
    .lean();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return {
    summary: {
      directReferrals: rows.length,
      totalNetwork: await countDownline(user.id),
      newThisMonth: rows.filter((item) => {
        const createdAt = new Date(item.joinDate);
        return Number.isFinite(createdAt.getTime()) && createdAt >= startOfMonth;
      }).length,
    },
    rows,
  };
}

export async function getWings(userId: string) {
  const user = await requireUser(userId);
  const rows = await ReferralModel.find({ ownerUserId: user.id }).lean();
  const leftWing = rows.filter((_, index) => index % 2 === 0).length;
  const rightWing = rows.length - leftWing;

  return {
    summary: {
      leftWing,
      rightWing,
      activeMembers: rows.filter((item) => item.status === "Active").length,
      inactiveMembers: rows.filter((item) => item.status !== "Active").length,
      totalNetwork: await countDownline(user.id),
    },
    tree: await buildTreeNode(user.id),
  };
}

export async function getEarnings(userId: string) {
  const user = await requireUser(userId);
  const [userWithdrawals, earningsByMonth] = await Promise.all([
    WithdrawalModel.find({ userId: user.id }).sort({ createdAt: -1 }).lean(),
    EarningsMonthModel.find({ userId: user.id }).sort({ createdAt: 1 }).lean(),
  ]);
  const paidWithdrawals = userWithdrawals
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    balance: Math.max(0, user.earned - paidWithdrawals),
    minimumWithdrawal: 200,
    earningsByMonth,
    withdrawals: userWithdrawals,
  };
}

export async function getCurrentBalance(userId: string) {
  const user = await requireUser(userId);
  const paidWithdrawals = await WithdrawalModel.find({
    userId: user.id,
    status: "Paid",
  }).lean();

  return Math.max(0, user.earned - paidWithdrawals.reduce((sum, item) => sum + item.amount, 0));
}

export async function createWithdrawal(
  userId: string,
  values: { amount: number; method: string; account: string },
) {
  const user = await requireUser(userId);
  const balance = await getCurrentBalance(user.id);

  if (values.amount > balance) {
    throw new HttpError(400, "Withdrawal amount exceeds current balance");
  }

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
