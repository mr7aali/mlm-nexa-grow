"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { WithdrawalRequestForm } from "@/components/dashboard/withdrawal-request-form";
import { Card } from "@/components/ui";
import { useGetEarningsQuery } from "@/lib/api";
import { taka } from "@/lib/utils";

export default function EarningsPage() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading: earningsLoading } = useGetEarningsQuery();
  const balance = data?.balance ?? 0;
  const monthlyRows = data?.earningsByMonth ?? [];
  const withdrawalRows = data?.withdrawals ?? [];

  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">Balance and withdrawals</p>
        <h2 className="heading-gradient text-4xl font-black">Earnings</h2>
      </div>

      {earningsLoading ? <p className="text-sm text-muted">Loading earnings data...</p> : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="bg-[radial-gradient(circle_at_top_right,rgba(232,82,10,0.14),#FFFFFF_45%)] p-6">
          <p className="text-muted">Available balance</p>
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

      <Card className="p-6">
        <h3 className="mb-4 text-2xl font-bold">Monthly earnings</h3>
        <div className="h-80">
          {mounted && monthlyRows.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRows}>
                <CartesianGrid stroke="#FFD4B8" vertical={false} />
                <XAxis dataKey="month" stroke="#6D5A4F" />
                <YAxis stroke="#6D5A4F" />
                <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #FFD4B8", borderRadius: 16, color: "#1A1A1A" }} />
                <Bar dataKey="income" name="Income" fill="#E8520A" radius={[10, 10, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#FFA472" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center rounded-[18px] border border-line bg-elevated text-muted">
              {mounted ? "No earnings chart data yet." : "Loading chart..."}
            </div>
          )}
        </div>
      </Card>

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>{["Date", "Amount", "Method", "Account", "Status"].map((head) => <th key={head} className="px-5 py-4">{head}</th>)}</tr>
          </thead>
          <tbody>
            {withdrawalRows.length ? withdrawalRows.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-5 py-4">{item.date}</td>
                <td className="px-5 py-4 text-gold-light">{taka(item.amount)}</td>
                <td className="px-5 py-4">{item.method}</td>
                <td className="px-5 py-4 text-muted">{item.account ?? "-"}</td>
                <td className="px-5 py-4 text-muted">{item.status}</td>
              </tr>
            )) : (
              <tr><td className="px-5 py-8 text-center text-muted" colSpan={5}>No withdrawal requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
