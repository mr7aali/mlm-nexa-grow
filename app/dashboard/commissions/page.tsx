"use client";

import { Badge, Card, Progress } from "@/components/ui";
import { useGetCommissionsQuery } from "@/lib/api";
import { taka, toBn } from "@/lib/utils";

const tone = (status: string) =>
  status === "Paid"
    ? "green"
    : status === "In Progress"
      ? "blue"
      : status === "Unlocked"
        ? "gold"
        : "muted";

const statusLabel = (status: string) =>
  status === "Paid"
    ? "পেইড"
    : status === "In Progress"
      ? "চলমান"
      : status === "Unlocked"
        ? "আনলক"
        : "লকড";

export default function CommissionsPage() {
  const { data, isLoading } = useGetCommissionsQuery();
  const levels = data?.levels ?? [];
  const history = data?.history ?? [];
  const currentLevel = data?.currentLevel ?? levels[0];
  const progress = currentLevel
    ? (currentLevel.current / currentLevel.required) * 100
    : 0;
  const remaining = currentLevel
    ? Math.max(0, currentLevel.required - currentLevel.current)
    : 0;
  const purchaseCount = data?.productPurchases ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">
          পণ্য ক্রয় ভিত্তিক লেভেল ও পেআউট
        </p>
        <h2 className="heading-gradient text-4xl font-black">
          কমিশন ট্র্যাকার
        </h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">কমিশন ডেটা লোড হচ্ছে...</p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-muted">যোগ্য পণ্য ক্রয়</p>
          <p className="mt-2 text-3xl font-black text-gold-light">
            {toBn(purchaseCount)}
          </p>
        </Card>
        <Card>
          <p className="text-muted">মোট অর্জিত</p>
          <p className="mt-2 text-3xl font-black text-gold-light">
            {taka(data?.totalEarned ?? 0)}
          </p>
        </Card>
        <Card>
          <p className="text-muted">সম্ভাব্য মোট আয়</p>
          <p className="mt-2 text-3xl font-black text-gold-light">
            {taka(data?.potential ?? 0)}
          </p>
        </Card>
        <Card>
          <p className="text-muted">পরবর্তী মাইলস্টোন</p>
          <p className="mt-2 text-xl font-bold text-gold-light">
            {currentLevel
              ? `আর ${toBn(remaining)} পণ্য ক্রয় হলে পরবর্তী ধাপ আনলক হবে`
              : "লেভেল সেট করা হয়নি"}
          </p>
        </Card>
      </div>

      {currentLevel ? (
        <div className="grid gap-5">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  ধাপ {toBn(currentLevel.level)}
                </h3>
                <p className="text-sm text-muted">
                  প্রয়োজন {toBn(currentLevel.required)} পণ্য ক্রয় · বর্তমান{" "}
                  {toBn(currentLevel.current)}
                </p>
              </div>
              <Badge
                tone={
                  tone(currentLevel.status) as
                    | "green"
                    | "blue"
                    | "gold"
                    | "muted"
                }
              >
                {statusLabel(currentLevel.status)}
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
            <p className="mt-4 text-right font-bold text-gold-light">
              {taka(currentLevel.earning)}
            </p>
          </Card>
        </div>
      ) : null}

      {/* <Card className="p-6">
        <h3 className="mb-5 text-2xl font-bold">পণ্য ক্রয় কমিশন ধাপ</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {levels.map((item) => (
            <div key={item.level} className="rounded-2xl border border-line bg-elevated p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold">ধাপ {toBn(item.level)}</p>
                <Badge tone={tone(item.status) as "green" | "blue" | "gold" | "muted"}>{statusLabel(item.status)}</Badge>
              </div>
              <p className="mt-3 text-sm text-muted">{toBn(item.current)} / {toBn(item.required)} পণ্য ক্রয়</p>
              <p className="mt-2 text-xl font-black text-gold-light">{taka(item.earning)}</p>
            </div>
          ))}
        </div>
      </Card> */}

      <Card className="p-6">
        <h3 className="mb-5 text-2xl font-bold">কমিশন ইতিহাস</h3>
        <div className="space-y-4">
          {history.length ? (
            history.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-line bg-elevated p-4 md:flex-row md:items-center"
              >
                <div>
                  <p className="font-bold">{item.level}</p>
                  <p className="text-sm text-muted">{item.date}</p>
                </div>
                <p className="text-xl font-black text-gold-light">
                  {taka(item.amount)}
                </p>
                <Badge
                  tone={
                    tone(item.status) as "green" | "blue" | "gold" | "muted"
                  }
                >
                  {statusLabel(item.status)}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">কমিশন ইতিহাস নেই।</p>
          )}
        </div>
      </Card>
    </div>
  );
}
