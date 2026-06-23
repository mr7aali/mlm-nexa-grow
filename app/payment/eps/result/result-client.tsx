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

type EpsVerifyResult = {
  orderId: string;
  status: string;
  paymentStatus: string;
};

export function EpsPaymentResultClient() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [sessionMessage, setSessionMessage] = useState("");
  const orderId = searchParams.get("orderId") ?? "";
  const initialStatus = searchParams.get("status") ?? "Pending";
  const initialPaymentStatus = searchParams.get("paymentStatus") ?? "Pending";

  const [orderStatus, setOrderStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [verifying, setVerifying] = useState(true);

  const paid = paymentStatus === "Paid" || orderStatus === "Confirmed";
  const failed =
    paymentStatus === "Failed" ||
    paymentStatus === "Cancelled" ||
    orderStatus === "Cancelled";
  const pending = !paid && !failed;
  const Icon = paid ? CheckCircle2 : failed ? XCircle : Clock3;
  const title = paid
    ? "Payment confirmed"
    : failed
      ? "Payment not completed"
      : "Payment is being reviewed";

  const base = useMemo(() => apiBaseUrl.replace(/\/+$/, ""), []);

  // Re-verify with the backend on load. This finalizes the order and provisions
  // the member account even when the gateway settles just after the redirect.
  useEffect(() => {
    if (!orderId) {
      setVerifying(false);
      return;
    }

    let cancelled = false;

    async function verifyAndRefresh() {
      let confirmed = paid;

      try {
        const verifyResponse = await fetch(
          `${base}/payments/eps/orders/${encodeURIComponent(orderId)}/verify`,
          { method: "POST", credentials: "include" },
        );
        const verifyPayload = (await verifyResponse.json()) as ApiResponse<EpsVerifyResult>;

        if (!cancelled && verifyResponse.ok && verifyPayload.success) {
          setOrderStatus(verifyPayload.data.status);
          setPaymentStatus(verifyPayload.data.paymentStatus);
          confirmed =
            verifyPayload.data.paymentStatus === "Paid" ||
            verifyPayload.data.status === "Confirmed";
        }
      } catch {
        // Network hiccup: keep the status from the redirect params.
      }

      if (confirmed) {
        try {
          const response = await fetch(`${base}/auth/refresh`, {
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
            setSessionMessage(
              "Payment is confirmed. Sign in if the dashboard asks again.",
            );
          }
        }
      }

      if (!cancelled) setVerifying(false);
    }

    verifyAndRefresh();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, base, dispatch]);

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
        {verifying && pending ? (
          <p className="mt-3 text-sm text-muted">Confirming your payment with the gateway...</p>
        ) : null}
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
