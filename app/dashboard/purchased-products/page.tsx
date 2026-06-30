"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  PackageCheck,
  Search,
  ShoppingBag,
  WalletCards,
  XCircle,
} from "lucide-react";
import { Badge, Button, Card, Input, Select } from "@/components/ui";
import { useGetPurchasedProductsQuery } from "@/lib/api";
import type { PurchasedProduct } from "@/lib/api-types";
import { useI18n } from "@/lib/i18n";
import { cn, taka, toBn } from "@/lib/utils";

const limit = 10;

function formatDate(value: string, language: "bn" | "en") {
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

function purchaseStatus(item: PurchasedProduct, language: "bn" | "en") {
  if (item.status === "Confirmed" && item.paymentStatus === "Paid") {
    return { label: language === "bn" ? "পেইড" : "Paid", tone: "gold" as const };
  }

  if (item.status === "Cancelled" || item.paymentStatus === "Cancelled") {
    return {
      label: language === "bn" ? "বাতিল" : "Cancelled",
      tone: "red" as const,
    };
  }

  if (item.paymentStatus === "Failed") {
    return { label: language === "bn" ? "ব্যর্থ" : "Failed", tone: "red" as const };
  }

  return { label: language === "bn" ? "পেন্ডিং" : "Pending", tone: "muted" as const };
}

function productName(item: PurchasedProduct) {
  return item.product?.name ?? item.productId;
}

export default function PurchasedProductsPage() {
  const { language } = useI18n();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const { data, isFetching, isLoading } = useGetPurchasedProductsQuery({
    page,
    limit,
    status,
    search,
  });
  const items = data?.items ?? [];
  const stats = data?.stats;
  const totalPages = data?.totalPages ?? 1;
  const showingFrom = data?.total ? (page - 1) * limit + 1 : 0;
  const showingTo = data?.total ? Math.min(page * limit, data.total) : 0;
  const text = {
    eyebrow: language === "bn" ? "ক্রয় ইতিহাস" : "Purchase history",
    title: language === "bn" ? "ক্রয়কৃত পণ্য" : "Purchased Products",
    description:
      language === "bn"
        ? "আপনার সম্পন্ন, পেন্ডিং, ব্যর্থ এবং বাতিল পণ্য ক্রয়ের হিসাব ও সারসংক্ষেপ দেখুন।"
        : "Track your completed, pending, failed, and cancelled product purchases with summary statistics.",
    showing: language === "bn" ? "দেখানো হচ্ছে" : "Showing",
    of: language === "bn" ? "মোট" : "of",
    totalOrders: language === "bn" ? "মোট অর্ডার" : "Total orders",
    paidPurchases: language === "bn" ? "পেইড ক্রয়" : "Paid purchases",
    totalSpent: language === "bn" ? "মোট খরচ" : "Total spent",
    pendingFailed: language === "bn" ? "পেন্ডিং / ব্যর্থ" : "Pending / failed",
    statisticsByProduct:
      language === "bn" ? "পণ্যভিত্তিক পরিসংখ্যান" : "Statistics by product",
    topPaidProducts:
      language === "bn"
        ? "আপনার ক্রয় ইতিহাসের শীর্ষ পেইড পণ্য।"
        : "Top paid products from your purchase history.",
    noPaidStats:
      language === "bn"
        ? "এখনো কোনো পেইড পণ্যের পরিসংখ্যান নেই।"
        : "No paid product statistics yet.",
    categorySummary: language === "bn" ? "ক্যাটাগরি সারসংক্ষেপ" : "Category summary",
    categoryHelp:
      language === "bn"
        ? "পণ্য ক্যাটাগরি অনুযায়ী পেইড ক্রয়ের মূল্য।"
        : "Paid purchase value grouped by product category.",
    noCategory:
      language === "bn"
        ? "এখনো কোনো ক্যাটাগরি ডাটা নেই।"
        : "No category data available yet.",
    productFallback: language === "bn" ? "পণ্য" : "Product",
    items: language === "bn" ? "আইটেম" : "items",
    orders: language === "bn" ? "অর্ডার" : "orders",
    listTitle: language === "bn" ? "ক্রয়কৃত পণ্যের তালিকা" : "Purchased product list",
    listHelp:
      language === "bn"
        ? "অর্ডার আইডি, ট্রানজ্যাকশন আইডি, পণ্য আইডি, নাম, SKU বা ক্যাটাগরি দিয়ে সার্চ করুন।"
        : "Search by order ID, transaction ID, product ID, name, SKU, or category.",
    searchPlaceholder: language === "bn" ? "ক্রয় সার্চ করুন" : "Search purchases",
    search: language === "bn" ? "সার্চ" : "Search",
    clearSearch: language === "bn" ? "সার্চ মুছুন" : "Clear search",
    product: language === "bn" ? "পণ্য" : "Product",
    orderId: language === "bn" ? "অর্ডার আইডি" : "Order ID",
    date: language === "bn" ? "তারিখ" : "Date",
    quantity: language === "bn" ? "পরিমাণ" : "Quantity",
    amount: language === "bn" ? "মূল্য" : "Amount",
    payment: language === "bn" ? "পেমেন্ট" : "Payment",
    status: language === "bn" ? "স্ট্যাটাস" : "Status",
    loading:
      language === "bn" ? "ক্রয়কৃত পণ্য লোড হচ্ছে..." : "Loading purchased products...",
    empty:
      language === "bn" ? "কোনো ক্রয়কৃত পণ্য পাওয়া যায়নি।" : "No purchased products found.",
    page: language === "bn" ? "পৃষ্ঠা" : "Page",
    previous: language === "bn" ? "আগের" : "Previous",
    next: language === "bn" ? "পরের" : "Next",
    allPurchases: language === "bn" ? "সব ক্রয়" : "All purchases",
    paid: language === "bn" ? "পেইড" : "Paid",
    pending: language === "bn" ? "পেন্ডিং" : "Pending",
    failed: language === "bn" ? "ব্যর্থ" : "Failed",
    cancelled: language === "bn" ? "বাতিল" : "Cancelled",
  };
  const statusOptions = [
    { label: text.allPurchases, value: "all" },
    { label: text.paid, value: "paid" },
    { label: text.pending, value: "pending" },
    { label: text.failed, value: "failed" },
    { label: text.cancelled, value: "cancelled" },
  ];
  const n = (value: number) => (language === "bn" ? toBn(value) : String(value));
  const money = (value: number) =>
    language === "bn" ? taka(value) : `BDT ${value.toLocaleString("en-IN")}`;
  const statCards = [
    {
      label: text.totalOrders,
      value: n(stats?.totalOrders ?? 0),
      icon: ShoppingBag,
    },
    {
      label: text.paidPurchases,
      value: n(stats?.paidOrders ?? 0),
      icon: PackageCheck,
    },
    {
      label: text.totalSpent,
      value: money(stats?.totalSpent ?? 0),
      icon: WalletCards,
    },
    {
      label: text.pendingFailed,
      value: n((stats?.pendingOrders ?? 0) + (stats?.failedOrders ?? 0)),
      icon: Clock3,
    },
  ];

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  function clearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  return (
    <div className="space-y-6" data-no-translate>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-gold-light">
            {text.eyebrow}
          </p>
          <h2 className="heading-gradient text-3xl font-black md:text-4xl">
            {text.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {text.description}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-elevated px-4 py-3 text-sm text-muted">
          {text.showing}{" "}
          <span className="font-bold text-foreground">
            {n(showingFrom)}-{n(showingTo)}
          </span>{" "}
          {text.of}{" "}
          <span className="font-bold text-foreground">
            {n(data?.total ?? 0)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-4 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="p-3 md:p-5">
              <div className="flex min-h-14 items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-muted md:text-sm">
                    {card.label}
                  </p>
                  <p className="mt-1 truncate text-lg font-black text-gold-light md:text-3xl">
                    {card.value}
                  </p>
                </div>
                <Icon className="shrink-0 text-gold" size={24} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card className="p-0">
          <div className="border-b border-line p-5">
            <h3 className="text-xl font-bold">{text.statisticsByProduct}</h3>
            <p className="mt-1 text-sm text-muted">
              {text.topPaidProducts}
            </p>
          </div>
          <div className="divide-y divide-line">
            {stats?.topProducts.length ? (
              stats.topProducts.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-3 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-elevated">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <ShoppingBag className="m-3 text-muted" size={24} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{item.name}</p>
                      <p className="text-xs text-muted">
                        {n(item.quantity)} {text.items} - {money(item.totalSpent)}
                      </p>
                    </div>
                  </div>
                  <Badge tone="muted">{item.category || text.productFallback}</Badge>
                </div>
              ))
            ) : (
              <p className="p-5 text-sm text-muted">
                {text.noPaidStats}
              </p>
            )}
          </div>
        </Card>

        <Card className="p-0">
          <div className="border-b border-line p-5">
            <h3 className="text-xl font-bold">{text.categorySummary}</h3>
            <p className="mt-1 text-sm text-muted">
              {text.categoryHelp}
            </p>
          </div>
          <div className="space-y-3 p-5">
            {stats?.categoryBreakdown.length ? (
              stats.categoryBreakdown.slice(0, 6).map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold">{item.category}</span>
                    <span className="text-gold-light">
                      {money(item.totalSpent)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {n(item.count)} {text.orders} - {n(item.quantity)} {text.items}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">
                {text.noCategory}
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-0">
        <div className="flex flex-col gap-4 border-b border-line p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="text-2xl font-bold">{text.listTitle}</h3>
            <p className="mt-1 text-sm text-muted">
              {text.listHelp}
            </p>
          </div>
          <form
            onSubmit={handleSearch}
            className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_11rem_auto]"
          >
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={17}
              />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={text.searchPlaceholder}
                className="h-11 rounded-lg pl-9"
              />
            </div>
            <Select
              value={status}
              onChange={(event) => handleStatusChange(event.target.value)}
              className="h-11 rounded-lg"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <div className="flex gap-2">
              <Button type="submit" className="min-h-11 flex-1 px-4">
                {text.search}
              </Button>
              {search ? (
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 px-3"
                  onClick={clearSearch}
                  aria-label={text.clearSearch}
                >
                  <XCircle size={16} />
                </Button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="overflow-x-auto scrollbar-soft">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-elevated text-muted">
              <tr>
                {[
                  text.product,
                  text.orderId,
                  text.date,
                  text.quantity,
                  text.amount,
                  text.payment,
                  text.status,
                ].map((head) => (
                  <th key={head} className="px-5 py-4">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-5 py-10 text-center text-muted" colSpan={7}>
                    {text.loading}
                  </td>
                </tr>
              ) : items.length ? (
                items.map((item) => {
                  const statusInfo = purchaseStatus(item, language);
                  return (
                    <tr
                      key={item.id}
                      className={cn(
                        "border-t border-line",
                        isFetching && "opacity-70",
                      )}
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-elevated">
                            {item.product?.image ? (
                              <Image
                                src={item.product.image}
                                alt={productName(item)}
                                fill
                                sizes="48px"
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <ShoppingBag
                                className="m-3 text-muted"
                                size={24}
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-bold">
                              {productName(item)}
                            </p>
                            <p className="text-xs text-muted">
                              {item.product?.sku ?? item.productId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-muted">
                        {item.id}
                      </td>
                      <td className="px-5 py-4">{formatDate(item.createdAt, language)}</td>
                      <td className="px-5 py-4">{n(item.quantity)}</td>
                      <td className="px-5 py-4 font-bold text-gold-light">
                        {money(item.total)}
                      </td>
                      <td className="px-5 py-4">
                        <p>{item.paymentProvider || item.paymentMethod}</p>
                        <p className="mt-1 font-mono text-xs text-muted">
                          {item.paymentTransactionId ||
                            item.paymentGatewayTransactionId ||
                            "-"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge tone={statusInfo.tone}>{statusInfo.label}</Badge>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-5 py-10 text-center text-muted" colSpan={7}>
                    {text.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-line p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {text.page} {n(page)} {text.of} {n(totalPages)}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft size={16} />
              {text.previous}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            >
              {text.next}
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
