"use client";

import { Copy, Network, Sparkles, TrendingUp, WalletCards } from "lucide-react";
import { Button, Card, CopyButton, Progress } from "@/components/ui";
import { useGetDashboardQuery } from "@/lib/api";
import { taka, toBn } from "@/lib/utils";

export default function DashboardPage() {
  const { data, isLoading } = useGetDashboardQuery();
  const stats = data?.stats ?? {
    totalReferrals: 0,
    currentLevel: 1,
    totalEarned: 0,
    pendingCommission: 0,
    totalNetwork: 0,
    activeMembers: 0,
  };
  const levels = data?.commissionLevels ?? [];
  const currentLevel = levels.find((item) => item.status === "In Progress") ?? levels[0];
  const progress = currentLevel ? (currentLevel.current / currentLevel.required) * 100 : 0;
  const link = data?.referralLink ?? "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-gold-light">Member panel</p>
          <h2 className="heading-gradient text-4xl font-black">Dashboard</h2>
        </div>
        <CopyButton value={link} label="Copy referral link" />
      </div>

      {isLoading ? <p className="text-sm text-muted">Loading your data...</p> : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          [Network, "Total referrals", toBn(stats.totalReferrals)],
          [Sparkles, "Current level", toBn(stats.currentLevel)],
          [WalletCards, "Total income", taka(stats.totalEarned)],
          [TrendingUp, "Pending commission", taka(stats.pendingCommission)],
        ].map(([Icon, label, value]) => {
          const TypedIcon = Icon as typeof Network;
          return (
            <Card key={String(label)} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">{String(label)}</p>
                  <p className="mt-2 text-3xl font-black text-gold-light">{String(value)}</p>
                </div>
                <TypedIcon className="text-gold" size={32} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold">Commission progress</h3>
            <span className="text-sm text-muted">Level {toBn(currentLevel?.level ?? 1)}</span>
          </div>
          <p className="mb-3 text-muted">
            {currentLevel
              ? `${toBn(currentLevel.current)} / ${toBn(currentLevel.required)} referrals`
              : "No commission levels available yet."}
          </p>
          <Progress value={progress} color="gold" />
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {levels.slice(0, 3).map((item) => (
              <div key={item.level} className="rounded-2xl border border-line bg-elevated p-4">
                <p className="text-sm text-muted">Level {toBn(item.level)}</p>
                <p className="mt-1 font-bold text-gold-light">
                  {toBn(item.current)} / {toBn(item.required)} referrals
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-2xl font-bold">Quick referral</h3>
          <p className="mt-2 text-sm leading-7 text-muted">
            Share this link. A user only appears in your network after they register with your referral code.
          </p>
          <div className="mt-4 break-all rounded-2xl border border-line bg-elevated p-4 text-sm text-gold-light">
            {link || "Referral link loading..."}
          </div>
          <Button className="mt-4 w-full" onClick={() => link && navigator.clipboard?.writeText(link)}>
            <Copy size={16} /> Copy
          </Button>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">Notifications</h3>
          <div className="space-y-3">
            {data?.notifications.length ? (
              data.notifications.map((item) => (
                <div key={item} className="rounded-2xl border border-line bg-elevated/80 px-4 py-3 text-sm text-muted">
                  {item}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No notifications yet.</p>
            )}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">Recent activity</h3>
          <div className="space-y-3">
            {data?.activities.length ? (
              data.activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-elevated/80 px-4 py-3">
                  <span className="text-sm">{activity.text}</span>
                  <span className="shrink-0 text-xs text-muted">{activity.time}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No activity yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
