"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  Copy,
  Network,
  PackagePlus,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { Button, Card, CopyButton } from "@/components/ui";
import {
  useGetAdminOrdersQuery,
  useGetAdminPaymentsQuery,
  useGetAdminProductsQuery,
  useGetAdminUsersQuery,
  useGetDashboardQuery,
  useGetMeQuery,
} from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { taka, toBn } from "@/lib/utils";

export default function DashboardPage() {
  const { language } = useI18n();
  const [referralCopied, setReferralCopied] = useState(false);
  const { data: me, isLoading: meLoading } = useGetMeQuery();
  const isAdminRole = me?.role === "admin" || me?.role === "super-admin";
  const { data, isLoading } = useGetDashboardQuery(undefined, {
    skip: !me || isAdminRole,
  });
  const { data: usersPage } = useGetAdminUsersQuery(
    { page: 1, limit: 1 },
    { skip: !isAdminRole },
  );
  const { data: productsPage } = useGetAdminProductsQuery(
    { page: 1, limit: 1 },
    { skip: !isAdminRole },
  );
  const { data: paymentsPage } = useGetAdminPaymentsQuery(
    { page: 1, limit: 5 },
    { skip: !isAdminRole },
  );
  const { data: ordersPage } = useGetAdminOrdersQuery(
    { page: 1, limit: 5 },
    { skip: !isAdminRole },
  );

  if (meLoading || !me) {
    return <p className="text-sm text-muted">ড্যাশবোর্ড লোড হচ্ছে...</p>;
  }

  if (isAdminRole) {
    const payments = paymentsPage?.items ?? [];
    const orders = ordersPage?.items ?? [];
    const pendingPayments = payments.filter(
      (item) => item.status === "Pending",
    ).length;

    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-gold-light">
              {me.role === "super-admin"
                ? "সুপার অ্যাডমিন প্যানেল"
                : "অ্যাডমিন প্যানেল"}
            </p>
            <h2 className="heading-gradient text-4xl font-black">ড্যাশবোর্ড</h2>
          </div>
          <Link
            href="/dashboard/super-admin/payments"
            className="gold-button inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold"
          >
            <ReceiptText size={16} />
            পেমেন্ট ম্যানেজ করুন
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {[
            [
              Users,
              "মোট ইউজার",
              toBn(usersPage?.total ?? 0),
              "/dashboard/super-admin/users",
            ],
            [
              PackagePlus,
              "মোট পণ্য",
              toBn(productsPage?.total ?? 0),
              "/dashboard/super-admin/products",
            ],
            [
              ShoppingBag,
              "চেকআউট অর্ডার",
              toBn(ordersPage?.total ?? 0),
              "/dashboard/super-admin/orders",
            ],
            [
              ReceiptText,
              "ট্রানজ্যাকশন",
              toBn(paymentsPage?.total ?? 0),
              "/dashboard/super-admin/payments",
            ],
            [
              ShieldCheck,
              "পেন্ডিং পেমেন্ট",
              toBn(pendingPayments),
              "/dashboard/super-admin/payments",
            ],
          ].map(([Icon, label, value, href]) => {
            const TypedIcon = Icon as typeof Users;
            return (
              <Link key={String(label)} href={String(href)}>
                <Card className="min-h-full p-5 transition hover:border-gold">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted">{String(label)}</p>
                      <p className="mt-2 text-3xl font-black text-gold-light">
                        {String(value)}
                      </p>
                    </div>
                    <TypedIcon className="text-gold" size={32} />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-6">
            <h3 className="mb-4 text-2xl font-bold">দ্রুত অ্যাকশন</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard/super-admin/users"
                className="outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-gold/10"
              >
                <Users size={16} />
                ইউজার ম্যানেজ
              </Link>
              <Link
                href="/dashboard/super-admin/products"
                className="outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-gold/10"
              >
                <PackagePlus size={16} />
                পণ্য ম্যানেজ
              </Link>
              <Link
                href="/dashboard/super-admin/payments"
                className="outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-gold/10"
              >
                <ReceiptText size={16} />
                পেমেন্ট দেখুন
              </Link>
              <Link
                href="/dashboard/super-admin/orders"
                className="outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-gold/10"
              >
                <ShoppingBag size={16} />
                অর্ডার দেখুন
              </Link>
              <Link
                href="/dashboard/profile"
                className="outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-gold/10"
              >
                <ShieldCheck size={16} />
                প্রোফাইল
              </Link>
            </div>
          </Card>

          <Card className="overflow-x-auto p-0 scrollbar-soft">
            <div className="p-5">
              <h3 className="text-2xl font-bold">সাম্প্রতিক অর্ডার</h3>
            </div>
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-elevated text-muted">
                <tr>
                  {["অর্ডার", "ইউজার", "পণ্য", "মোট", "স্ট্যাটাস"].map(
                    (head) => (
                      <th key={head} className="px-5 py-4">
                        {head}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.length ? (
                  orders.map((item) => (
                    <tr key={item.id} className="border-t border-line">
                      <td className="px-5 py-4 font-semibold">{item.id}</td>
                      <td className="px-5 py-4">
                        {item.user?.name ?? item.customerName}
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {item.product?.name ?? item.productId}
                      </td>
                      <td className="px-5 py-4 text-gold-light">
                        {taka(item.total)}
                      </td>
                      <td className="px-5 py-4">{item.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-5 py-8 text-center text-muted"
                      colSpan={5}
                    >
                      কোনো অর্ডার রেকর্ড নেই।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>

          <Card className="overflow-x-auto p-0 scrollbar-soft">
            <div className="p-5">
              <h3 className="text-2xl font-bold">সাম্প্রতিক পেমেন্ট</h3>
            </div>
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-elevated text-muted">
                <tr>
                  {["ইউজার", "পরিমাণ", "মেথড", "স্ট্যাটাস"].map((head) => (
                    <th key={head} className="px-5 py-4">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.length ? (
                  payments.map((item) => (
                    <tr key={item.id} className="border-t border-line">
                      <td className="px-5 py-4 font-semibold">
                        {item.user?.name ?? item.userId}
                      </td>
                      <td className="px-5 py-4 text-gold-light">
                        {taka(item.amount)}
                      </td>
                      <td className="px-5 py-4 text-muted">{item.method}</td>
                      <td className="px-5 py-4">{item.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-5 py-8 text-center text-muted"
                      colSpan={4}
                    >
                      কোনো পেমেন্ট রেকর্ড নেই।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }

  const stats = data?.stats ?? {
    totalReferrals: 0,
    productPurchases: 0,
    currentLevel: 1,
    totalEarned: 0,
    pendingCommission: 0,
    totalNetwork: 0,
    activeMembers: 0,
  };
  const referralCode = data?.user.referralCode ?? "";
  const copyButtonText =
    language === "bn"
      ? referralCopied
        ? "কপি হয়েছে"
        : "এক ক্লিকে কপি"
      : referralCopied
        ? "Copied"
        : "Copy in one click";

  async function handleReferralCopy() {
    if (!referralCode || !navigator.clipboard) return;

    await navigator.clipboard.writeText(referralCode);
    setReferralCopied(true);
    window.setTimeout(() => setReferralCopied(false), 1800);
  }

  function formatActivityTime(value: string) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return value;

    return new Intl.DateTimeFormat("bn-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-gold-light">সদস্য প্যানেল</p>
          <h2 className="heading-gradient text-4xl font-black">ড্যাশবোর্ড</h2>
        </div>
        {/* <CopyButton value={referralCode} label="রেফার কোড কপি" /> */}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">ডেটা লোড হচ্ছে...</p>
      ) : null}

      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-5 xl:grid-cols-4">
        {[
          [Network, "মোট রেফারেল", toBn(stats.totalReferrals)],
          [Sparkles, "যোগ্য পণ্য ক্রয়", toBn(stats.productPurchases)],
          [WalletCards, "মোট আয়", taka(stats.totalEarned)],
          [TrendingUp, "পেন্ডিং কমিশন", taka(stats.pendingCommission)],
        ].map(([Icon, label, value]) => {
          const TypedIcon = Icon as typeof Network;
          return (
            <Card key={String(label)} className="!p-2.5 sm:p-3 md:p-5">
              <div className="flex min-h-12 items-center justify-between gap-2 sm:min-h-14 md:min-h-0">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold leading-tight text-muted sm:text-xs md:text-sm md:font-normal">
                    {String(label)}
                  </p>
                  <p className="mt-0.5 truncate text-base font-black leading-tight text-gold-light sm:text-lg md:mt-2 md:text-3xl">
                    {String(value)}
                  </p>
                </div>
                <TypedIcon
                  className="shrink-0 text-gold"
                  size={20}
                  strokeWidth={2.2}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <h3 className="text-2xl font-bold">দ্রুত রেফার কোড</h3>
          <p className="mt-2 text-sm leading-7 text-muted">
            এই কোড কপি করে নতুন সদস্যকে পণ্য চেকআউটে রেফার কোড হিসেবে দিতে বলুন।
          </p>
          <div className="mt-4 break-all rounded-2xl border border-line bg-elevated p-4 text-3xl font-black tracking-[0.28em] text-gold-light">
            {referralCode || "কোড লোড হচ্ছে..."}
          </div>
          <Button
            className="mt-4 w-full"
            onClick={handleReferralCopy}
            disabled={!referralCode}
          >
            {referralCopied ? <Check size={16} /> : <Copy size={16} />}
            {copyButtonText}
          </Button>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">নোটিফিকেশন</h3>
          <div className="space-y-3">
            {data?.notifications.length ? (
              data.notifications.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-line bg-elevated/80 px-4 py-3 text-sm text-muted"
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-line bg-elevated/80 px-4 py-3 text-sm text-muted">
                কোনো নোটিফিকেশন নেই
              </div>
            )}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">সাম্প্রতিক কার্যক্রম</h3>
          <div className="space-y-3">
            {data?.activities.length ? (
              data.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-elevated/80 px-4 py-3"
                >
                  <span className="text-sm">{activity.text}</span>
                  <span className="shrink-0 text-xs text-muted">
                    {formatActivityTime(activity.time)}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-line bg-elevated/80 px-4 py-3 text-sm text-muted">
                কোনো কার্যক্রম নেই
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
