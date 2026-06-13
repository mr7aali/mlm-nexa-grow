"use client";

import { CreditCard, WalletCards } from "lucide-react";
import { WithdrawalRequestForm } from "@/components/dashboard/withdrawal-request-form";
import { Card } from "@/components/ui";
import { useGetPaymentsQuery } from "@/lib/api";
import { taka } from "@/lib/utils";

export default function MemberPaymentsPage() {
  const { data, isLoading: paymentsLoading } = useGetPaymentsQuery();
  const balance = data?.balance ?? 0;
  const withdrawals = data?.withdrawals ?? [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">Payments and transactions</p>
        <h2 className="heading-gradient text-4xl font-black">My payments</h2>
      </div>

      {paymentsLoading ? <p className="text-sm text-muted">Loading payment data...</p> : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="bg-[radial-gradient(circle_at_top_right,rgba(232,82,10,0.14),#FFFFFF_45%)] p-6">
          <div className="flex items-center gap-3 text-gold-light">
            <WalletCards size={30} />
            <p className="font-semibold">Available balance</p>
          </div>
          <p className="mt-3 text-6xl font-black text-gold-light">{taka(balance)}</p>
          <p className="mt-4 rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">
            Minimum withdrawal: BDT 200
          </p>
          {data?.reservedWithdrawals ? (
            <p className="mt-3 text-sm text-muted">
              Reserved in pending/review/paid requests: {taka(data.reservedWithdrawals)}
            </p>
          ) : null}
        </Card>

        <Card className="p-6">
          <WithdrawalRequestForm balance={balance} />
        </Card>
      </div>

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <div className="flex items-center gap-3 p-5">
          <CreditCard className="text-gold-light" size={22} />
          <h3 className="text-2xl font-bold">Transaction history</h3>
        </div>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>{["Date", "Amount", "Method", "Account", "Status"].map((head) => <th key={head} className="px-5 py-4">{head}</th>)}</tr>
          </thead>
          <tbody>
            {withdrawals.length ? withdrawals.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-5 py-4">{item.date}</td>
                <td className="px-5 py-4 font-bold text-gold-light">{taka(item.amount)}</td>
                <td className="px-5 py-4">{item.method}</td>
                <td className="px-5 py-4 text-muted">{item.account ?? "-"}</td>
                <td className="px-5 py-4 text-muted">{item.status}</td>
              </tr>
            )) : (
              <tr><td className="px-5 py-8 text-center text-muted" colSpan={5}>No transactions yet.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
