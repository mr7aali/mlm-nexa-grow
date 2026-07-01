"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CreditCard, Download, Search, XCircle } from "lucide-react";
import { Button, Card, Input, Select } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { useGetAdminPaymentsQuery, useUpdateAdminWithdrawalStatusMutation } from "@/lib/api";
import type { AdminWithdrawal, PayoutDetails } from "@/lib/api-types";
import { taka, toBn } from "@/lib/utils";

const pageSize = 10;
const currentYear = new Date().getFullYear();
type PaymentStatus = "all" | AdminWithdrawal["status"];

function detailRows(details?: PayoutDetails, fallback?: string) {
  if (!details) return fallback ? [fallback] : ["-"];

  if (details.provider === "Bank") {
    return [
      details.accountName ? `Name: ${details.accountName}` : undefined,
      details.bankName ? `Bank: ${details.bankName}` : undefined,
      details.branchName ? `Branch: ${details.branchName}` : undefined,
      details.accountNumber ? `A/C: ${details.accountNumber}` : undefined,
      details.routingNumber ? `Routing: ${details.routingNumber}` : undefined,
      details.accountType ? `Type: ${details.accountType}` : undefined,
    ].filter(Boolean) as string[];
  }

  if (details.provider === "Card") {
    return [
      details.accountName ? `Name: ${details.accountName}` : undefined,
      details.cardLast4 ? `Card: ****${details.cardLast4}` : undefined,
      details.accountType ? `Type: ${details.accountType}` : undefined,
      details.phone ? `Phone: ${details.phone}` : undefined,
    ].filter(Boolean) as string[];
  }

  return [
    details.accountName ? `Name: ${details.accountName}` : undefined,
    details.phone ? `Number: ${details.phone}` : undefined,
    details.accountType ? `Type: ${details.accountType}` : undefined,
  ].filter(Boolean) as string[];
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function SuperAdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("all");
  const [method, setMethod] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(String(currentYear));
  const [message, setMessage] = useState("");
  const query = useMemo(() => ({
    page,
    limit: pageSize,
    search: search.trim() || undefined,
    status: status === "all" ? undefined : status,
    method: method.trim() || undefined,
    month: month ? Number(month) : undefined,
    year: year ? Number(year) : undefined,
  }), [method, month, page, search, status, year]);
  const { data, isLoading, error } = useGetAdminPaymentsQuery(query);
  const [updatePayment, { isLoading: updating }] = useUpdateAdminWithdrawalStatusMutation();
  const payments = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const paidTotal = data?.summary?.paidTotal ?? 0;
  const reviewTotal = data?.summary?.reviewTotal ?? 0;

  async function handleStatus(item: AdminWithdrawal, nextStatus: AdminWithdrawal["status"]) {
    setMessage("");
    if (item.status === "Paid") {
      setMessage("Paid withdrawals cannot be changed.");
      return;
    }
    if (item.status === nextStatus) return;
    const confirmed = window.confirm(`Update this withdrawal request to ${nextStatus}?`);
    if (!confirmed) return;

    try {
      await updatePayment({ withdrawalId: item.id, status: nextStatus }).unwrap();
      setMessage("Payment status updated.");
    } catch (err) {
      setMessage(getApiErrorMessage(err, "Payment update failed."));
    }
  }

  function handleExportPdf() {
    const period = month
      ? `${new Date(0, Number(month) - 1).toLocaleString("en", { month: "long" })} ${year}`
      : `All months, ${year || "all years"}`;
    const rows = payments.map((item) => {
      const details = detailRows(item.payoutDetails, item.account).map(escapeHtml).join("<br />");
      return `
        <tr>
          <td>${escapeHtml(item.id)}</td>
          <td>${new Date(item.date).toLocaleDateString()}</td>
          <td>${escapeHtml(item.user?.name ?? item.userId)}<br /><small>${escapeHtml(item.user?.email ?? "")}</small></td>
          <td>${escapeHtml(item.method)}</td>
          <td>${item.amount.toLocaleString()} BDT</td>
          <td>${details}</td>
          <td>${escapeHtml(item.status)}</td>
        </tr>
      `;
    }).join("");
    const printWindow = window.open("", "_blank", "width=1100,height=800");
    if (!printWindow) {
      setMessage("Allow popup windows to export the PDF.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Payments report</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111; margin: 32px; }
            h1 { margin: 0 0 4px; font-size: 24px; }
            .muted { color: #666; font-size: 12px; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 24px 0; }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
            .label { color: #666; font-size: 12px; margin-bottom: 6px; }
            .value { font-size: 20px; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Payments and Withdrawals Report</h1>
          <p class="muted">Period: ${period} | Generated: ${new Date().toLocaleString()}</p>
          <div class="summary">
            <div class="card"><div class="label">Requests on this page</div><div class="value">${payments.length}</div></div>
            <div class="card"><div class="label">Total paid</div><div class="value">${paidTotal.toLocaleString()} BDT</div></div>
            <div class="card"><div class="label">Total review</div><div class="value">${reviewTotal.toLocaleString()} BDT</div></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Date</th>
                <th>User</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Payout details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows || `<tr><td colspan="7">No payment requests found.</td></tr>`}</tbody>
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
          <p className="text-sm text-gold-light">Super admin</p>
          <h2 className="heading-gradient text-4xl font-black">Payments and withdrawals</h2>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-light">
          <CreditCard size={17} />
          Total {toBn(data?.total ?? 0)} requests
        </div>
      </div>

      {message ? <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p> : null}
      {error ? <p className="rounded-2xl border border-foreground/20 bg-foreground/5 px-4 py-3 text-sm text-foreground">{getApiErrorMessage(error, "Payment load failed.")}</p> : null}

      <div className="grid gap-5 md:grid-cols-4">
        <Card><p className="text-sm text-muted">Total paid</p><p className="mt-2 text-3xl font-black text-gold-light">{taka(paidTotal)}</p></Card>
        <Card><p className="text-sm text-muted">Total review</p><p className="mt-2 text-3xl font-black text-gold-light">{taka(reviewTotal)}</p></Card>
        <Card><p className="text-sm text-muted">Pending</p><p className="mt-2 text-3xl font-black text-gold-light">{toBn(payments.filter((item) => item.status === "Pending").length)}</p></Card>
        <Card><p className="text-sm text-muted">Rejected</p><p className="mt-2 text-3xl font-black text-gold-light">{toBn(payments.filter((item) => item.status === "Rejected").length)}</p></Card>
      </div>

      <Card className="p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px_150px_130px_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <Input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1); }}
              placeholder="Name, email, phone, bank, account, card last 4, request ID"
              className="pl-10"
            />
          </div>
          <Select value={status} onChange={(event) => { setStatus(event.target.value as PaymentStatus); setPage(1); }}>
            <option value="all">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Review">Review</option>
            <option value="Paid">Paid</option>
            <option value="Rejected">Rejected</option>
          </Select>
          <Select value={method} onChange={(event) => { setMethod(event.target.value); setPage(1); }}>
            <option value="">All methods</option>
            <option>bKash</option>
            <option>Nagad</option>
            <option>Rocket</option>
            <option>Bank</option>
            <option>Card</option>
          </Select>
          <Select value={month} onChange={(event) => { setMonth(event.target.value); setPage(1); }}>
            <option value="">All months</option>
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            value={year}
            onChange={(event) => { setYear(event.target.value); setPage(1); }}
            placeholder="Year"
          />
          <Button type="button" variant="outline" onClick={handleExportPdf}>
            <Download size={16} />
            Export PDF
          </Button>
        </div>
      </Card>

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <table className="w-full min-w-[1240px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>{["Date", "User", "Payout details", "Method", "Amount", "Available balance", "Status", "Action"].map((head) => <th key={head} className="px-5 py-4">{head}</th>)}</tr>
          </thead>
          <tbody>
            {payments.length ? payments.map((item) => (
              <tr key={item.id} className="border-t border-line align-top">
                <td className="px-5 py-4 text-muted">{item.date}</td>
                <td className="px-5 py-4">
                  <p className="font-semibold">{item.user?.name ?? item.userId}</p>
                  <p className="text-xs text-muted">{item.user?.email ?? "User not found"}</p>
                  {item.user?.phone ? <p className="text-xs text-muted">{item.user.phone}</p> : null}
                </td>
                <td className="px-5 py-4 text-muted">
                  <div className="space-y-1">
                    {detailRows(item.payoutDetails, item.account).map((line) => <p key={line}>{line}</p>)}
                    {item.payoutDetails?.note ? <p>Note: {item.payoutDetails.note}</p> : null}
                  </div>
                </td>
                <td className="px-5 py-4">{item.method}</td>
                <td className="px-5 py-4 font-bold text-gold-light">{taka(item.amount)}</td>
                <td className="px-5 py-4 text-gold-light">{taka(item.user?.currentBalance ?? 0)}</td>
                <td className="px-5 py-4">{item.status}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button className="min-h-9 px-3 py-1 text-xs" disabled={updating || item.status === "Paid"} onClick={() => handleStatus(item, "Paid")}>
                      <CheckCircle2 size={14} />
                      Paid
                    </Button>
                    <Button variant="outline" className="min-h-9 px-3 py-1 text-xs" disabled={updating || item.status === "Paid"} onClick={() => handleStatus(item, "Review")}>Review</Button>
                    <Button variant="danger" className="min-h-9 px-3 py-1 text-xs" disabled={updating || item.status === "Paid"} onClick={() => handleStatus(item, "Rejected")}>
                      <XCircle size={14} />
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="px-5 py-10 text-center text-muted" colSpan={8}>
                  {isLoading ? "Loading payments..." : "No payment requests found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Page {toBn(data?.page ?? page)} / {toBn(totalPages)}</p>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((old) => Math.max(1, old - 1))}>Previous</Button>
          <Button disabled={page >= totalPages} onClick={() => setPage((old) => Math.min(totalPages, old + 1))}>Next</Button>
        </div>
      </div>
    </div>
  );
}
