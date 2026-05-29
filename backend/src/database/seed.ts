import bcrypt from "bcryptjs";
import {
  activities,
  commissionHistory,
  commissionLevels,
  earningsByMonth,
  notifications,
  products,
  referrals,
  referralTree,
  users,
  withdrawals,
} from "../../../lib/mock-data";
import type { AppUser, UserStatus, WithdrawalRequest } from "../types/domain";
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

const memberPasswordHash = bcrypt.hashSync("123456", 10);
const adminPasswordHash = bcrypt.hashSync("admin123456", 10);

function seedUsers(): AppUser[] {
  const seededUsers: AppUser[] = users.map((user) => ({
    ...user,
    status: user.status as UserStatus,
    role: "member",
    passwordHash: memberPasswordHash,
  }));

  seededUsers.push({
    id: "admin-1",
    name: "GIOTO Admin",
    email: "admin@giotobangladesh.com",
    phone: "01700000000",
    level: 6,
    status: "Active",
    referralCode: "GIOTO-ADMIN",
    joined: "2026-01-01",
    earned: 0,
    referrals: seededUsers.length,
    role: "admin",
    passwordHash: adminPasswordHash,
  });

  return seededUsers;
}

async function seedIfEmpty<T>(
  model: { countDocuments: () => Promise<number>; insertMany: (docs: T[]) => Promise<unknown> },
  docs: T[],
) {
  const count = await model.countDocuments();
  if (count === 0) {
    await model.insertMany(docs);
  }
}

export async function seedDatabase() {
  await seedIfEmpty(UserModel, seedUsers());
  await seedIfEmpty(ProductModel, products);
  await seedIfEmpty(CommissionLevelModel, commissionLevels);
  await seedIfEmpty(ReferralModel, referrals);
  await seedIfEmpty(ActivityModel, activities);
  await seedIfEmpty(CommissionHistoryModel, commissionHistory);
  await seedIfEmpty(EarningsMonthModel, earningsByMonth);
  await seedIfEmpty(
    NotificationModel,
    notifications.map((message) => ({ message })),
  );
  await seedIfEmpty(ReferralTreeModel, [{ key: "default", tree: referralTree }]);
  await seedIfEmpty(
    WithdrawalModel,
    withdrawals.map<WithdrawalRequest>((item) => ({
      ...item,
      userId: "u1",
      account: "",
      status: item.status as WithdrawalRequest["status"],
    })),
  );
}
