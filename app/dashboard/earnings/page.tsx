"use client";

import { useEffect, useState } from "react";
import { Landmark, TrendingUp, WalletCards } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { WithdrawalRequestForm } from "@/components/dashboard/withdrawal-request-form";
import { Card } from "@/components/ui";
import { useGetCommissionsQuery, useGetEarningsQuery } from "@/lib/api";
import { taka } from "@/lib/utils";

export default function EarningsPage() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading: earningsLoading } = useGetEarningsQuery();
  const { data: commissions } = useGetCommissionsQuery();
  const balance = data?.balance ?? 0;
  const totalWithdraw = data?.paidWithdrawals ?? 0;
  const totalIncome =
    (data?.balance ?? 0) +
    (data?.reservedWithdrawals ?? 0);
  const monthlyRows = data?.earningsByMonth ?? [];
  const withdrawalRows = data?.withdrawals ?? [];
  const incomeSources = [
    {
      label: "Referral Bonus",
      value: commissions?.referralIncome?.totalEarned ?? 0,
    },
    {
      label: "Product Pair Commission",
      value: commissions?.productPairIncome?.totalEarned ?? 0,
    },
    {
      label: "Generation Bonus",
      value: commissions?.generationIncome?.totalEarned ?? 0,
    },
  ];

  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">Balance and withdrawals</p>
        <h2 className="heading-gradient text-4xl font-black">Earnings</h2>
      </div>

      {earningsLoading ? <p className="text-sm text-muted">Loading earnings data...</p> : null}

      <Card className="p-4 md:p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-gold-light">
              Wallet Report
            </p>
            <h3 className="text-2xl font-black">Income overview</h3>
          </div>
          {data?.reservedWithdrawals ? (
            <p className="text-sm font-semibold text-muted">
              Pending withdraw: {taka(data.reservedWithdrawals)}
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              label: "Total Income",
              value: totalIncome,
              icon: TrendingUp,
            },
            {
              label: "Total Withdraw",
              value: totalWithdraw,
              icon: Landmark,
            },
            {
              label: "Current Balance",
              value: balance,
              icon: WalletCards,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-lg border border-line bg-elevated p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-muted">
                    {item.label}
                  </p>
                  <Icon size={18} className="text-gold-light" />
                </div>
                <p className="mt-2 truncate text-2xl font-black text-gold-light">
                  {taka(item.value)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-lg border border-line bg-elevated p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-lg font-bold">Income Sources</h4>
            <p className="text-xs font-semibold text-muted">
              Referral, product pair, and generation
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {incomeSources.map((source) => (
              <div
                key={source.label}
                className="rounded-md border border-line bg-surface px-3 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {source.label}
                </p>
                <p className="mt-1 text-xl font-black text-foreground">
                  {taka(source.value)}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            Referral Bonus pays BDT 100 for every successful product purchase
            that uses your referral code, including your own purchases.
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <WithdrawalRequestForm />
      </Card>

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
