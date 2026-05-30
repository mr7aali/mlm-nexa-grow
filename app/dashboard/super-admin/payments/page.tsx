"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CreditCard, Search, XCircle } from "lucide-react";
import { Button, Card, Input, Select } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { useGetAdminPaymentsQuery, useUpdateAdminWithdrawalStatusMutation } from "@/lib/api";
import type { AdminWithdrawal } from "@/lib/api-types";
import { taka, toBn } from "@/lib/utils";

const pageSize = 10;
type PaymentStatus = "all" | AdminWithdrawal["status"];

export default function SuperAdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("all");
  const [method, setMethod] = useState("");
  const [message, setMessage] = useState("");
  const query = useMemo(() => ({
    page,
    limit: pageSize,
    search: search.trim() || undefined,
    status: status === "all" ? undefined : status,
    method: method.trim() || undefined,
  }), [method, page, search, status]);
  const { data, isLoading, error } = useGetAdminPaymentsQuery(query);
  const [updatePayment, { isLoading: updating }] = useUpdateAdminWithdrawalStatusMutation();
  const payments = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  async function handleStatus(withdrawalId: string, nextStatus: AdminWithdrawal["status"]) {
    setMessage("");
    try {
      await updatePayment({ withdrawalId, status: nextStatus }).unwrap();
      setMessage("পেমেন্ট স্ট্যাটাস আপডেট হয়েছে।");
    } catch (err) {
      setMessage(getApiErrorMessage(err, "পেমেন্ট আপডেট ব্যর্থ হয়েছে"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-gold-light">সুপার অ্যাডমিন</p>
          <h2 className="heading-gradient text-4xl font-black">পেমেন্ট ও ট্রানজ্যাকশন</h2>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-light">
          <CreditCard size={17} />
          মোট {toBn(data?.total ?? 0)} ট্রানজ্যাকশন
        </div>
      </div>

      {message ? <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p> : null}
      {error ? <p className="rounded-2xl border border-foreground/20 bg-foreground/5 px-4 py-3 text-sm text-foreground">{getApiErrorMessage(error, "পেমেন্ট লোড ব্যর্থ হয়েছে")}</p> : null}

      <div className="grid gap-5 md:grid-cols-4">
        <Card><p className="text-sm text-muted">এই পেজের মোট</p><p className="mt-2 text-3xl font-black text-gold-light">{taka(payments.reduce((sum, item) => sum + item.amount, 0))}</p></Card>
        <Card><p className="text-sm text-muted">পেন্ডিং</p><p className="mt-2 text-3xl font-black text-gold-light">{toBn(payments.filter((item) => item.status === "Pending").length)}</p></Card>
        <Card><p className="text-sm text-muted">পেইড</p><p className="mt-2 text-3xl font-black text-gold-light">{toBn(payments.filter((item) => item.status === "Paid").length)}</p></Card>
        <Card><p className="text-sm text-muted">রিজেক্টেড</p><p className="mt-2 text-3xl font-black text-gold-light">{toBn(payments.filter((item) => item.status === "Rejected").length)}</p></Card>
      </div>

      <Card className="p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <Input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1); }}
              placeholder="নাম, ইমেইল, ফোন, অ্যাকাউন্ট বা ট্রানজ্যাকশন ID"
              className="pl-10"
            />
          </div>
          <Select value={status} onChange={(event) => { setStatus(event.target.value as PaymentStatus); setPage(1); }}>
            <option value="all">সব স্ট্যাটাস</option>
            <option value="Pending">Pending</option>
            <option value="Review">Review</option>
            <option value="Paid">Paid</option>
            <option value="Rejected">Rejected</option>
          </Select>
          <Input value={method} onChange={(event) => { setMethod(event.target.value); setPage(1); }} placeholder="মেথড" />
        </div>
      </Card>

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>{["তারিখ", "ইউজার", "অ্যাকাউন্ট", "মেথড", "পরিমাণ", "বর্তমান ব্যালেন্স", "স্ট্যাটাস", "অ্যাকশন"].map((head) => <th key={head} className="px-5 py-4">{head}</th>)}</tr>
          </thead>
          <tbody>
            {payments.length ? payments.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-5 py-4 text-muted">{item.date}</td>
                <td className="px-5 py-4">
                  <p className="font-semibold">{item.user?.name ?? item.userId}</p>
                  <p className="text-xs text-muted">{item.user?.email ?? "User not found"}</p>
                </td>
                <td className="px-5 py-4 text-muted">{item.account}</td>
                <td className="px-5 py-4">{item.method}</td>
                <td className="px-5 py-4 font-bold text-gold-light">{taka(item.amount)}</td>
                <td className="px-5 py-4 text-gold-light">{taka(item.user?.currentBalance ?? 0)}</td>
                <td className="px-5 py-4">{item.status}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button className="min-h-9 px-3 py-1 text-xs" disabled={updating} onClick={() => handleStatus(item.id, "Paid")}>
                      <CheckCircle2 size={14} />
                      Paid
                    </Button>
                    <Button variant="outline" className="min-h-9 px-3 py-1 text-xs" disabled={updating} onClick={() => handleStatus(item.id, "Review")}>Review</Button>
                    <Button variant="danger" className="min-h-9 px-3 py-1 text-xs" disabled={updating} onClick={() => handleStatus(item.id, "Rejected")}>
                      <XCircle size={14} />
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="px-5 py-10 text-center text-muted" colSpan={8}>
                  {isLoading ? "পেমেন্ট লোড হচ্ছে..." : "কোনো ট্রানজ্যাকশন পাওয়া যায়নি।"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">পৃষ্ঠা {toBn(data?.page ?? page)} / {toBn(totalPages)}</p>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((old) => Math.max(1, old - 1))}>আগের</Button>
          <Button disabled={page >= totalPages} onClick={() => setPage((old) => Math.min(totalPages, old + 1))}>পরের</Button>
        </div>
      </div>
    </div>
  );
}
