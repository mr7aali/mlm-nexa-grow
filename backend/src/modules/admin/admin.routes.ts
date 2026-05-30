import { Router } from "express";
import { requireAnyRole, requireAuth } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate";
import {
  findUserById,
  NotificationModel,
  ProductModel,
  UserModel,
  toPublicUser,
  WithdrawalModel,
} from "../../database/store";
import { ok } from "../../utils/api-response";
import { HttpError } from "../../utils/http-error";
import {
  broadcastSchema,
  createProductSchema,
  creditCommissionSchema,
  updateUserRoleSchema,
  updateWithdrawalStatusSchema,
  updateUserStatusSchema,
} from "./admin.schemas";
import type { Role, UserStatus } from "../../types/domain";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAnyRole(["admin", "super-admin"]));

function pagination(query: { page?: unknown; limit?: unknown }) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

function paged<T>(items: T[], total: number, page: number, limit: number) {
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `product-${Date.now()}`;
}

adminRouter.get("/users", async (_req, res, next) => {
  try {
    const { page, limit, skip } = pagination(_req.query);
    const search = String(_req.query.search ?? "").trim();
    const status = String(_req.query.status ?? "");
    const role = String(_req.query.role ?? "");
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { referralCode: { $regex: search, $options: "i" } },
      ];
    }
    if (["Active", "Inactive", "Banned"].includes(status)) {
      filter.status = status as UserStatus;
    }
    if (["member", "admin", "super-admin"].includes(role)) {
      filter.role = role as Role;
    }

    const [users, total] = await Promise.all([
      UserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      UserModel.countDocuments(filter),
    ]);
    res.json(ok(paged(users.map(toPublicUser), total, page, limit)));
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

adminRouter.patch(
  "/users/:userId/role",
  validateBody(updateUserRoleSchema),
  async (req, res, next) => {
    try {
      const user = await findUserById(String(req.params.userId));
      if (!user) throw new HttpError(404, "User not found");
      user.role = req.body.role;
      await user.save();
      res.json(ok(toPublicUser(user), "User role updated"));
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

adminRouter.get("/products", async (req, res, next) => {
  try {
    const { page, limit, skip } = pagination(req.query);
    const search = String(req.query.search ?? "").trim();
    const category = String(req.query.category ?? "").trim();
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    const [products, total] = await Promise.all([
      ProductModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ProductModel.countDocuments(filter),
    ]);

    res.json(ok(paged(products, total, page, limit)));
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/products", validateBody(createProductSchema), async (req, res, next) => {
  try {
    const id = req.body.id?.trim() || slugify(req.body.name);
    const exists = await ProductModel.findOne({
      $or: [{ id }, { sku: req.body.sku }],
    });

    if (exists) {
      throw new HttpError(409, "Product id or SKU already exists");
    }

    const product = await ProductModel.create({
      ...req.body,
      id,
      discountPercent:
        req.body.discountPercent ??
        Math.max(0, Math.round(((req.body.originalPrice - req.body.price) / req.body.originalPrice) * 100)),
      highlights: req.body.highlights ?? [],
      includes: req.body.includes ?? [],
      details: req.body.details ?? [],
    });

    res.status(201).json(ok(product, "Product added"));
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/withdrawals", async (_req, res, next) => {
  try {
    const withdrawals = await WithdrawalModel.find().sort({ createdAt: -1 }).lean();
    res.json(ok(withdrawals));
  } catch (error) {
    next(error);
  }
});

adminRouter.patch(
  "/withdrawals/:withdrawalId/status",
  validateBody(updateWithdrawalStatusSchema),
  async (req, res, next) => {
    try {
      const withdrawal = await WithdrawalModel.findOne({ id: String(req.params.withdrawalId) });
      if (!withdrawal) throw new HttpError(404, "Withdrawal not found");
      withdrawal.status = req.body.status;
      await withdrawal.save();
      res.json(ok(withdrawal, "Withdrawal status updated"));
    } catch (error) {
      next(error);
    }
  },
);

adminRouter.post("/broadcasts", validateBody(broadcastSchema), async (req, res, next) => {
  try {
    const users = await UserModel.find().select("id").lean();
    if (users.length) {
      await NotificationModel.insertMany(
        users.map((user) => ({
          ownerUserId: user.id,
          message: req.body.message,
        })),
      );
    }
    res.status(201).json(ok({ delivered: true }, "Broadcast sent"));
  } catch (error) {
    next(error);
  }
});
