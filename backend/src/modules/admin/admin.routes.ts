import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate";
import {
  findUserById,
  NotificationModel,
  UserModel,
  toPublicUser,
} from "../../database/store";
import { ok } from "../../utils/api-response";
import { HttpError } from "../../utils/http-error";
import {
  broadcastSchema,
  creditCommissionSchema,
  updateUserStatusSchema,
} from "./admin.schemas";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/users", async (_req, res, next) => {
  try {
    const users = await UserModel.find().sort({ createdAt: 1 });
    res.json(ok(users.map(toPublicUser)));
  } catch (error) {
    next(error);
  }
});

adminRouter.patch(
  "/users/:userId/status",
  validateBody(updateUserStatusSchema),
  async (req, res, next) => {
    try {
      const user = await findUserById(String(req.params.userId));
      if (!user) throw new HttpError(404, "User not found");
      user.status = req.body.status;
      await user.save();
      res.json(ok(toPublicUser(user), "User status updated"));
    } catch (error) {
      next(error);
    }
  },
);

adminRouter.post(
  "/commissions/credit",
  validateBody(creditCommissionSchema),
  async (req, res, next) => {
    try {
      const user = await findUserById(req.body.user);
      if (!user) throw new HttpError(404, "User not found");
      user.earned += req.body.amount;
      await user.save();
      res.status(201).json(
        ok(
          {
            user: toPublicUser(user),
            note: req.body.note,
          },
          "Commission credited",
        ),
      );
    } catch (error) {
      next(error);
    }
  },
);

adminRouter.post("/broadcasts", validateBody(broadcastSchema), async (req, res, next) => {
  try {
    await NotificationModel.create({ message: req.body.message });
    res.status(201).json(ok({ delivered: true }, "Broadcast sent"));
  } catch (error) {
    next(error);
  }
});
