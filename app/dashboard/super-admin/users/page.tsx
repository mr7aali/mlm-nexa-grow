"use client";

import { useMemo, useState } from "react";
import { Search, ShieldCheck, Users } from "lucide-react";
import { Button, Card, Input, Select } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { useGetAdminUsersQuery, useUpdateAdminUserRoleMutation, useUpdateAdminUserStatusMutation } from "@/lib/api";
import type { AdminUser, Role, UserStatus } from "@/lib/api-types";
import { taka, toBn } from "@/lib/utils";

const pageSize = 10;
type StatusFilter = "all" | UserStatus;
type RoleFilter = "all" | Role;

export default function SuperAdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [role, setRole] = useState<RoleFilter>("all");
  const [message, setMessage] = useState("");
  const query = useMemo(() => ({
    page,
    limit: pageSize,
    search: search.trim() || undefined,
    status: status === "all" ? undefined : status,
    role: role === "all" ? undefined : role,
  }), [page, role, search, status]);
  const { data, isLoading, error } = useGetAdminUsersQuery(query);
  const [updateStatus, { isLoading: statusSaving }] = useUpdateAdminUserStatusMutation();
  const [updateRole, { isLoading: roleSaving }] = useUpdateAdminUserRoleMutation();
  const users = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  async function handleStatus(user: AdminUser, nextStatus: UserStatus) {
    setMessage("");
    try {
      await updateStatus({ userId: user.id, status: nextStatus }).unwrap();
      setMessage("স্ট্যাটাস আপডেট হয়েছে।");
    } catch (err) {
      setMessage(getApiErrorMessage(err, "স্ট্যাটাস আপডেট ব্যর্থ হয়েছে"));
    }
  }

  async function handleRole(user: AdminUser, nextRole: Role) {
    setMessage("");
    try {
      await updateRole({ userId: user.id, role: nextRole }).unwrap();
      setMessage("রোল আপডেট হয়েছে।");
    } catch (err) {
      setMessage(getApiErrorMessage(err, "রোল আপডেট ব্যর্থ হয়েছে"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-gold-light">সুপার অ্যাডমিন</p>
          <h2 className="heading-gradient text-4xl font-black">ইউজার ম্যানেজমেন্ট</h2>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-light">
          <ShieldCheck size={17} />
          মোট {toBn(data?.total ?? 0)} ইউজার
        </div>
      </div>

      {message ? <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p> : null}
      {error ? <p className="rounded-2xl border border-foreground/20 bg-foreground/5 px-4 py-3 text-sm text-foreground">{getApiErrorMessage(error, "ইউজার লোড ব্যর্থ হয়েছে")}</p> : null}

      <div className="grid gap-5 md:grid-cols-3">
        <Card><p className="text-sm text-muted">মোট ইউজার</p><p className="mt-2 text-3xl font-black text-gold-light">{toBn(data?.total ?? 0)}</p></Card>
        <Card><p className="text-sm text-muted">এই পেজে</p><p className="mt-2 text-3xl font-black text-gold-light">{toBn(users.length)}</p></Card>
        <Card><p className="text-sm text-muted">মোট ব্যালেন্স</p><p className="mt-2 text-3xl font-black text-gold-light">{taka(users.reduce((sum, user) => sum + (user.currentBalance ?? user.earned), 0))}</p></Card>
      </div>

      <Card className="p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <Input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1); }}
              placeholder="নাম, ইমেইল, ফোন বা রেফার কোড"
              className="pl-10"
            />
          </div>
          <Select value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(1); }}>
            <option value="all">সব স্ট্যাটাস</option>
            <option value="Active">সক্রিয়</option>
            <option value="Inactive">নিষ্ক্রিয়</option>
            <option value="Banned">ব্যান</option>
          </Select>
          <Select value={role} onChange={(event) => { setRole(event.target.value as typeof role); setPage(1); }}>
            <option value="all">সব রোল</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="super-admin">Super admin</option>
          </Select>
        </div>
      </Card>

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <table className="w-full min-w-[1240px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>{["নাম", "ইমেইল", "ফোন", "রেফার কোড", "লেভেল", "মোট আয়", "বর্তমান ব্যালেন্স", "স্ট্যাটাস", "রোল"].map((head) => <th key={head} className="px-5 py-4">{head}</th>)}</tr>
          </thead>
          <tbody>
            {users.length ? users.map((user) => (
              <tr key={user.id} className="border-t border-line">
                <td className="px-5 py-4 font-semibold">{user.name}</td>
                <td className="px-5 py-4 text-muted">{user.email}</td>
                <td className="px-5 py-4 text-muted">{user.phone}</td>
                <td className="px-5 py-4 text-gold-light">{user.referralCode}</td>
                <td className="px-5 py-4">লেভেল {toBn(user.level)}</td>
                <td className="px-5 py-4 text-gold-light">{taka(user.earned)}</td>
                <td className="px-5 py-4 font-bold text-gold-light">{taka(user.currentBalance ?? user.earned)}</td>
                <td className="px-5 py-4">
                  <Select
                    value={user.status}
                    onChange={(event) => handleStatus(user, event.target.value as UserStatus)}
                    disabled={statusSaving}
                    className="h-10 min-w-32"
                  >
                    <option value="Active">সক্রিয়</option>
                    <option value="Inactive">নিষ্ক্রিয়</option>
                    <option value="Banned">ব্যান</option>
                  </Select>
                </td>
                <td className="px-5 py-4">
                  <Select
                    value={user.role}
                    onChange={(event) => handleRole(user, event.target.value as Role)}
                    disabled={roleSaving}
                    className="h-10 min-w-36"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super admin</option>
                  </Select>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="px-5 py-10 text-center text-muted" colSpan={9}>
                  {isLoading ? "ইউজার লোড হচ্ছে..." : "কোনো ইউজার পাওয়া যায়নি।"}
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

      <Card className="p-5 md:hidden">
        <div className="flex items-center gap-2 text-sm text-muted"><Users size={16} /> টেবিলটি মোবাইলে অনুভূমিকভাবে স্ক্রল করা যায়।</div>
      </Card>
    </div>
  );
}
