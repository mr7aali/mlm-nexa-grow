"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  CalendarDays,
  Download,
  GitFork,
  Gift,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button, Card, Input, Select } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { useGetAdminCommissionExpensesQuery } from "@/lib/api";
import type { AdminCommissionExpense } from "@/lib/api-types";
import { taka, toBn } from "@/lib/utils";

const pageSize = 12;
const currentYear = new Date().getFullYear();

function formatDate(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function typeTone(type: AdminCommissionExpense["type"]) {
  if (type === "Referral Bonus") return "bg-emerald-50 text-emerald-700";
  if (type === "Product Pair Commission") return "bg-fuchsia-50 text-fuchsia-700";
  if (type === "Generation Income") return "bg-sky-50 text-sky-700";
  if (type === "Wings Income") return "bg-amber-50 text-amber-700";
  return "bg-elevated text-muted";
}

export default function SuperAdminCommissionExpensesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("Paid");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(String(currentYear));
  const [message, setMessage] = useState("");
  const query = useMemo(
    () => ({
      page,
      limit: pageSize,
      search: search.trim() || undefined,
      type: type || undefined,
      status: status || undefined,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
    }),
    [month, page, search, status, type, year],
  );
  const { data, isLoading, error } = useGetAdminCommissionExpensesQuery(query);
  const expenses = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const summary = data?.summary ?? {
    totalAmount: 0,
    totalCount: 0,
    referralTotal: 0,
    productPairTotal: 0,
    generationTotal: 0,
    wingsTotal: 0,
  };

  function handleExportPdf() {
    const period = month
      ? `${new Date(0, Number(month) - 1).toLocaleString("en", { month: "long" })} ${year}`
      : `All months, ${year || "all years"}`;
    const rows = expenses
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.id)}</td>
            <td>${escapeHtml(formatDate(item.date))}</td>
            <td>${escapeHtml(item.type)}</td>
            <td>${escapeHtml(item.level)}</td>
            <td>${escapeHtml(item.user?.name ?? item.userId)}</td>
            <td>${escapeHtml(item.user?.email ?? "")}</td>
            <td>${item.amount.toLocaleString()} BDT</td>
            <td>${escapeHtml(item.status)}</td>
          </tr>
        `,
      )
      .join("");
    const printWindow = window.open("", "_blank", "width=1120,height=820");
    if (!printWindow) {
      setMessage("Allow popup windows to export the PDF.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Commission expenses report</title>
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
          <h1>Commission Expenses Report</h1>
          <p class="muted">Period: ${escapeHtml(period)} | Generated: ${new Date().toLocaleString()}</p>
          <div class="summary">
            <div class="card"><div class="label">Total expense</div><div class="value">${summary.totalAmount.toLocaleString()} BDT</div></div>
            <div class="card"><div class="label">Referral</div><div class="value">${summary.referralTotal.toLocaleString()} BDT</div></div>
            <div class="card"><div class="label">Product pair</div><div class="value">${summary.productPairTotal.toLocaleString()} BDT</div></div>
            <div class="card"><div class="label">Generation</div><div class="value">${summary.generationTotal.toLocaleString()} BDT</div></div>
            <div class="card"><div class="label">Legacy wings</div><div class="value">${summary.wingsTotal.toLocaleString()} BDT</div></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Commission ID</th>
                <th>Date</th>
                <th>Type</th>
                <th>Level</th>
                <th>User</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows || `<tr><td colspan="8">No commission expenses found.</td></tr>`}</tbody>
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
            Commission Expenses
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Track every paid commission expense from referral bonus, generation
            income, and binary wings income.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={handleExportPdf}>
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
          {getApiErrorMessage(error, "Commission expenses load failed.")}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <Card className="p-4">
          <MetricHeader icon={Banknote} label="Total expense" />
          <p className="mt-2 truncate text-2xl font-black text-gold-light">
            {taka(summary.totalAmount)}
          </p>
          <p className="mt-1 text-xs text-muted">
            {toBn(summary.totalCount)} records
          </p>
        </Card>
        <Card className="p-4">
          <MetricHeader icon={Gift} label="Referral bonus" />
          <p className="mt-2 truncate text-2xl font-black text-gold-light">
            {taka(summary.referralTotal)}
          </p>
        </Card>
        <Card className="p-4">
          <MetricHeader icon={Gift} label="Product pair" />
          <p className="mt-2 truncate text-2xl font-black text-gold-light">
            {taka(summary.productPairTotal)}
          </p>
        </Card>
        <Card className="p-4">
          <MetricHeader icon={Sparkles} label="Generation income" />
          <p className="mt-2 truncate text-2xl font-black text-gold-light">
            {taka(summary.generationTotal)}
          </p>
        </Card>
        <Card className="p-4">
          <MetricHeader icon={GitFork} label="Legacy wings" />
          <p className="mt-2 truncate text-2xl font-black text-gold-light">
            {taka(summary.wingsTotal)}
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <div className="grid gap-3 xl:grid-cols-[1fr_180px_170px_150px_130px]">
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
              placeholder="Search user, email, commission ID, or level"
              className="pl-10"
            />
          </div>
          <Select
            value={type}
            onChange={(event) => {
              setType(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All commission types</option>
            <option value="referral">Referral bonus</option>
            <option value="product-pair">Product pair commission</option>
            <option value="generation">Generation income</option>
            <option value="wings">Legacy wings records</option>
          </Select>
          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Unlocked">Unlocked</option>
            <option value="In Progress">In Progress</option>
            <option value="Locked">Locked</option>
          </Select>
          <Select
            value={month}
            onChange={(event) => {
              setMonth(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All months</option>
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </Select>
          <div className="relative">
            <CalendarDays
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              size={16}
            />
            <Input
              type="number"
              value={year}
              onChange={(event) => {
                setYear(event.target.value);
                setPage(1);
              }}
              placeholder="Year"
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>
              {[
                "Date",
                "User",
                "Commission type",
                "Level / source",
                "Amount",
                "Status",
                "Commission ID",
              ].map((head) => (
                <th key={head} className="px-5 py-4">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.length ? (
              expenses.map((item) => (
                <tr key={item.id} className="border-t border-line align-top">
                  <td className="px-5 py-4 text-muted">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold">
                      {item.user?.name ?? item.userId}
                    </p>
                    <p className="text-xs text-muted">
                      {item.user?.email ?? "User not found"}
                    </p>
                    {item.user?.phone ? (
                      <p className="text-xs text-muted">{item.user.phone}</p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${typeTone(item.type)}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted">{item.level}</td>
                  <td className="px-5 py-4 font-black text-gold-light">
                    {taka(item.amount)}
                  </td>
                  <td className="px-5 py-4">{item.status}</td>
                  <td className="break-all px-5 py-4 text-xs text-muted">
                    {item.id}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-10 text-center text-muted" colSpan={7}>
                  {isLoading
                    ? "Loading commission expenses..."
                    : "No commission expenses found."}
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

function MetricHeader({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="truncate text-sm font-semibold text-muted">{label}</p>
      <Icon size={18} className="shrink-0 text-gold-light" />
    </div>
  );
}
