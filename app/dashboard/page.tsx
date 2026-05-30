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
          <p className="text-sm text-gold-light">সদস্য প্যানেল</p>
          <h2 className="heading-gradient text-4xl font-black">ড্যাশবোর্ড</h2>
        </div>
        <CopyButton value={link} label="রেফার লিংক কপি" />
      </div>

      {isLoading ? <p className="text-sm text-muted">ডেটা লোড হচ্ছে...</p> : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          [Network, "মোট রেফারেল", toBn(stats.totalReferrals)],
          [Sparkles, "বর্তমান লেভেল", toBn(stats.currentLevel)],
          [WalletCards, "মোট আয়", taka(stats.totalEarned)],
          [TrendingUp, "পেন্ডিং কমিশন", taka(stats.pendingCommission)],
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
            <h3 className="text-2xl font-bold">কমিশন অগ্রগতি</h3>
            <span className="text-sm text-muted">লেভেল {toBn(currentLevel?.level ?? 1)}</span>
          </div>
          <p className="mb-3 text-muted">
            {currentLevel
              ? `${toBn(currentLevel.required)} এর মধ্যে ${toBn(currentLevel.current)} আইডি হয়েছে`
              : "কমিশন লেভেল এখনো পাওয়া যায়নি"}
          </p>
          <Progress value={progress} color="gold" />
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {levels.slice(0, 3).map((item) => (
              <div key={item.level} className="rounded-2xl border border-line bg-elevated p-4">
                <p className="text-sm text-muted">লেভেল {toBn(item.level)}</p>
                <p className="mt-1 font-bold text-gold-light">{toBn(item.current)} / {toBn(item.required)} আইডি</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-2xl font-bold">দ্রুত রেফার</h3>
          <p className="mt-2 text-sm leading-7 text-muted">এই রেফারেল লিংক কপি করে নতুন সদস্যকে রেজিস্ট্রেশন পেজে আমন্ত্রণ জানাতে পারবেন।</p>
          <div className="mt-4 break-all rounded-2xl border border-line bg-elevated p-4 text-sm text-gold-light">{link || "রেফার লিংক লোড হচ্ছে..."}</div>
          <Button className="mt-4 w-full" onClick={() => link && navigator.clipboard?.writeText(link)}>
            <Copy size={16} /> এক ক্লিকে কপি
          </Button>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">নোটিফিকেশন</h3>
          <div className="space-y-3">
            {data?.notifications.length ? (
              data.notifications.map((item) => (
                <div key={item} className="rounded-2xl border border-line bg-elevated/80 px-4 py-3 text-sm text-muted">{item}</div>
              ))
            ) : (
              <div className="rounded-2xl border border-line bg-elevated/80 px-4 py-3 text-sm text-muted">কোনো নোটিফিকেশন নেই</div>
            )}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">সাম্প্রতিক কার্যক্রম</h3>
          <div className="space-y-3">
            {data?.activities.length ? (
              data.activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-elevated/80 px-4 py-3">
                  <span className="text-sm">{activity.text}</span>
                  <span className="shrink-0 text-xs text-muted">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-line bg-elevated/80 px-4 py-3 text-sm text-muted">কোনো কার্যক্রম নেই</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
