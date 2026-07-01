"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Download,
  Search,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { Button, Card, Input, Select } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useGetAdminOrdersQuery,
  useUpdateAdminOrderStatusMutation,
} from "@/lib/api";
import type { AdminOrder } from "@/lib/api-types";
import { taka, toBn } from "@/lib/utils";

const pageSize = 10;
type StatusFilter = "all" | AdminOrder["status"];

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(date);
}

function isPaidSale(order: AdminOrder) {
  return order.status === "Confirmed" && order.paymentStatus === "Paid";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function productName(order: AdminOrder) {
  return order.product?.name ?? order.productId;
}

export default function SuperAdminOrdersPage() {
  const currentYear = new Date().getFullYear();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [method, setMethod] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(currentYear);
  const [message, setMessage] = useState("");
  const query = useMemo(
    () => ({
      page,
      limit: pageSize,
      search: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      method: method.trim() || undefined,
      month: month ? Number(month) : undefined,
      year,
    }),
    [method, month, page, search, status, year],
  );
  const { data, isLoading, error } = useGetAdminOrdersQuery(query);
  const [updateOrder, { isLoading: updating }] =
    useUpdateAdminOrderStatusMutation();
  const orders = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const pageSales = orders
    .filter(isPaidSale)
    .reduce((sum, order) => sum + order.total, 0);
  const confirmedCount = orders.filter((item) => item.status === "Confirmed").length;
  const cancelledCount = orders.filter((item) => item.status === "Cancelled").length;
  const failedCount = orders.filter((item) => item.paymentStatus === "Failed").length;

  async function handleStatus(order: AdminOrder, nextStatus: AdminOrder["status"]) {
    const action = nextStatus === "Confirmed" ? "confirm" : "cancel";
    const accepted = window.confirm(
      `Are you sure you want to ${action} order ${order.id}?`,
    );

    if (!accepted) return;

    setMessage("");
    try {
      await updateOrder({ orderId: order.id, status: nextStatus }).unwrap();
      setMessage(`Order ${action}ed successfully.`);
    } catch (err) {
      setMessage(getApiErrorMessage(err, "Order status update failed"));
    }
  }

  function handleExportPdf() {
    const selectedMonth =
      months.find((item) => String(item.value) === month)?.label ?? "All months";
    const generatedAt = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
    const rows = orders.length
      ? orders
          .map(
            (order, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(formatDate(order.createdAt))}</td>
                <td>${escapeHtml(order.id)}</td>
                <td>${escapeHtml(order.user?.name ?? order.customerName)}</td>
                <td>${escapeHtml(order.user?.email ?? order.email)}</td>
                <td>${escapeHtml(productName(order))}</td>
                <td>${escapeHtml(order.product?.sku ?? order.productId)}</td>
                <td>${order.quantity}</td>
                <td>${escapeHtml(order.paymentMethod)}</td>
                <td>${escapeHtml(order.paymentStatus ?? "-")}</td>
                <td>${escapeHtml(order.status)}</td>
                <td>${escapeHtml(taka(order.total))}</td>
              </tr>
            `,
          )
          .join("")
      : `<tr><td colspan="12" class="empty">No checkout orders found.</td></tr>`;
    const report = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Checkout Orders Report</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 30px; color: #1f1f1f; font-family: Arial, sans-serif; }
            .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #c69b2f; padding-bottom: 16px; }
            h1 { margin: 0; font-size: 25px; }
            .brand { color: #9c741c; font-weight: 700; letter-spacing: 0.04em; }
            .muted { color: #666; font-size: 12px; line-height: 1.6; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 22px 0; }
            .card { border: 1px solid #e6dfcf; border-radius: 10px; padding: 12px; background: #fbfaf6; }
            .label { color: #666; font-size: 11px; margin-bottom: 6px; }
            .value { font-size: 16px; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 10px; }
            th { background: #f3eddc; color: #4b3b1d; text-align: left; }
            th, td { border: 1px solid #e2dccf; padding: 7px; vertical-align: top; }
            .empty { text-align: center; color: #777; padding: 24px; }
            .footer { margin-top: 20px; color: #777; font-size: 11px; }
            @media print { body { padding: 18px; } }
          </style>
        </head>
        <body>
          <section class="header">
            <div>
              <div class="brand">GIOTO Bangladesh</div>
              <h1>Checkout Orders Report</h1>
              <div class="muted">Generated: ${escapeHtml(generatedAt)}</div>
            </div>
            <div class="muted">
              Period: ${escapeHtml(selectedMonth)} ${year}<br />
              Current page export
            </div>
          </section>
          <section class="grid">
            <div class="card"><div class="label">Sales amount</div><div class="value">${escapeHtml(taka(pageSales))}</div></div>
            <div class="card"><div class="label">Confirmed orders</div><div class="value">${confirmedCount}</div></div>
            <div class="card"><div class="label">Cancelled orders</div><div class="value">${cancelledCount}</div></div>
            <div class="card"><div class="label">Failed payments</div><div class="value">${failedCount}</div></div>
          </section>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Order</th>
                <th>Member</th>
                <th>Email</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Method</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="footer">Sales amount includes confirmed and paid orders only. Cancelled and failed orders are reported separately.</div>
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
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-gold-light">Super admin</p>
          <h2 className="heading-gradient text-4xl font-black">
            Checkout Orders
          </h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-light">
            <ShoppingBag size={17} />
            Total {toBn(data?.total ?? 0)} orders
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleExportPdf}
            disabled={isLoading || !orders.length}
            className="w-full sm:w-auto"
          >
            <Download size={16} />
            Export PDF
          </Button>
        </div>
      </div>

      {message ? (
        <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-2xl border border-foreground/20 bg-foreground/5 px-4 py-3 text-sm text-foreground">
          {getApiErrorMessage(error, "Order history load failed")}
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-4">
        <Card>
          <p className="text-sm text-muted">This page sales</p>
          <p className="mt-2 text-3xl font-black text-gold-light">
            {taka(pageSales)}
          </p>
          <p className="mt-1 text-xs text-muted">Confirmed and paid only</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Confirmed</p>
          <p className="mt-2 text-3xl font-black text-gold-light">
            {toBn(confirmedCount)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Failed payments</p>
          <p className="mt-2 text-3xl font-black text-gold-light">
            {toBn(failedCount)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Cancelled</p>
          <p className="mt-2 text-3xl font-black text-gold-light">
            {toBn(cancelledCount)}
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_150px_150px_150px_170px]">
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
              placeholder="Search order, user, phone, product, SKU"
              className="pl-10"
            />
          </div>
          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as StatusFilter);
              setPage(1);
            }}
          >
            <option value="all">All status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </Select>
          <Select
            value={month}
            onChange={(event) => {
              setMonth(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All months</option>
            {months.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            min={2000}
            max={2100}
            value={year}
            onChange={(event) => {
              setYear(Number(event.target.value) || currentYear);
              setPage(1);
            }}
            placeholder="Year"
          />
          <Input
            value={method}
            onChange={(event) => {
              setMethod(event.target.value);
              setPage(1);
            }}
            placeholder="Payment method"
          />
        </div>
      </Card>

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <table className="w-full min-w-[1220px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>
              {[
                "Date",
                "Order",
                "Member",
                "Product",
                "Payment",
                "Quantity",
                "Total",
                "Status",
                "Action",
              ].map((head) => (
                <th key={head} className="px-5 py-4">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length ? (
              orders.map((item) => (
                <tr key={item.id} className="border-t border-line align-top">
                  <td className="px-5 py-4 text-muted">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold">{item.id}</p>
                    <p className="mt-1 text-xs text-muted">{item.customerName}</p>
                    <p className="mt-1 text-xs text-muted">{item.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold">
                      {item.user?.name ?? item.customerName}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {item.user?.email ?? item.email}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Code: {item.user?.referralCode ?? "N/A"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold">{productName(item)}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.product?.sku ?? "Product not found"}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {item.product?.category ?? ""}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold">{item.paymentMethod}</p>
                    {item.paymentStatus ? (
                      <p className="mt-1 text-xs text-muted">
                        Payment: {item.paymentStatus}
                      </p>
                    ) : null}
                    {item.paymentTransactionId ? (
                      <p className="mt-1 text-xs text-muted">
                        Txn: {item.paymentTransactionId}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">{toBn(item.quantity)}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gold-light">
                      {taka(item.total)}
                    </p>
                  </td>
                  <td className="px-5 py-4">{item.status}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        className="min-h-9 px-3 py-1 text-xs"
                        disabled={updating || item.status === "Confirmed"}
                        onClick={() => handleStatus(item, "Confirmed")}
                      >
                        <CheckCircle2 size={14} />
                        Confirm
                      </Button>
                      <Button
                        variant="danger"
                        className="min-h-9 px-3 py-1 text-xs"
                        disabled={updating || item.status === "Cancelled"}
                        onClick={() => handleStatus(item, "Cancelled")}
                      >
                        <XCircle size={14} />
                        Cancel
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-10 text-center text-muted" colSpan={9}>
                  {isLoading
                    ? "Order history loading..."
                    : "No checkout order found."}
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
