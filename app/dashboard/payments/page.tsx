"use client";

import { CreditCard, Download } from "lucide-react";
// import { WithdrawalRequestForm } from "@/components/dashboard/withdrawal-request-form";
import { Button, Card } from "@/components/ui";
import { useGetMeQuery, useGetPaymentsQuery } from "@/lib/api";
import type { Withdrawal } from "@/lib/api-types";
import { taka } from "@/lib/utils";

export default function MemberPaymentsPage() {
  const { data, isLoading: paymentsLoading } = useGetPaymentsQuery();
  const { data: me } = useGetMeQuery();
  // const balance = data?.balance ?? 0;
  const withdrawals = data?.withdrawals ?? [];
  const totalWithdrawn = withdrawals
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = withdrawals
    .filter((item) => item.status !== "Paid" && item.status !== "Rejected")
    .reduce((sum, item) => sum + item.amount, 0);

  function formatDate(value: string) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return value || "-";

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
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

  function payoutDetails(item: Withdrawal) {
    const details = item.payoutDetails;
    if (!details) return item.account ?? "-";

    return [
      details.accountName,
      details.accountType,
      details.phone,
      details.accountNumber,
      details.bankName,
      details.branchName,
      details.routingNumber,
      details.cardLast4 ? `Card ****${details.cardLast4}` : undefined,
      details.note,
    ]
      .filter(Boolean)
      .join(", ") || item.account || "-";
  }

  function handleExportPdf() {
    const generatedAt = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
    const rows = withdrawals.length
      ? withdrawals
          .map(
            (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(item.id)}</td>
                <td>${escapeHtml(formatDate(item.date))}</td>
                <td>${escapeHtml(taka(item.amount))}</td>
                <td>${escapeHtml(item.method)}</td>
                <td>${escapeHtml(payoutDetails(item))}</td>
                <td>${escapeHtml(item.status)}</td>
              </tr>
            `,
          )
          .join("")
      : `<tr><td colspan="7" class="empty">No transactions found.</td></tr>`;

    const report = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Transaction History</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 32px; color: #1f1f1f; font-family: Arial, sans-serif; }
            .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #c69b2f; padding-bottom: 18px; }
            h1 { margin: 0; font-size: 26px; }
            .muted { color: #666; font-size: 12px; line-height: 1.6; }
            .brand { color: #9c741c; font-weight: 700; letter-spacing: 0.04em; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 22px 0; }
            .card { border: 1px solid #e6dfcf; border-radius: 10px; padding: 12px; background: #fbfaf6; }
            .label { color: #666; font-size: 11px; margin-bottom: 6px; }
            .value { font-size: 16px; font-weight: 700; }
            .member { margin-top: 18px; border: 1px solid #e6dfcf; border-radius: 10px; padding: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 12px; }
            th { background: #f3eddc; color: #4b3b1d; text-align: left; }
            th, td { border: 1px solid #e2dccf; padding: 9px; vertical-align: top; }
            .empty { text-align: center; color: #777; padding: 24px; }
            .footer { margin-top: 22px; color: #777; font-size: 11px; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <section class="header">
            <div>
              <div class="brand">GIOTO Bangladesh</div>
              <h1>Transaction History Report</h1>
              <div class="muted">Generated: ${escapeHtml(generatedAt)}</div>
            </div>
            <div class="muted">
              Dashboard payments report<br />
              Exported from member account
            </div>
          </section>

          <section class="member">
            <strong>Member details</strong><br />
            <span class="muted">
              Name: ${escapeHtml(me?.name ?? "-")}<br />
              User ID: ${escapeHtml(me?.id ?? "-")}<br />
              Email: ${escapeHtml(me?.email ?? "-")}<br />
              Mobile: ${escapeHtml(me?.phone ?? "-")}
            </span>
          </section>

          <section class="grid">
            <div class="card"><div class="label">Current balance</div><div class="value">${escapeHtml(taka(data?.balance ?? 0))}</div></div>
            <div class="card"><div class="label">Paid withdrawals</div><div class="value">${escapeHtml(taka(totalWithdrawn))}</div></div>
            <div class="card"><div class="label">Pending/Reserved</div><div class="value">${escapeHtml(taka(pendingAmount))}</div></div>
            <div class="card"><div class="label">Total transactions</div><div class="value">${withdrawals.length}</div></div>
          </section>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Account / Details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <div class="footer">
            This report is generated from the member dashboard transaction history.
          </div>
          <script>
            window.addEventListener("load", () => {
              window.focus();
              window.print();
            });
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.open();
    printWindow.document.write(report);
    printWindow.document.close();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">Payments and transactions</p>
        <h2 className="heading-gradient text-4xl font-black">My payments</h2>
      </div>

      {paymentsLoading ? (
        <p className="text-sm text-muted">Loading payment data...</p>
      ) : null}

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="text-gold-light" size={22} />
            <div>
              <h3 className="text-2xl font-bold">Transaction history</h3>
              <p className="text-sm text-muted">
                Export includes member details, totals, account details, and status.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleExportPdf}
            disabled={paymentsLoading || !withdrawals.length}
            className="w-full sm:w-auto"
          >
            <Download size={16} />
            Export PDF
          </Button>
        </div>
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>
              {[
                "Transaction ID",
                "Date",
                "Amount",
                "Method",
                "Account / Details",
                "Status",
              ].map((head) => (
                <th key={head} className="px-5 py-4">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {withdrawals.length ? (
              withdrawals.map((item) => (
                <tr key={item.id} className="border-t border-line">
                  <td className="px-5 py-4 font-mono text-xs text-muted">
                    {item.id}
                  </td>
                  <td className="px-5 py-4">{formatDate(item.date)}</td>
                  <td className="px-5 py-4 font-bold text-gold-light">
                    {taka(item.amount)}
                  </td>
                  <td className="px-5 py-4">{item.method}</td>
                  <td className="px-5 py-4 text-muted">
                    {payoutDetails(item)}
                  </td>
                  <td className="px-5 py-4 text-muted">{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-8 text-center text-muted" colSpan={6}>
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
