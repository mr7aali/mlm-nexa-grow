"use client";

import { CreditCard, Download } from "lucide-react";
// import { WithdrawalRequestForm } from "@/components/dashboard/withdrawal-request-form";
import { Button, Card } from "@/components/ui";
import { useGetMeQuery, useGetPaymentsQuery } from "@/lib/api";
import type { Withdrawal } from "@/lib/api-types";
import { useI18n } from "@/lib/i18n";
import { taka, toBn } from "@/lib/utils";

export default function MemberPaymentsPage() {
  const { language } = useI18n();
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

  const text = {
    eyebrow:
      language === "bn" ? "পেমেন্ট ও ট্রানজ্যাকশন" : "Payments and transactions",
    title: language === "bn" ? "আমার পেমেন্ট" : "My payments",
    loading:
      language === "bn" ? "পেমেন্ট ডাটা লোড হচ্ছে..." : "Loading payment data...",
    history: language === "bn" ? "ট্রানজ্যাকশন ইতিহাস" : "Transaction history",
    historyHelp:
      language === "bn"
        ? "এক্সপোর্টে সদস্য তথ্য, মোট হিসাব, অ্যাকাউন্ট ডিটেইলস এবং স্ট্যাটাস থাকবে।"
        : "Export includes member details, totals, account details, and status.",
    exportPdf: language === "bn" ? "PDF এক্সপোর্ট" : "Export PDF",
    transactionId: language === "bn" ? "ট্রানজ্যাকশন আইডি" : "Transaction ID",
    date: language === "bn" ? "তারিখ" : "Date",
    amount: language === "bn" ? "পরিমাণ" : "Amount",
    method: language === "bn" ? "মেথড" : "Method",
    accountDetails:
      language === "bn" ? "অ্যাকাউন্ট / ডিটেইলস" : "Account / Details",
    status: language === "bn" ? "স্ট্যাটাস" : "Status",
    empty:
      language === "bn" ? "এখনো কোনো ট্রানজ্যাকশন নেই।" : "No transactions yet.",
    reportTitle:
      language === "bn" ? "ট্রানজ্যাকশন ইতিহাস রিপোর্ট" : "Transaction History Report",
    generated: language === "bn" ? "জেনারেটেড" : "Generated",
    dashboardReport:
      language === "bn" ? "ড্যাশবোর্ড পেমেন্ট রিপোর্ট" : "Dashboard payments report",
    exportedFrom:
      language === "bn"
        ? "সদস্য অ্যাকাউন্ট থেকে এক্সপোর্ট করা"
        : "Exported from member account",
    memberDetails: language === "bn" ? "সদস্য তথ্য" : "Member details",
    name: language === "bn" ? "নাম" : "Name",
    userId: language === "bn" ? "ইউজার আইডি" : "User ID",
    email: language === "bn" ? "ই-মেইল" : "Email",
    mobile: language === "bn" ? "মোবাইল" : "Mobile",
    currentBalance:
      language === "bn" ? "বর্তমান ব্যালেন্স" : "Current balance",
    paidWithdrawals:
      language === "bn" ? "পেইড উইথড্র" : "Paid withdrawals",
    pendingReserved:
      language === "bn" ? "পেন্ডিং/রিজার্ভড" : "Pending/Reserved",
    totalTransactions:
      language === "bn" ? "মোট ট্রানজ্যাকশন" : "Total transactions",
    noTransactions:
      language === "bn" ? "কোনো ট্রানজ্যাকশন পাওয়া যায়নি।" : "No transactions found.",
    footer:
      language === "bn"
        ? "এই রিপোর্ট সদস্য ড্যাশবোর্ডের ট্রানজ্যাকশন ইতিহাস থেকে তৈরি।"
        : "This report is generated from the member dashboard transaction history.",
  };
  const money = (value: number) =>
    language === "bn" ? taka(value) : `BDT ${value.toLocaleString("en-IN")}`;
  const n = (value: number) => (language === "bn" ? toBn(value) : String(value));

  function formatDate(value: string) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return value || "-";

    return new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  function formatStatus(value: string) {
    if (language === "en") return value;

    const statuses: Record<string, string> = {
      Pending: "পেন্ডিং",
      Review: "রিভিউ",
      Paid: "পেইড",
      Rejected: "রিজেক্টেড",
    };

    return statuses[value] ?? value;
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
    const generatedAt = new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
    const rows = withdrawals.length
      ? withdrawals
          .map(
            (item, index) => `
              <tr>
                <td>${escapeHtml(n(index + 1))}</td>
                <td>${escapeHtml(item.id)}</td>
                <td>${escapeHtml(formatDate(item.date))}</td>
                <td>${escapeHtml(money(item.amount))}</td>
                <td>${escapeHtml(item.method)}</td>
                <td>${escapeHtml(payoutDetails(item))}</td>
                <td>${escapeHtml(formatStatus(item.status))}</td>
              </tr>
            `,
          )
          .join("")
      : `<tr><td colspan="7" class="empty">${escapeHtml(text.noTransactions)}</td></tr>`;

    const report = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(text.reportTitle)}</title>
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
              <h1>${escapeHtml(text.reportTitle)}</h1>
              <div class="muted">${escapeHtml(text.generated)}: ${escapeHtml(generatedAt)}</div>
            </div>
            <div class="muted">
              ${escapeHtml(text.dashboardReport)}<br />
              ${escapeHtml(text.exportedFrom)}
            </div>
          </section>

          <section class="member">
            <strong>${escapeHtml(text.memberDetails)}</strong><br />
            <span class="muted">
              ${escapeHtml(text.name)}: ${escapeHtml(me?.name ?? "-")}<br />
              ${escapeHtml(text.userId)}: ${escapeHtml(me?.id ?? "-")}<br />
              ${escapeHtml(text.email)}: ${escapeHtml(me?.email ?? "-")}<br />
              ${escapeHtml(text.mobile)}: ${escapeHtml(me?.phone ?? "-")}
            </span>
          </section>

          <section class="grid">
            <div class="card"><div class="label">${escapeHtml(text.currentBalance)}</div><div class="value">${escapeHtml(money(data?.balance ?? 0))}</div></div>
            <div class="card"><div class="label">${escapeHtml(text.paidWithdrawals)}</div><div class="value">${escapeHtml(money(totalWithdrawn))}</div></div>
            <div class="card"><div class="label">${escapeHtml(text.pendingReserved)}</div><div class="value">${escapeHtml(money(pendingAmount))}</div></div>
            <div class="card"><div class="label">${escapeHtml(text.totalTransactions)}</div><div class="value">${escapeHtml(n(withdrawals.length))}</div></div>
          </section>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>${escapeHtml(text.transactionId)}</th>
                <th>${escapeHtml(text.date)}</th>
                <th>${escapeHtml(text.amount)}</th>
                <th>${escapeHtml(text.method)}</th>
                <th>${escapeHtml(text.accountDetails)}</th>
                <th>${escapeHtml(text.status)}</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <div class="footer">
            ${escapeHtml(text.footer)}
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
    <div className="space-y-6" data-no-translate>
      <div>
        <p className="text-sm text-gold-light">{text.eyebrow}</p>
        <h2 className="heading-gradient text-4xl font-black">{text.title}</h2>
      </div>

      {paymentsLoading ? (
        <p className="text-sm text-muted">{text.loading}</p>
      ) : null}

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="text-gold-light" size={22} />
            <div>
              <h3 className="text-2xl font-bold">{text.history}</h3>
              <p className="text-sm text-muted">
                {text.historyHelp}
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
            {text.exportPdf}
          </Button>
        </div>
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>
              {[
                text.transactionId,
                text.date,
                text.amount,
                text.method,
                text.accountDetails,
                text.status,
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
                    {money(item.amount)}
                  </td>
                  <td className="px-5 py-4">{item.method}</td>
                  <td className="px-5 py-4 text-muted">
                    {payoutDetails(item)}
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {formatStatus(item.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-8 text-center text-muted" colSpan={6}>
                  {text.empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
