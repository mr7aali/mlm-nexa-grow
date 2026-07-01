"use client";

import { useMemo, useState } from "react";
import {
  Coins,
  Download,
  Search,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button, Card, Input, Select } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { useGetAdminGenerationCoinsQuery } from "@/lib/api";
import { taka, toBn } from "@/lib/utils";

const pageSize = 12;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function SuperAdminGenerationCoinsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [coinStatus, setCoinStatus] = useState("with-coins");
  const [message, setMessage] = useState("");
  const query = useMemo(
    () => ({
      page,
      limit: pageSize,
      search: search.trim() || undefined,
      coinStatus: coinStatus || undefined,
    }),
    [coinStatus, page, search],
  );
  const { data, isLoading, error } = useGetAdminGenerationCoinsQuery(query);
  const users = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const summary = data?.summary ?? {
    totalCoins: 0,
    averageCoins: 0,
    usersWithCoins: 0,
    maxCoins: 0,
  };

  function handleExportPdf() {
    const rows = users.length
      ? users
          .map(
            (user, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(user.id)}</td>
                <td>${escapeHtml(user.name)}</td>
                <td>${escapeHtml(user.email)}</td>
                <td>${escapeHtml(user.phone)}</td>
                <td>${escapeHtml(user.referralCode)}</td>
                <td>${user.generationCoins.toLocaleString()}</td>
                <td>${escapeHtml(taka(user.earned))}</td>
                <td>${escapeHtml(formatDate(user.joined))}</td>
              </tr>
            `,
          )
          .join("")
      : `<tr><td colspan="9">No generation coin users found.</td></tr>`;
    const printWindow = window.open("", "_blank", "width=1120,height=820");
    if (!printWindow) {
      setMessage("Allow popup windows to export the PDF.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Generation Coins Report</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111; margin: 32px; }
            h1 { margin: 0 0 4px; font-size: 24px; }
            .muted { color: #666; font-size: 12px; }
            .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0; }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
            .label { color: #666; font-size: 12px; margin-bottom: 6px; }
            .value { font-size: 18px; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Generation Coins Report</h1>
          <p class="muted">Generated: ${new Date().toLocaleString()}</p>
          <div class="summary">
            <div class="card"><div class="label">Total coins</div><div class="value">${summary.totalCoins.toLocaleString()}</div></div>
            <div class="card"><div class="label">Users with coins</div><div class="value">${summary.usersWithCoins.toLocaleString()}</div></div>
            <div class="card"><div class="label">Average coins</div><div class="value">${summary.averageCoins.toLocaleString()}</div></div>
            <div class="card"><div class="label">Highest coins</div><div class="value">${summary.maxCoins.toLocaleString()}</div></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Referral Code</th>
                <th>Current Coins</th>
                <th>Total Earned</th>
                <th>Join Date</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-gold-light">Super admin</p>
          <h2 className="heading-gradient text-3xl font-black md:text-4xl">
            Generation Coins
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            See every user&apos;s current generation points and who currently has
            purchase coins in the system.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleExportPdf}
          disabled={isLoading || !users.length}
        >
          <Download size={16} />
          Export PDF
        </Button>
      </div>

      {message ? (
        <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-2xl border border-foreground/20 bg-foreground/5 px-4 py-3 text-sm text-foreground">
          {getApiErrorMessage(error, "Generation coins load failed.")}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Card className="p-4">
          <Metric icon={Coins} label="Total coins" value={toBn(summary.totalCoins)} />
        </Card>
        <Card className="p-4">
          <Metric icon={Users} label="Users with coins" value={toBn(summary.usersWithCoins)} />
        </Card>
        <Card className="p-4">
          <Metric icon={TrendingUp} label="Average coins" value={toBn(summary.averageCoins)} />
        </Card>
        <Card className="p-4">
          <Metric icon={Trophy} label="Highest coins" value={toBn(summary.maxCoins)} />
        </Card>
      </div>

      <Card className="p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              size={16}
            />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search name, email, phone, referral code, or user ID"
              className="pl-10"
            />
          </div>
          <Select
            value={coinStatus}
            onChange={(event) => {
              setCoinStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All coin status</option>
            <option value="with-coins">Only with coins</option>
            <option value="no-coins">No coins</option>
          </Select>
        </div>
      </Card>

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <table className="w-full min-w-[1060px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>
              {[
                "User",
                "Referral code",
                "Current coins",
                "Total earned",
                "Join date",
                "User ID",
              ].map((head) => (
                <th key={head} className="px-5 py-4">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user) => (
                <tr key={user.id} className="border-t border-line align-top">
                  <td className="px-5 py-4">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                    <p className="text-xs text-muted">{user.phone}</p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gold-light">
                    {user.referralCode}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-gold/10 px-3 py-1 text-sm font-black text-gold-light">
                      {toBn(user.generationCoins)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gold-light">
                    {taka(user.earned)}
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {formatDate(user.joined)}
                  </td>
                  <td className="break-all px-5 py-4 text-xs text-muted">
                    {user.id}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-10 text-center text-muted" colSpan={6}>
                  {isLoading
                    ? "Loading generation coin users..."
                    : "No users found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Page {toBn(data?.page ?? page)} / {toBn(totalPages)}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((old) => Math.max(1, old - 1))}
          >
            Previous
          </Button>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage((old) => Math.min(totalPages, old + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-semibold text-muted">{label}</p>
        <Icon size={18} className="shrink-0 text-gold-light" />
      </div>
      <p className="mt-2 truncate text-2xl font-black text-gold-light">
        {value}
      </p>
    </div>
  );
}
