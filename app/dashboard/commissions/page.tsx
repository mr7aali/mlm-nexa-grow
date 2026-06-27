"use client";

import { Coins, GitFork, Trophy, WalletCards } from "lucide-react";
import type { ReactNode } from "react";
import { Badge, Card, Progress } from "@/components/ui";
import { useGetCommissionsQuery } from "@/lib/api";
import type {
  CommissionHistoryItem,
  CommissionLevel,
  WingCommissionLevel,
} from "@/lib/api-types";
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
    ? "Paid"
    : status === "In Progress"
      ? "Running"
      : status === "Unlocked"
        ? "Unlocked"
        : "Locked";

function SectionTitle({
  icon,
  eyebrow,
  title,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-light">
          {eyebrow}
        </p>
        <h3 className="text-xl font-black text-foreground md:text-2xl">
          {title}
        </h3>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-elevated p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-black text-gold-light">{value}</p>
    </div>
  );
}

function ProgressRows({
  rows,
  type,
}: {
  rows: Array<CommissionLevel | WingCommissionLevel>;
  type: "coins" | "nodes";
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((item) => {
        const progress = item.required
          ? (item.current / item.required) * 100
          : 0;

        return (
          <div
            key={item.level}
            className="rounded-lg border border-line bg-background/60 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">Level {toBn(item.level)}</p>
                <p className="mt-1 text-sm text-muted">
                  {toBn(item.current)} / {toBn(item.required)}{" "}
                  {type === "coins" ? "coins" : "nodes"}
                </p>
              </div>
              <Badge
                tone={
                  tone(item.status) as "green" | "blue" | "gold" | "muted"
                }
              >
                {statusLabel(item.status)}
              </Badge>
            </div>
            <div className="mt-4">
              <Progress value={progress} color="gold" />
            </div>
            <p className="mt-3 text-lg font-black text-gold-light">
              {taka(item.earning)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function HistoryList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: CommissionHistoryItem[];
  empty: string;
}) {
  return (
    <div>
      <h4 className="mb-3 text-base font-bold text-foreground">{title}</h4>
      <div className="space-y-3">
        {rows.length ? (
          rows
            .slice()
            .reverse()
            .map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-lg border border-line bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold">{item.level}</p>
                  <p className="text-sm text-muted">{item.date}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <p className="text-lg font-black text-gold-light">
                    {taka(item.amount)}
                  </p>
                  <Badge
                    tone={
                      tone(item.status) as
                        | "green"
                        | "blue"
                        | "gold"
                        | "muted"
                    }
                  >
                    {statusLabel(item.status)}
                  </Badge>
                </div>
              </div>
            ))
        ) : (
          <p className="rounded-lg border border-dashed border-line p-4 text-sm text-muted">
            {empty}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CommissionsPage() {
  const { data, isLoading } = useGetCommissionsQuery();
  const generation = data?.generationIncome ?? {
    coins: data?.productPurchases ?? 0,
    totalEarned: data?.totalEarned ?? 0,
    potential: data?.potential ?? 0,
    currentLevel: data?.currentLevel,
    history: data?.history ?? [],
    levels: data?.levels ?? [],
  };
  const wings = data?.wingsIncome ?? {
    totalEarned: 0,
    dailyCap: 5000,
    paidToday: 0,
    remainingToday: 5000,
    completedLevels: 0,
    nextReward: 50,
    history: [],
    levels: [],
  };
  const currentGeneration = generation.currentLevel ?? generation.levels[0];
  const currentGenerationProgress = currentGeneration
    ? (currentGeneration.current / currentGeneration.required) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-gold-light">
          Binary wings and generation rewards
        </p>
        <h2 className="heading-gradient text-3xl font-black md:text-4xl">
          Commission Dashboard
        </h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Commission data is loading...</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Wings income" value={taka(wings.totalEarned)} />
        <Metric label="Paid today" value={taka(wings.paidToday)} />
        <Metric label="Generation income" value={taka(generation.totalEarned)} />
        <Metric label="Generation coins" value={toBn(generation.coins)} />
      </div>

      <Card className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <SectionTitle
            icon={<GitFork size={21} />}
            eyebrow="Binary tree"
            title="Wings income / commission"
          />
          <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-80">
            <Metric label="Daily cap" value={taka(wings.dailyCap)} />
            <Metric label="Remaining today" value={taka(wings.remainingToday)} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-line bg-elevated p-4">
            <div className="flex items-center gap-2 text-muted">
              <Trophy size={18} />
              <span className="text-sm">Completed binary levels</span>
            </div>
            <p className="mt-2 text-3xl font-black text-gold-light">
              {toBn(wings.completedLevels)}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-elevated p-4 md:col-span-2">
            <p className="text-sm text-muted">Rule</p>
            <p className="mt-2 leading-7 text-foreground">
              Level 1 pays {taka(50)}, level 2 pays {taka(100)}, level 3 pays{" "}
              {taka(200)} and continues by doubling. Maximum wings payout per
              day is {taka(wings.dailyCap)}.
            </p>
          </div>
        </div>

        <ProgressRows rows={wings.levels} type="nodes" />

        <HistoryList
          title="Wings commission history"
          rows={wings.history}
          empty="No wings commission has been paid yet."
        />
      </Card>

      <Card className="space-y-6">
        <SectionTitle
          icon={<Coins size={21} />}
          eyebrow="Global purchase coins"
          title="Generation income / commission"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Current coins" value={toBn(generation.coins)} />
          <Metric label="Total earned" value={taka(generation.totalEarned)} />
          <Metric label="Total plan value" value={taka(generation.potential)} />
        </div>

        {currentGeneration ? (
          <div className="rounded-lg border border-line bg-elevated p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold">
                  Current step {toBn(currentGeneration.level)}
                </p>
                <p className="text-sm text-muted">
                  {toBn(currentGeneration.current)} /{" "}
                  {toBn(currentGeneration.required)} coins
                </p>
              </div>
              <Badge
                tone={
                  tone(currentGeneration.status) as
                    | "green"
                    | "blue"
                    | "gold"
                    | "muted"
                }
              >
                {statusLabel(currentGeneration.status)}
              </Badge>
            </div>
            <Progress value={currentGenerationProgress} color="gold" />
          </div>
        ) : null}

        <div className="rounded-lg border border-line bg-elevated p-4">
          <div className="flex items-center gap-2 text-muted">
            <WalletCards size={18} />
            <span className="text-sm">Generation rule</span>
          </div>
          <p className="mt-2 leading-7 text-foreground">
            Every successful product purchase adds 1 coin to every user. Rewards
            are paid at Step 1 to Step 6 only; after Step 6 no more generation
            commission is paid.
          </p>
        </div>

        <ProgressRows rows={generation.levels} type="coins" />

        <HistoryList
          title="Generation commission history"
          rows={generation.history}
          empty="No generation commission has been paid yet."
        />
      </Card>
    </div>
  );
}
