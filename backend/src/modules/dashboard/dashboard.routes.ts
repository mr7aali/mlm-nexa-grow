import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate";
import { ok } from "../../utils/api-response";
import { createWithdrawalSchema } from "./dashboard.schemas";
import {
  createWithdrawal,
  getCommissions,
  getDashboard,
  getEarnings,
  getReferrals,
  getWings,
} from "./dashboard.service";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

dashboardRouter.get("/", async (req, res, next) => {
  try {
    res.json(ok(await getDashboard(req.auth!.userId)));
  } catch (error) {
    next(error);
  }
});

dashboardRouter.get("/commissions", async (req, res, next) => {
  try {
    res.json(ok(await getCommissions(req.auth!.userId)));
  } catch (error) {
    next(error);
  }
});

dashboardRouter.get("/referrals", async (req, res, next) => {
  try {
    res.json(ok(await getReferrals(req.auth!.userId)));
  } catch (error) {
    next(error);
  }
});

dashboardRouter.get("/wings", async (req, res, next) => {
  try {
    res.json(ok(await getWings(req.auth!.userId)));
  } catch (error) {
    next(error);
  }
});

dashboardRouter.get("/earnings", async (req, res, next) => {
  try {
    res.json(ok(await getEarnings(req.auth!.userId)));
  } catch (error) {
    next(error);
  }
});

dashboardRouter.post(
  "/withdrawals",
  validateBody(createWithdrawalSchema),
  async (req, res, next) => {
    try {
      res.status(201).json(
        ok(await createWithdrawal(req.auth!.userId, req.body), "Withdrawal requested"),
      );
    } catch (error) {
      next(error);
    }
  },
);
