export {
  ActivityModel,
  CommissionHistoryModel,
  CommissionLevelModel,
  EarningsMonthModel,
  NotificationModel,
  OrderModel,
  ProductModel,
  ReferralModel,
  ReferralTreeModel,
  RefreshTokenModel,
  UserModel,
  WithdrawalModel,
  toPublicUser,
} from "./models";
import { UserModel } from "./models";

export function findUserByEmail(email: string) {
  return UserModel.findOne({
    email: email.trim().toLowerCase(),
  });
}

export function findUserById(id: string) {
  return UserModel.findOne({ id });
}
