"use client";

import { Coins, WalletCards } from "lucide-react";
import type { ReactNode } from "react";
import { Badge, Card, Progress } from "@/components/ui";
import { useGetCommissionsQuery } from "@/lib/api";
import type {
  CommissionHistoryItem,
  CommissionLevel,
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-elevated p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-black text-gold-light">{value}</p>
    </div>
  );
}

function SummaryMetric({
  shortLabel,
  label,
  value,
}: {
  shortLabel: string;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-md border border-line bg-elevated px-2 py-2 sm:rounded-lg sm:p-4">
      <p className="truncate text-[10px] font-semibold leading-tight text-muted sm:text-sm sm:font-normal">
        <span className="sm:hidden">{shortLabel}</span>
        <span className="hidden sm:inline">{label}</span>
      </p>
      <p className="mt-1 truncate text-xs font-black leading-tight text-gold-light sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function ProgressRows({
  rows,
}: {
  rows: CommissionLevel[];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((item) => {
        const progress = item.required
          ? (item.current / item.required) * 100
          : 0;

        return (
          <div
            key={`${item.level}-${"cycle" in item ? (item.cycle ?? 1) : 1}`}
            className="rounded-lg border border-line bg-background/60 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">
                  Step {toBn(item.level)}
                </p>
                {item.cycle ? (
                  <p className="mt-1 text-xs font-semibold text-gold-light">
                    ID {toBn(item.cycle)}
                  </p>
                ) : null}
                {/* <p className="mt-1 text-sm text-muted">
                  {toBn(item.current)} / {toBn(item.required)}{" "}
                  {type === "coins" ? "coins" : "nodes"}
                </p> */}
              </div>
              <Badge
                tone={tone(item.status) as "green" | "blue" | "gold" | "muted"}
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
                      tone(item.status) as "green" | "blue" | "gold" | "muted"
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
  const productPair = data?.productPairIncome ?? {
    totalEarned: 0,
    dailyCap: 5000,
    pairSize: 2,
    pairReward: 50,
    history: [],
  };
  const currentGeneration = generation.currentLevel ?? generation.levels[0];
  const currentGenerationProgress = currentGeneration
    ? (currentGeneration.current / currentGeneration.required) * 100
    : 0;

  return (
    <div className="space-y-3 md:space-y-6">
      <div>
        <p className="text-sm font-semibold text-gold-light">
          Commission rewards
        </p>
        <h2 className="heading-gradient text-2xl font-black md:text-4xl">
          Commission Dashboard
        </h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Commission data is loading...</p>
      ) : null}

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3 xl:grid-cols-3 xl:gap-4">
        <SummaryMetric
          shortLabel="Pair"
          label="Product pair"
          value={taka(productPair.totalEarned)}
        />
        <SummaryMetric
          shortLabel="Gen"
          label="Generation income"
          value={taka(generation.totalEarned)}
        />
        <SummaryMetric
          shortLabel="Coins"
          label="Generation coins"
          value={toBn(generation.coins)}
        />
      </div>

      <Card className="space-y-4 !p-3 sm:space-y-6 sm:!p-5">
          <SectionTitle
            icon={<Coins size={21} />}
            eyebrow="Global purchase coins"
            title="Generation income / commission"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Metric label="Current coins" value={toBn(generation.coins)} />
            <Metric label="Total earned" value={taka(generation.totalEarned)} />
            {/* <Metric
              label="Current target value"
              value={taka(generation.potential)}
            /> */}
          </div>

          {currentGeneration ? (
            <div className="rounded-lg border border-line bg-elevated p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold">
                    Current step {toBn(currentGeneration.level)}
                    {currentGeneration.cycle
                      ? ` / ID ${toBn(currentGeneration.cycle)}`
                      : ""}
                  </p>
                  {/* <p className="text-sm text-muted">
                    {toBn(currentGeneration.current)} /{" "}
                    {toBn(currentGeneration.required)} coins
                  </p> */}
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

          {/* <div className="rounded-lg border border-line bg-elevated p-4">
          <div className="flex items-center gap-2 text-muted">
            <WalletCards size={18} />
            <span className="text-sm">Generation rule</span>
          </div>
          <p className="mt-2 leading-7 text-foreground">
            Every successful product purchase adds 1 coin to every eligible
            existing user. Generation rewards repeat by user number: Step 1 pays
            at 6, 12, 18 coins; Step 2 pays at 36, 72, 108 coins; and the same
            multiplier continues through Step 6.
          </p>
        </div> */}

          <div className="rounded-lg border border-line bg-elevated p-4">
            <div className="flex items-center gap-2 text-muted">
              <WalletCards size={18} />
              <span className="text-sm">Product pair commission rule</span>
            </div>
            <p className="mt-2 leading-7 text-foreground">
              For each {toBn(productPair.pairSize)} successful paid product
              purchases in one business day using your referral code, you
              receive {taka(productPair.pairReward)}. Maximum product pair
              commission per day is {taka(productPair.dailyCap)}.
            </p>
          </div>

          <ProgressRows rows={generation.levels} />

          <HistoryList
            title="Product pair commission history"
            rows={productPair.history}
            empty="No product pair commission has been paid yet."
          />

          <HistoryList
            title="Generation commission history"
            rows={generation.history}
            empty="No generation commission has been paid yet."
          />
      </Card>
    </div>
  );
}
