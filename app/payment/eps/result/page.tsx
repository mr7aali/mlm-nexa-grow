import Link from "next/link";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Card } from "@/components/ui";

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function EpsPaymentResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const orderId = firstValue(searchParams.orderId) ?? "";
  const orderStatus = firstValue(searchParams.status) ?? "Pending";
  const paymentStatus = firstValue(searchParams.paymentStatus) ?? "Pending";
  const paid = paymentStatus === "Paid" || orderStatus === "Confirmed";
  const failed = paymentStatus === "Failed" || paymentStatus === "Cancelled" || orderStatus === "Cancelled";
  const Icon = paid ? CheckCircle2 : failed ? XCircle : Clock3;
  const title = paid ? "Payment confirmed" : failed ? "Payment not completed" : "Payment is being reviewed";

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
