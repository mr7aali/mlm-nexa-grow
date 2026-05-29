"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, Minus, Plus, Smartphone, Truck } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api-error";
import { useCreateOrderMutation } from "@/lib/api";
import type { Order, Product } from "@/lib/api-types";
import { taka } from "@/lib/utils";

export function CheckoutForm({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState("cash");
  const [submitted, setSubmitted] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const shipping = product.price * quantity >= 1500 ? 0 : 80;
  const subtotal = product.price * quantity;
  const total = subtotal + shipping;
  const orderId = useMemo(() => `GIOTO-${product.sku.split("-").pop()}-${Date.now().toString().slice(-5)}`, [product.sku]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const formData = new FormData(event.currentTarget);

    try {
      const createdOrder = await createOrder({
        productId: product.id,
        quantity,
        customerName: String(formData.get("customerName") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        address: String(formData.get("address") ?? ""),
        paymentMethod: payment,
      }).unwrap();
      setOrder(createdOrder);
      setSubmitted(true);
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Order failed"));
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[18px] border border-line bg-surface p-6">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gold/10 text-gold-light">
          <CheckCircle2 size={30} />
        </div>
        <h2 className="mt-5 text-3xl font-black">অর্ডার কনফার্ম হয়েছে</h2>
        <p className="mt-3 leading-8 text-muted">
          আপনার অর্ডার নম্বর <span className="font-bold text-foreground">{order?.id ?? orderId}</span>। আমাদের টিম ফোনে তথ্য নিশ্চিত করবে।
        </p>
        <div className="mt-5 rounded-2xl border border-line bg-elevated p-4">
          <p className="text-sm text-muted">মোট পেমেন্ট</p>
          <p className="mt-1 text-3xl font-black text-gold-light">{taka(order?.total ?? total)}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[18px] border border-line bg-surface p-5">
      <h2 className="text-2xl font-bold">চেকআউট তথ্য</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">পুরো নাম</span>
          <input name="customerName" required className="h-12 w-full rounded-2xl border border-line bg-white px-4 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">মোবাইল নম্বর</span>
          <input name="phone" required inputMode="tel" className="h-12 w-full rounded-2xl border border-line bg-white px-4 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10" />
        </label>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-semibold text-muted">ডেলিভারি ঠিকানা</span>
        <textarea
          name="address"
          required
          className="min-h-28 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10"
        />
      </label>

      <div className="mt-5 rounded-2xl border border-line bg-elevated p-4">
        <p className="text-sm font-semibold text-muted">পরিমাণ</p>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="grid h-11 w-11 place-items-center rounded-full border border-gold text-gold transition hover:bg-gold/10"
            aria-label="পরিমাণ কমান"
          >
            <Minus size={16} />
          </button>
          <span className="grid h-11 min-w-14 place-items-center rounded-2xl bg-surface px-4 text-lg font-black">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(10, value + 1))}
            className="grid h-11 w-11 place-items-center rounded-full border border-gold text-gold transition hover:bg-gold/10"
            aria-label="পরিমাণ বাড়ান"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-muted">পেমেন্ট পদ্ধতি</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            ["cash", Truck, "Cash"],
            ["bkash", Smartphone, "bKash"],
            ["card", CreditCard, "Card"],
          ].map(([value, Icon, label]) => {
            const TypedIcon = Icon as typeof Truck;
            const active = payment === value;

            return (
              <button
                key={String(value)}
                type="button"
                onClick={() => setPayment(String(value))}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-full border px-4 text-sm font-bold transition ${
                  active ? "border-gold bg-gold text-white" : "border-line bg-white text-muted hover:border-gold hover:text-gold"
                }`}
              >
                <TypedIcon size={16} />
                {String(label)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 space-y-3 rounded-2xl border border-line bg-elevated p-4">
        <div className="flex justify-between gap-3 text-sm">
          <span className="text-muted">সাবটোটাল</span>
          <span className="font-bold">{taka(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-3 text-sm">
          <span className="text-muted">ডেলিভারি চার্জ</span>
          <span className="font-bold">{shipping === 0 ? "ফ্রি" : taka(shipping)}</span>
        </div>
        <div className="border-t border-line pt-3">
          <div className="flex items-end justify-between gap-3">
            <span className="font-bold">মোট</span>
            <span className="text-3xl font-black text-gold-light">{taka(total)}</span>
          </div>
        </div>
      </div>

      {message ? <p className="mt-5 rounded-2xl bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p> : null}

      <button type="submit" disabled={isLoading} className="gold-button mt-5 inline-flex min-h-12 w-full items-center justify-center px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60">
        অর্ডার কনফার্ম করুন
      </button>
    </form>
  );
}
