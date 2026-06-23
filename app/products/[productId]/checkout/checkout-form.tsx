"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CreditCard } from "lucide-react";
import { getApiErrorMessage } from "@/lib/api-error";
import { useCreateOrderMutation } from "@/lib/api";
import type { Order, Product } from "@/lib/api-types";
import { availableStock, isOutOfStock, taka } from "@/lib/utils";
import { setCredentials } from "@/lib/auth-slice";
import { useAppDispatch } from "@/lib/hooks";

export function CheckoutForm({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [payment, setPayment] = useState("eps");
  const [initialReferralCode, setInitialReferralCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const stock = availableStock(product.stock);
  const soldOut = isOutOfStock(product.stock);
  const quantity = 1;

  const subtotal = product.price * quantity;
  const total = subtotal;
  const orderId = useMemo(
    () => `GIOTO-${product.sku.split("-").pop()}-${Date.now().toString().slice(-5)}`,
    [product.sku],
  );

  useEffect(() => {
    setInitialReferralCode(new URLSearchParams(window.location.search).get("ref") ?? "");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (soldOut) {
      setMessage("This product is out of stock.");
      return;
    }
    if (stock !== null && stock < 1) {
      setMessage("This product is out of stock.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();

    try {
      const createdOrder = await createOrder({
        productId: product.id,
        quantity,
        fullName,
        email: String(formData.get("email") ?? "").trim().toLowerCase(),
        password: String(formData.get("password") ?? ""),
        referralCode: String(formData.get("referralCode") ?? "").trim() || undefined,
        customerName: fullName,
        phone: String(formData.get("phone") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim(),
        paymentMethod: payment,
      }).unwrap();

      if (createdOrder.auth) {
        dispatch(setCredentials(createdOrder.auth));
      }
      if (createdOrder.payment?.redirectUrl) {
        setMessage("Redirecting to EPS payment gateway...");
        window.location.assign(createdOrder.payment.redirectUrl);
        return;
      }
      if (payment === "eps") {
        setMessage("EPS payment was not initialized. Check backend EPS credentials and API URL.");
        return;
      }

      setOrder(createdOrder.order);
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
        <h2 className="mt-5 text-3xl font-black">Order confirmed</h2>
        <p className="mt-3 leading-8 text-muted">
          Your order number is <span className="font-bold text-foreground">{order?.id ?? orderId}</span>. Your
          member account is ready and signed in.
        </p>
        <div className="mt-5 rounded-2xl border border-line bg-elevated p-4">
          <p className="text-sm text-muted">Total payment</p>
          <p className="mt-1 text-3xl font-black text-gold-light">{taka(order?.total ?? total)}</p>
        </div>
        <Link href="/dashboard" className="gold-button mt-5 inline-flex min-h-12 w-full items-center justify-center px-5 py-3 text-sm font-bold">
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[18px] border border-line bg-surface p-5">
      <h2 className="text-2xl font-bold">Checkout and member account</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        If the email is new, a member account will be created during checkout. If the email already exists, enter that
        account password to continue buying.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Full name</span>
          <input name="fullName" required minLength={3} className="h-12 w-full rounded-2xl border border-line bg-white px-4 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Mobile number</span>
          <input name="phone" required minLength={8} inputMode="tel" placeholder="01XXXXXXXXX" className="h-12 w-full rounded-2xl border border-line bg-white px-4 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10" />
          <span className="block text-xs text-muted">Enter at least 8 digits.</span>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Email</span>
          <input name="email" type="email" required className="h-12 w-full rounded-2xl border border-line bg-white px-4 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-muted">Password</span>
          <input name="password" type="password" required minLength={6} className="h-12 w-full rounded-2xl border border-line bg-white px-4 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10" />
          <span className="block text-xs text-muted">
            New email: set a password. Existing email: enter the correct account password.
          </span>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-muted">Referral code</span>
          <input key={initialReferralCode} name="referralCode" defaultValue={initialReferralCode} inputMode="numeric" placeholder="00000" className="h-12 w-full rounded-2xl border border-line bg-white px-4 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10" />
        </label>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-semibold text-muted">Delivery address</span>
        <textarea
          name="address"
          required
          minLength={8}
          className="min-h-28 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-gold focus:ring-4 focus:ring-gold/10"
        />
        <span className="block text-xs text-muted">Enter the full address, at least 8 characters.</span>
      </label>

      <div className="mt-5">
        <p className="text-sm font-semibold text-muted">Payment method</p>
        <div className="mt-3 grid gap-3">
          {[
            ["eps", CreditCard, "Pay with EPS"],
          ].map(([value, Icon, label]) => {
            const TypedIcon = Icon as typeof CreditCard;
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
          <span className="text-muted">Subtotal</span>
          <span className="font-bold">{taka(subtotal)}</span>
        </div>
        <div className="border-t border-line pt-3">
          <div className="flex items-end justify-between gap-3">
            <span className="font-bold">Total</span>
            <span className="text-3xl font-black text-gold-light">{taka(total)}</span>
          </div>
        </div>
      </div>

      {message ? <p className="mt-5 rounded-2xl bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p> : null}

      <button type="submit" disabled={isLoading || soldOut} className="gold-button mt-5 inline-flex min-h-12 w-full items-center justify-center px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60">
        {soldOut ? "Out of stock" : isLoading ? "Initializing EPS..." : "Pay with EPS"}
      </button>
    </form>
  );
}
