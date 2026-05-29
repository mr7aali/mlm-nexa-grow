"use client";

import { Badge, Card, Progress } from "@/components/ui";
import { useGetCommissionsQuery } from "@/lib/api";
import { taka, toBn } from "@/lib/utils";

const tone = (status: string) =>
  status === "Paid" ? "green" : status === "In Progress" ? "blue" : status === "Unlocked" ? "gold" : "muted";

export default function CommissionsPage() {
  const { data, isLoading } = useGetCommissionsQuery();
  const levels = data?.levels ?? [];
  const history = data?.history ?? [];
  const currentLevel = data?.currentLevel ?? levels[0];
  const progress = currentLevel ? (currentLevel.current / currentLevel.required) * 100 : 0;
  const remaining = currentLevel ? Math.max(0, currentLevel.required - currentLevel.current) : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">Levels and payout</p>
        <h2 className="heading-gradient text-4xl font-black">Commission Tracker</h2>
      </div>

      {isLoading ? <p className="text-sm text-muted">Loading commission data...</p> : null}

      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <p className="text-muted">Total earned</p>
          <p className="mt-2 text-3xl font-black text-gold-light">{taka(data?.totalEarned ?? 0)}</p>
        </Card>
        <Card>
          <p className="text-muted">Possible plan income</p>
          <p className="mt-2 text-3xl font-black text-gold-light">{taka(data?.potential ?? 0)}</p>
        </Card>
        <Card>
          <p className="text-muted">Next milestone</p>
          <p className="mt-2 text-xl font-bold text-gold-light">
            {currentLevel ? `${toBn(remaining)} more referrals needed` : "No level configured"}
          </p>
        </Card>
      </div>

      {currentLevel ? (
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Level {toBn(currentLevel.level)}</h3>
              <p className="text-sm text-muted">
                Required {toBn(currentLevel.required)} referrals · current {toBn(currentLevel.current)}
              </p>
            </div>
            <Badge tone={tone(currentLevel.status) as "green" | "blue" | "gold" | "muted"}>
              {currentLevel.status}
            </Badge>
          </div>
          <Progress value={progress} color="gold" />
          <p className="mt-4 text-right font-bold text-gold-light">{taka(currentLevel.earning)}</p>
        </Card>
      ) : null}

      <Card className="p-6">
        <h3 className="mb-5 text-2xl font-bold">Commission history</h3>
        <div className="space-y-4">
          {history.length ? (
            history.map((item) => (
              <div key={item.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-line bg-elevated p-4 md:flex-row md:items-center">
                <div>
                  <p className="font-bold">{item.level}</p>
                  <p className="text-sm text-muted">{item.date}</p>
                </div>
                <p className="text-xl font-black text-gold-light">{taka(item.amount)}</p>
                <Badge tone={tone(item.status) as "green" | "blue" | "gold" | "muted"}>{item.status}</Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No commission history yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
