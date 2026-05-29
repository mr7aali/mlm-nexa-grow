"use client";

import { Copy, Network, Sparkles, TrendingUp, WalletCards } from "lucide-react";
import { Button, Card, CopyButton, Progress } from "@/components/ui";
import { activities, commissionLevels, notifications } from "@/lib/mock-data";
import { useGetDashboardQuery } from "@/lib/api";
import { referralLink, taka, toBn } from "@/lib/utils";

export default function DashboardPage() {
  const { data } = useGetDashboardQuery();
  const link = data?.referralLink ?? referralLink();
  const levels = data?.commissionLevels ?? commissionLevels;
  const activityItems = data?.activities ?? activities;
  const notificationItems = data?.notifications ?? notifications;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-gold-light">ডেমো সদস্য প্যানেল</p>
          <h2 className="heading-gradient text-4xl font-black">ড্যাশবোর্ড</h2>
        </div>
        <CopyButton value={link} label="রেফার লিংক কপি" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          [Network, "মোট রেফারেল", "১৮"],
          [Sparkles, "বর্তমান লেভেল", "২"],
          [WalletCards, "মোট আয়", taka(800)],
          [TrendingUp, "পেন্ডিং কমিশন", taka(600)],
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
            <span className="text-sm text-muted">লেভেল {toBn(2)}</span>
          </div>
          <p className="mb-3 text-muted">৩৬ এর মধ্যে ১৮ আইডি হয়েছে — ৫০% সম্পন্ন</p>
          <Progress value={50} color="gold" />
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
          <div className="mt-4 break-all rounded-2xl border border-line bg-elevated p-4 text-sm text-gold-light">{link}</div>
          <Button className="mt-4 w-full" onClick={() => navigator.clipboard?.writeText(link)}>
            <Copy size={16} /> এক ক্লিকে কপি
          </Button>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">নোটিফিকেশন</h3>
          <div className="space-y-3">
            {notificationItems.map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-elevated/80 px-4 py-3 text-sm text-muted">{item}</div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">সাম্প্রতিক কার্যক্রম</h3>
          <div className="space-y-3">
            {activityItems.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-elevated/80 px-4 py-3">
                <span className="text-sm">{activity.text}</span>
                <span className="shrink-0 text-xs text-muted">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
