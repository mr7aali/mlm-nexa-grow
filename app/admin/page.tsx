"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { Badge, Button, Card, Input, Select, Textarea } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useBroadcastNotificationMutation,
  useCreditAdminCommissionMutation,
  useGetAdminUsersQuery,
  useGetAdminWithdrawalsQuery,
  useUpdateAdminUserStatusMutation,
  useUpdateAdminWithdrawalStatusMutation,
} from "@/lib/api";
import type { AdminUser } from "@/lib/api-types";
import { useAppSelector } from "@/lib/hooks";
import { taka, toBn } from "@/lib/utils";

const creditSchema = z.object({
  user: z.string().min(1, "Select a member"),
  amount: z.string().min(1, "Enter an amount"),
  note: z.string().min(3, "Enter a note"),
});

const broadcastSchema = z.object({
  message: z.string().min(5, "Enter a message"),
});

export default function AdminPage() {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [notice, setNotice] = useState("");
  const { data: usersPage, isLoading: usersLoading, error: usersError } = useGetAdminUsersQuery({ page: 1, limit: 100 }, { skip: !accessToken });
  const { data: withdrawals = [], isLoading: withdrawalsLoading } = useGetAdminWithdrawalsQuery(undefined, { skip: !accessToken });
  const [updateUserStatus] = useUpdateAdminUserStatusMutation();
  const [creditCommission, { isLoading: crediting }] = useCreditAdminCommissionMutation();
  const [broadcast, { isLoading: broadcasting }] = useBroadcastNotificationMutation();
  const [updateWithdrawalStatus] = useUpdateAdminWithdrawalStatusMutation();
  const credit = useForm<z.infer<typeof creditSchema>>({
    resolver: zodResolver(creditSchema),
    defaultValues: { user: "", amount: "", note: "" },
  });
  const broadcastForm = useForm<z.infer<typeof broadcastSchema>>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: { message: "" },
  });
  const users = useMemo(() => usersPage?.items ?? [], [usersPage]);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  useEffect(() => {
    if (users.length && !credit.getValues("user")) {
      credit.reset({ user: users[0].id, amount: "", note: "" });
    }
  }, [credit, users]);

  const filtered = useMemo(() => users.filter((user) => {
    const bySearch = `${user.name} ${user.email} ${user.phone}`.toLowerCase().includes(query.toLowerCase());
    const byLevel = level === "all" || String(user.level) === level;
    return bySearch && byLevel;
  }), [query, level, users]);

  const totalPaid = users.reduce((sum, user) => sum + user.earned, 0);
  const activeThisMonth = users.filter((user) => {
    const joined = new Date(user.joined);
    const now = new Date();
    return Number.isFinite(joined.getTime()) && joined.getMonth() === now.getMonth() && joined.getFullYear() === now.getFullYear();
  }).length;

  async function handleStatus(user: AdminUser) {
    const status = user.status === "Banned" ? "Active" : "Banned";
    try {
      await updateUserStatus({ userId: user.id, status }).unwrap();
      setNotice(`${user.name} status updated.`);
    } catch (error) {
      setNotice(getApiErrorMessage(error, "Status update failed"));
    }
  }

  async function handleCredit(values: z.infer<typeof creditSchema>) {
    try {
      const amount = Number(values.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        setNotice("Enter a positive amount.");
        return;
      }
      await creditCommission({ ...values, amount }).unwrap();
      setNotice("Commission credited.");
      credit.reset({ user: values.user, amount: "", note: "" });
    } catch (error) {
      setNotice(getApiErrorMessage(error, "Commission credit failed"));
    }
  }

  async function handleBroadcast(values: z.infer<typeof broadcastSchema>) {
    try {
      await broadcast(values).unwrap();
      setNotice("Broadcast sent.");
      broadcastForm.reset();
    } catch (error) {
      setNotice(getApiErrorMessage(error, "Broadcast failed"));
    }
  }

  async function handleWithdrawal(withdrawalId: string, status: "Paid" | "Rejected") {
    try {
      await updateWithdrawalStatus({ withdrawalId, status }).unwrap();
      setNotice(`Withdrawal marked ${status}.`);
    } catch (error) {
      setNotice(getApiErrorMessage(error, "Withdrawal update failed"));
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-[24px] border border-gold bg-sidebar p-5 text-white md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-elevated text-gold"><ShieldCheck /></span>
            <div>
              <p className="text-sm text-white/80">Live backend management</p>
              <h1 className="heading-gradient text-4xl font-black !text-white">Admin Panel</h1>
            </div>
          </div>
          <Link href="/dashboard" className="rounded-full bg-elevated px-5 py-2.5 text-center font-semibold text-gold transition hover:bg-elevated/90">Member dashboard</Link>
        </header>

        {usersError ? <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{getApiErrorMessage(usersError, "Admin access failed")}</p> : null}
        {notice ? <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{notice}</p> : null}

        <div className="grid gap-5 md:grid-cols-3">
          <Card><p className="text-muted">Total users</p><p className="mt-2 text-3xl font-black text-gold-light">{toBn(users.length)}</p></Card>
          <Card><p className="text-muted">Credited commission</p><p className="mt-2 text-3xl font-black text-gold-light">{taka(totalPaid)}</p></Card>
          <Card><p className="text-muted">Joined this month</p><p className="mt-2 text-3xl font-black text-gold-light">{toBn(activeThisMonth)}</p></Card>
        </div>

        <Card className="p-5">
          <h2 className="mb-4 text-2xl font-bold">User management</h2>
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px]">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, or phone" />
            <Select value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="all">All levels</option>
              {[1, 2, 3, 4, 5, 6].map((item) => <option key={item} value={item}>Level {toBn(item)}</option>)}
            </Select>
          </div>
          <div className="overflow-x-auto scrollbar-soft">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-elevated text-muted">
                <tr>{["Name", "Email", "Phone", "Level", "Status", "Earned", "Action"].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.length ? filtered.map((user) => (
                  <tr key={user.id} className="border-t border-line">
                    <td className="px-4 py-3 font-semibold">{user.name}</td>
                    <td className="px-4 py-3 text-muted">{user.email}</td>
                    <td className="px-4 py-3 text-muted">{user.phone}</td>
                    <td className="px-4 py-3">Level {toBn(user.level)}</td>
                    <td className="px-4 py-3"><Badge tone={user.status === "Active" ? "green" : user.status === "Banned" ? "red" : "muted"}>{user.status}</Badge></td>
                    <td className="px-4 py-3 text-gold-light">{taka(user.earned)}</td>
                    <td className="px-4 py-3"><Button variant="outline" className="min-h-9 px-3 py-1" onClick={() => handleStatus(user)}>{user.status === "Banned" ? "Unban" : "Ban"}</Button></td>
                  </tr>
                )) : (
                  <tr>
                    <td className="px-4 py-8 text-center text-muted" colSpan={7}>{usersLoading ? "Loading users..." : "No users found."}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-4 text-2xl font-bold">Withdrawal approvals</h2>
            <div className="space-y-3">
              {withdrawals.length ? withdrawals.map((item) => (
                <div key={item.id} className="rounded-2xl border border-line bg-elevated p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold">{item.method} - {taka(item.amount)}</p>
                      <p className="text-sm text-muted">{item.date} - {item.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button className="min-h-9 px-3 py-1" onClick={() => handleWithdrawal(item.id, "Paid")}>Approve</Button>
                      <Button variant="danger" className="min-h-9 px-3 py-1" onClick={() => handleWithdrawal(item.id, "Rejected")}>Reject</Button>
                    </div>
                  </div>
                  {item.account ? <p className="mt-3 text-sm text-muted">Account: {item.account}</p> : null}
                </div>
              )) : <p className="text-sm text-muted">{withdrawalsLoading ? "Loading withdrawals..." : "No withdrawals yet."}</p>}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-5">
              <h2 className="mb-4 text-2xl font-bold">Manual commission credit</h2>
              <form className="space-y-3" onSubmit={credit.handleSubmit(handleCredit)}>
                <Select {...credit.register("user")}>
                  {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
                </Select>
                <Input type="number" {...credit.register("amount")} placeholder="Amount" />
                <Input {...credit.register("note")} placeholder="Note" />
                <Button type="submit" disabled={crediting || !users.length}>Credit</Button>
              </form>
            </Card>
            <Card className="p-5">
              <h2 className="mb-4 text-2xl font-bold">Broadcast notification</h2>
              <form className="space-y-3" onSubmit={broadcastForm.handleSubmit(handleBroadcast)}>
                <Textarea {...broadcastForm.register("message")} placeholder="Message for members" />
                <Button type="submit" disabled={broadcasting}>Send</Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
