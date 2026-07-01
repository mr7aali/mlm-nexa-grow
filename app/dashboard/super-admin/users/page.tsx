"use client";

import { useMemo, useState } from "react";
import { Download, Search, ShieldCheck, Users } from "lucide-react";
import { Button, Card, Input, Select } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useGetAdminUsersQuery,
  useUpdateAdminUserRoleMutation,
} from "@/lib/api";
import type { AdminUser, Role } from "@/lib/api-types";
import { taka, toBn } from "@/lib/utils";

const pageSize = 10;
type RoleFilter = "all" | Role;

function roleLabel(value: Role) {
  if (value === "super-admin") return "Super admin";
  if (value === "admin") return "Admin";
  return "Member";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function SuperAdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [message, setMessage] = useState("");
  const query = useMemo(
    () => ({
      page,
      limit: pageSize,
      search: search.trim() || undefined,
      role: role === "all" ? undefined : role,
    }),
    [page, role, search],
  );
  const { data, isLoading, error } = useGetAdminUsersQuery(query);
  const [updateRole, { isLoading: roleSaving }] =
    useUpdateAdminUserRoleMutation();
  const users = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPageBalance = users.reduce(
    (sum, user) => sum + (user.currentBalance ?? user.earned),
    0,
  );

  async function handleRole(user: AdminUser, nextRole: Role) {
    setMessage("");
    try {
      await updateRole({ userId: user.id, role: nextRole }).unwrap();
      setMessage("রোল আপডেট হয়েছে।");
    } catch (err) {
      setMessage(getApiErrorMessage(err, "রোল আপডেট ব্যর্থ হয়েছে"));
    }
  }

  function handleExportPdf() {
    const generatedAt = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
    const rows = users.length
      ? users
          .map(
            (user, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(user.id)}</td>
                <td>${escapeHtml(user.name)}</td>
                <td>${escapeHtml(user.email)}</td>
                <td>${escapeHtml(user.phone)}</td>
                <td>${escapeHtml(user.referralCode)}</td>
                <td>${user.level}</td>
                <td>${escapeHtml(roleLabel(user.role))}</td>
                <td>${escapeHtml(taka(user.earned))}</td>
                <td>${escapeHtml(taka(user.currentBalance ?? user.earned))}</td>
                <td>${escapeHtml(formatDate(user.joined))}</td>
              </tr>
            `,
          )
          .join("")
      : `<tr><td colspan="11" class="empty">No users found.</td></tr>`;
    const report = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>User Management Report</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 30px; color: #1f1f1f; font-family: Arial, sans-serif; }
            .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #c69b2f; padding-bottom: 16px; }
            h1 { margin: 0; font-size: 25px; }
            .brand { color: #9c741c; font-weight: 700; letter-spacing: 0.04em; }
            .muted { color: #666; font-size: 12px; line-height: 1.6; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 22px 0; }
            .card { border: 1px solid #e6dfcf; border-radius: 10px; padding: 12px; background: #fbfaf6; }
            .label { color: #666; font-size: 11px; margin-bottom: 6px; }
            .value { font-size: 16px; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 11px; }
            th { background: #f3eddc; color: #4b3b1d; text-align: left; }
            th, td { border: 1px solid #e2dccf; padding: 8px; vertical-align: top; }
            .empty { text-align: center; color: #777; padding: 24px; }
            .footer { margin-top: 20px; color: #777; font-size: 11px; }
            @media print { body { padding: 18px; } }
          </style>
        </head>
        <body>
          <section class="header">
            <div>
              <div class="brand">GIOTO Bangladesh</div>
              <h1>User Management Report</h1>
              <div class="muted">Generated: ${escapeHtml(generatedAt)}</div>
            </div>
            <div class="muted">
              Super admin users<br />
              Current page export
            </div>
          </section>
          <section class="grid">
            <div class="card"><div class="label">Total users matching filter</div><div class="value">${data?.total ?? 0}</div></div>
            <div class="card"><div class="label">Users in this export</div><div class="value">${users.length}</div></div>
            <div class="card"><div class="label">Current page balance</div><div class="value">${escapeHtml(taka(currentPageBalance))}</div></div>
          </section>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Referral Code</th>
                <th>Level</th>
                <th>Role</th>
                <th>Total Earned</th>
                <th>Current Balance</th>
                <th>Join Date</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="footer">This PDF includes the currently loaded page and active search/role filter.</div>
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
          <p className="text-sm text-gold-light">সুপার অ্যাডমিন</p>
          <h2 className="heading-gradient text-4xl font-black">
            ইউজার ম্যানেজমেন্ট
          </h2>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-light">
            <ShieldCheck size={17} />
            মোট {toBn(data?.total ?? 0)} ইউজার
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleExportPdf}
            disabled={isLoading || !users.length}
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
          {getApiErrorMessage(error, "ইউজার লোড ব্যর্থ হয়েছে")}
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">মোট ইউজার</p>
          <p className="mt-2 text-3xl font-black text-gold-light">
            {toBn(data?.total ?? 0)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">এই পেজে</p>
          <p className="mt-2 text-3xl font-black text-gold-light">
            {toBn(users.length)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">মোট ব্যালেন্স</p>
          <p className="mt-2 text-3xl font-black text-gold-light">
            {taka(currentPageBalance)}
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
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
              placeholder="নাম, ইমেইল, ফোন বা রেফার কোড"
              className="pl-10"
            />
          </div>
          <Select
            value={role}
            onChange={(event) => {
              setRole(event.target.value as typeof role);
              setPage(1);
            }}
          >
            <option value="all">সব রোল</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="super-admin">Super admin</option>
          </Select>
        </div>
      </Card>

      <Card className="hidden overflow-x-auto p-0 scrollbar-soft md:block">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>
              {[
                "নাম",
                "ইমেইল",
                "ফোন",
                "রেফার কোড",
                "লেভেল",
                "মোট আয়",
                "বর্তমান ব্যালেন্স",
                "রোল",
              ].map((head) => (
                <th key={head} className="px-5 py-4">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((user) => (
                <tr key={user.id} className="border-t border-line">
                  <td className="px-5 py-4 font-semibold">{user.name}</td>
                  <td className="px-5 py-4 text-muted">{user.email}</td>
                  <td className="px-5 py-4 text-muted">{user.phone}</td>
                  <td className="px-5 py-4 text-gold-light">
                    {user.referralCode}
                  </td>
                  <td className="px-5 py-4">লেভেল {toBn(user.level)}</td>
                  <td className="px-5 py-4 text-gold-light">
                    {taka(user.earned)}
                  </td>
                  <td className="px-5 py-4 font-bold text-gold-light">
                    {taka(user.currentBalance ?? user.earned)}
                  </td>
                  <td className="px-5 py-4">
                    <Select
                      value={user.role}
                      onChange={(event) =>
                        handleRole(user, event.target.value as Role)
                      }
                      disabled={roleSaving}
                      className="h-10 min-w-36"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="super-admin">Super admin</option>
                    </Select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-10 text-center text-muted" colSpan={8}>
                  {isLoading
                    ? "ইউজার লোড হচ্ছে..."
                    : "কোনো ইউজার পাওয়া যায়নি।"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <div className="space-y-3 md:hidden">
        {isLoading ? (
          <Card className="p-4 text-sm text-muted">ইউজার লোড হচ্ছে...</Card>
        ) : users.length ? (
          users.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-black text-foreground">
                    {user.name}
                  </p>
                  <p className="mt-1 truncate text-sm text-muted">
                    {user.email}
                  </p>
                  <p className="mt-1 text-sm text-muted">{user.phone}</p>
                </div>
                <div className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-bold text-gold-light">
                  {roleLabel(user.role)}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg border border-line bg-elevated p-3">
                  <p className="text-xs text-muted">রেফার কোড</p>
                  <p className="mt-1 font-bold text-gold-light">
                    {user.referralCode}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-elevated p-3">
                  <p className="text-xs text-muted">লেভেল</p>
                  <p className="mt-1 font-bold">লেভেল {toBn(user.level)}</p>
                </div>
                <div className="rounded-lg border border-line bg-elevated p-3">
                  <p className="text-xs text-muted">মোট আয়</p>
                  <p className="mt-1 font-bold text-gold-light">
                    {taka(user.earned)}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-elevated p-3">
                  <p className="text-xs text-muted">ব্যালেন্স</p>
                  <p className="mt-1 font-bold text-gold-light">
                    {taka(user.currentBalance ?? user.earned)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold text-muted">রোল</p>
                <Select
                  value={user.role}
                  onChange={(event) =>
                    handleRole(user, event.target.value as Role)
                  }
                  disabled={roleSaving}
                  className="h-11"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super admin</option>
                </Select>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-5 text-center text-sm text-muted">
            <Users className="mx-auto mb-2 text-muted" size={22} />
            কোনো ইউজার পাওয়া যায়নি।
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          পৃষ্ঠা {toBn(data?.page ?? page)} / {toBn(totalPages)}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((old) => Math.max(1, old - 1))}
          >
            আগের
          </Button>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage((old) => Math.min(totalPages, old + 1))}
          >
            পরে
          </Button>
        </div>
      </div>
    </div>
  );
}
