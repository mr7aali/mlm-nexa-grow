import { Router } from "express";
import { ok } from "../../utils/api-response";
import { getProduct, getProducts } from "./products.service";

export const productsRouter = Router();

productsRouter.get("/", async (_req, res, next) => {
  try {
    res.json(ok(await getProducts()));
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    res.json(ok(await getProduct(req.params.productId)));
  } catch (error) {
    next(error);
  }
});
