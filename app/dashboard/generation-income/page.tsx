"use client";

import { Coins, Network, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui";
import { useGetCommissionsQuery, useGetWingsQuery } from "@/lib/api";
import type { TreeNode } from "@/lib/api-types";
import { useI18n } from "@/lib/i18n";
import { toBn } from "@/lib/utils";

const teamLevels = [1, 2, 3, 4, 5, 6];

function countNodesAtLevel(node: TreeNode | null, level: number): number {
  if (!node) return 0;
  return (
    (node.level === level ? 1 : 0) +
    countNodesAtLevel(node.left, level) +
    countNodesAtLevel(node.right, level)
  );
}

export default function GenerationIncomePage() {
  const { language } = useI18n();
  const { data: commissions, isLoading: commissionsLoading } =
    useGetCommissionsQuery();
  const { data: wings, isLoading: wingsLoading } = useGetWingsQuery();
  const t = {
    eyebrow: language === "bn" ? "টিম ইনফো" : "Team info",
    title:
      language === "bn"
        ? "টিম ইনফো"
        : "Team info",
    description:
      language === "bn"
        ? "আপনার লেফট উইং, রাইট উইং, মোট উইং এবং লেভেলভিত্তিক টিম কাউন্ট দেখুন।"
        : "View your left wing, right wing, total wing count, and team count by level.",
    loading: language === "bn" ? "ডাটা লোড হচ্ছে..." : "Loading data...",
    leftWing: language === "bn" ? "লেফট উইং" : "Left wing",
    rightWing: language === "bn" ? "রাইট উইং" : "Right wing",
    totalWings: language === "bn" ? "মোট উইং" : "Total wings",
    currentCoins: language === "bn" ? "বর্তমান কয়েন" : "Current coins",
    networkVisualization:
      language === "bn" ? "টিম ভিজুয়ালাইজেশন" : "Team visualization",
    generationLevels:
      language === "bn" ? "লেভেলভিত্তিক টিম ইনফো" : "Team level information",
    level: language === "bn" ? "লেভেল" : "Level",
    levelHelp:
      language === "bn"
        ? "প্রতি লেভেলে আপনার লেফট, রাইট এবং মোট টিম সদস্য সংখ্যা।"
        : "Left, right, and total team member count for each level.",
  };
  const n = (value: number) => (language === "bn" ? toBn(value) : String(value));
  const generation = commissions?.generationIncome ?? {
    coins: commissions?.productPurchases ?? 0,
    totalEarned: commissions?.totalEarned ?? 0,
    potential: commissions?.potential ?? 0,
    currentLevel: commissions?.currentLevel,
    history: commissions?.history ?? [],
    levels: commissions?.levels ?? [],
  };
  const leftWing = wings?.summary.leftWing ?? 0;
  const rightWing = wings?.summary.rightWing ?? 0;
  const totalWings = wings?.summary.totalNetwork ?? leftWing + rightWing;
  const levelRows = teamLevels.map((level) => {
    const leftCount = countNodesAtLevel(wings?.tree.left ?? null, level);
    const rightCount = countNodesAtLevel(wings?.tree.right ?? null, level);
    const totalCount = leftCount + rightCount;

    return {
      level,
      leftCount,
      rightCount,
      totalCount,
    };
  });

  return (
    <div className="space-y-6" data-no-translate>
      <header>
        <p className="text-sm font-semibold text-gold-light">{t.eyebrow}</p>
        <h2 className="heading-gradient text-2xl font-black md:text-4xl">
          {t.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          {t.description}
        </p>
      </header>

      {commissionsLoading || wingsLoading ? (
        <p className="text-sm font-semibold text-muted">{t.loading}</p>
      ) : null}

      <section className="grid gap-3 md:grid-cols-4">
        <Metric icon={Coins} label={t.currentCoins} value={n(generation.coins)} />
        <Metric icon={Users} label={t.leftWing} value={n(leftWing)} />
        <Metric icon={Users} label={t.rightWing} value={n(rightWing)} />
        <Metric icon={Network} label={t.totalWings} value={n(totalWings)} />
      </section>

      <Card className="p-4 md:p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gold/10 text-gold">
            <Network size={19} />
          </div>
          <h3 className="text-xl font-black text-foreground">
            {t.networkVisualization}
          </h3>
        </div>
        <div className="space-y-3">
          <WingBar label={t.leftWing} value={leftWing} max={Math.max(totalWings, 1)} n={n} />
          <WingBar label={t.rightWing} value={rightWing} max={Math.max(totalWings, 1)} n={n} />
          <WingBar label={t.totalWings} value={totalWings} max={Math.max(totalWings, 1)} n={n} />
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-line px-4 py-4 md:px-5">
          <h3 className="text-xl font-black text-foreground">
            {t.generationLevels}
          </h3>
          <p className="mt-1 text-sm text-muted">{t.levelHelp}</p>
        </div>
        <div className="scrollbar-soft overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[90px_1fr_1fr_1fr] border-b border-line bg-elevated px-4 py-3 text-xs font-black uppercase tracking-wide text-muted">
              <span>{t.level}</span>
              <span>{t.leftWing}</span>
              <span>{t.rightWing}</span>
              <span className="text-right">{t.totalWings}</span>
            </div>
            <div className="divide-y divide-line">
              {levelRows.map((item) => (
                <div
                  key={item.level}
                  className="grid grid-cols-[90px_1fr_1fr_1fr] items-center gap-2 px-4 py-4 text-sm"
                >
                  <div className="flex items-center gap-2 font-black text-foreground">
                    <Trophy size={16} className="text-gold" />
                    {n(item.level)}
                  </div>
                  <div className="font-semibold text-foreground">
                    {n(item.leftCount)}
                  </div>
                  <div className="font-semibold text-foreground">
                    {n(item.rightCount)}
                  </div>
                  <div className="text-right font-black text-gold-light">
                    {n(item.totalCount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Coins;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-24 items-center gap-3 border border-line bg-white px-4 py-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted">{label}</p>
        <p className="mt-1 truncate text-2xl font-black text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

function WingBar({
  label,
  value,
  max,
  n,
}: {
  label: string;
  value: number;
  max: number;
  n: (value: number) => string;
}) {
  const width = Math.max(3, Math.min(100, (value / max) * 100));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="font-black text-gold">{n(value)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full bg-gold transition-[width]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
