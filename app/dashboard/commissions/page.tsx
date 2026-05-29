"use client";

import { Badge, Card, Progress } from "@/components/ui";
import { commissionHistory, commissionLevels } from "@/lib/mock-data";
import { useGetCommissionsQuery } from "@/lib/api";
import { taka, toBn } from "@/lib/utils";

const tone = (status: string) => status === "Paid" ? "green" : status === "In Progress" ? "blue" : status === "Unlocked" ? "gold" : "muted";

export default function CommissionsPage() {
  const { data } = useGetCommissionsQuery();
  const levels = data?.levels ?? commissionLevels;
  const history = data?.history ?? commissionHistory;
  const totalEarned = data?.totalEarned ?? levels.filter((item) => item.status === "Paid").reduce((sum, item) => sum + item.earning, 0);
  const potential = data?.potential ?? levels.reduce((sum, item) => sum + item.earning, 0);
  const currentLevel = data?.currentLevel ?? levels.find((item) => item.status === "In Progress") ?? levels[0];
  const progress = (currentLevel.current / currentLevel.required) * 100;
  const remaining = Math.max(0, currentLevel.required - currentLevel.current);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">লেভেল ও পেআউট</p>
        <h2 className="heading-gradient text-4xl font-black">কমিশন ট্র্যাকার</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card><p className="text-muted">মোট অর্জিত</p><p className="mt-2 text-3xl font-black text-gold-light">{taka(totalEarned)}</p></Card>
        <Card><p className="text-muted">সম্ভাব্য মোট আয়</p><p className="mt-2 text-3xl font-black text-gold-light">{taka(potential)}</p></Card>
        <Card><p className="text-muted">পরবর্তী মাইলস্টোন</p><p className="mt-2 text-xl font-bold text-gold-light">আর {toBn(remaining)} জন রেফার করলে পরবর্তী ধাপ আনলক হবে</p></Card>
      </div>

      <div className="grid gap-5">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">লেভেল {toBn(currentLevel.level)}</h3>
              <p className="text-sm text-muted">প্রয়োজন {toBn(currentLevel.required)} আইডি · বর্তমান {toBn(currentLevel.current)}</p>
            </div>
            <Badge tone={tone(currentLevel.status) as "green" | "blue" | "gold" | "muted"}>
              {currentLevel.status === "Paid" ? "পেইড" : currentLevel.status === "In Progress" ? "চলমান" : currentLevel.status === "Unlocked" ? "আনলক" : "লকড"}
            </Badge>
          </div>
          <Progress
            value={progress}
            color={
              currentLevel.color === "emerald"
                ? "green"
                : currentLevel.color === "sky"
                  ? "blue"
                  : currentLevel.color === "violet"
                    ? "purple"
                    : currentLevel.color === "rose"
                      ? "red"
                      : currentLevel.color === "amber"
                        ? "amber"
                        : "gold"
            }
          />
          <p className="mt-4 text-right font-bold text-gold-light">{taka(currentLevel.earning)}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-5 text-2xl font-bold">কমিশন ইতিহাস</h3>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-line bg-elevated p-4 md:flex-row md:items-center">
              <div>
                <p className="font-bold">{item.level}</p>
                <p className="text-sm text-muted">{item.date}</p>
              </div>
              <p className="text-xl font-black text-gold-light">{taka(item.amount)}</p>
              <Badge tone={tone(item.status) as "green" | "blue" | "gold" | "muted"}>{item.status === "Paid" ? "পেইড" : item.status === "In Progress" ? "চলমান" : "আনলক"}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
