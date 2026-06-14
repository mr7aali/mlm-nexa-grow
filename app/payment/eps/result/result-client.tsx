"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Card } from "@/components/ui";
import { setCredentials } from "@/lib/auth-slice";
import type { ApiResponse, AuthPayload } from "@/lib/api-types";
import { useAppDispatch } from "@/lib/hooks";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://giotobangladesh.com/api";

export function EpsPaymentResultClient() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [sessionMessage, setSessionMessage] = useState("");
  const orderId = searchParams.get("orderId") ?? "";
  const orderStatus = searchParams.get("status") ?? "Pending";
  const paymentStatus = searchParams.get("paymentStatus") ?? "Pending";
  const paid = paymentStatus === "Paid" || orderStatus === "Confirmed";
  const failed = paymentStatus === "Failed" || paymentStatus === "Cancelled" || orderStatus === "Cancelled";
  const Icon = paid ? CheckCircle2 : failed ? XCircle : Clock3;
  const title = paid ? "Payment confirmed" : failed ? "Payment not completed" : "Payment is being reviewed";

  const refreshUrl = useMemo(
    () => `${apiBaseUrl.replace(/\/+$/, "")}/auth/refresh`,
    [],
  );

  useEffect(() => {
    if (!paid) return;

    let cancelled = false;
    async function refreshSession() {
      try {
        const response = await fetch(refreshUrl, {
          method: "POST",
          credentials: "include",
        });
        const payload = (await response.json()) as ApiResponse<AuthPayload>;

        if (!cancelled && response.ok && payload.success) {
          dispatch(setCredentials(payload.data));
          setSessionMessage("Your member account is ready.");
        }
      } catch {
        if (!cancelled) {
          setSessionMessage("Payment is confirmed. Sign in if the dashboard asks again.");
        }
      }
    }

    refreshSession();

    return () => {
      cancelled = true;
    };
  }, [dispatch, paid, refreshUrl]);

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4 py-12">
      <Card className="w-full p-6 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/10 text-gold-light">
          <Icon size={34} />
        </div>
        <h1 className="mt-5 text-3xl font-black">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Order {orderId || "reference"} is currently {orderStatus}. Payment status: {paymentStatus}.
        </p>
        {sessionMessage ? <p className="mt-3 text-sm text-muted">{sessionMessage}</p> : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/dashboard" className="gold-button inline-flex min-h-12 items-center justify-center px-5 py-3 text-sm font-bold">
            Dashboard
          </Link>
          <Link href="/products" className="outline-gold inline-flex min-h-12 items-center justify-center px-5 py-3 text-sm font-bold">
            Continue shopping
          </Link>
        </div>
      </Card>
    </main>
  );
}
