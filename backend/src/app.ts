import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { adminRouter } from "./modules/admin/admin.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { productsRouter } from "./modules/products/products.routes";
import { notFoundHandler } from "./middleware/error.middleware";
import { ok } from "./utils/api-response";
import { createOrder } from "./modules/products/products.service";
import { createOrderSchema } from "./modules/products/products.schemas";

export function createApp() {
  const app = express();

  // app.use(
  //   cors({
  //     origin: env.clientOrigin,
  //     credentials: true,
  //   }),
  // );
  app.use(
    cors({
      origin: (origin, callback) => {
        callback(null, true);
      },
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.json(ok({ status: "healthy" }));
  });

  app.use("/api/auth", authRouter);
  app.use("/api/products", productsRouter);
  app.post("/api/orders", async (req, res, next) => {
    try {
      const body = createOrderSchema.parse(req.body);
      res.status(201).json(ok(await createOrder(body), "Order confirmed"));
    } catch (error) {
      next(error);
    }
  });
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/admin", adminRouter);

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });
  app.use(notFoundHandler);

  return app;
}
