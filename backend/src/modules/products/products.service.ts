import { ProductModel, OrderModel } from "../../database/store";
import type { Order } from "../../types/domain";
import { HttpError } from "../../utils/http-error";

export async function getProducts() {
  return ProductModel.find().sort({ createdAt: 1 }).lean();
}

export async function getProduct(productId: string) {
  const product = await ProductModel.findOne({ id: productId }).lean();

  if (!product) {
    throw new HttpError(404, "Product not found");
  }

  return product;
}

export async function createOrder(values: {
  productId: string;
  quantity: number;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
}) {
  const product = await getProduct(values.productId);
  const subtotal = product.price * values.quantity;
  const shipping = subtotal >= 1500 ? 0 : 80;
  const order: Order = {
    id: `GIOTO-${product.sku.split("-").pop()}-${Date.now().toString().slice(-5)}`,
    productId: values.productId,
    quantity: values.quantity,
    customerName: values.customerName,
    phone: values.phone,
    address: values.address,
    paymentMethod: values.paymentMethod,
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };

  return OrderModel.create(order);
}
