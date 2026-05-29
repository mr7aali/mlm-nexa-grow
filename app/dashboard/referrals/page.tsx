"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge, Card, Input, Modal, Select } from "@/components/ui";
import { referrals } from "@/lib/mock-data";
import { useGetReferralsQuery } from "@/lib/api";
import type { Referral } from "@/lib/api-types";
import { taka, toBn } from "@/lib/utils";

const pageSize = 10;

export default function ReferralsPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Referral | null>(null);
  const { data } = useGetReferralsQuery();
  const referralRows = data?.rows ?? referrals;

  const filtered = useMemo(() => {
    return referralRows.filter((item) => {
      const search = `${item.name} ${item.phone}`.toLowerCase().includes(query.toLowerCase());
      const byLevel = level === "all" || String(item.level) === level;
      const byStatus = status === "all" || item.status === status;
      return search && byLevel && byStatus;
    });
  }, [query, level, status, referralRows]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">সদস্য তালিকা</p>
        <h2 className="heading-gradient text-4xl font-black">রেফারেল বিস্তারিত</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          ["ডাইরেক্ট রেফারেল", "১৮"],
          ["মোট নেটওয়ার্ক", "৪২"],
          ["এই মাসের নতুন", "১১"],
        ].map(([label, value]) => (
          <Card key={label}><p className="text-sm text-muted">{label}</p><p className="mt-2 text-3xl font-black text-gold-light">{value}</p></Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_150px_160px_180px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="নাম বা ফোন খুঁজুন" className="pl-10" />
          </div>
          <Select value={level} onChange={(e) => { setLevel(e.target.value); setPage(1); }}>
            <option value="all">সব লেভেল</option>
            {[1, 2, 3, 4, 5, 6].map((item) => <option key={item} value={item}>লেভেল {toBn(item)}</option>)}
          </Select>
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="all">সব স্ট্যাটাস</option>
            <option value="Active">সক্রিয়</option>
            <option value="Inactive">নিষ্ক্রিয়</option>
          </Select>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </Card>

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>
              {["নাম", "ফোন", "লেভেল", "যোগদান", "নিজস্ব রেফারেল", "স্ট্যাটাস", "কমিশন"].map((head) => <th key={head} className="px-5 py-4">{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} onClick={() => setSelected(item)} className="cursor-pointer border-t border-line hover:bg-gold/10">
                <td className="px-5 py-4 font-semibold">{item.name}</td>
                <td className="px-5 py-4 text-muted">{item.phone}</td>
                <td className="px-5 py-4">লেভেল {toBn(item.level)}</td>
                <td className="px-5 py-4 text-muted">{item.joinDate}</td>
                <td className="px-5 py-4">{toBn(item.referralCount)}</td>
                <td className="px-5 py-4"><Badge tone={item.status === "Active" ? "green" : "muted"}>{item.status === "Active" ? "সক্রিয়" : "নিষ্ক্রিয়"}</Badge></td>
                <td className="px-5 py-4 text-gold-light">{taka(item.commissionEarned)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">পৃষ্ঠা {toBn(page)} / {toBn(totalPages)}</p>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage((old) => Math.max(1, old - 1))} className="outline-gold px-4 py-2 disabled:opacity-40">আগের</button>
          <button disabled={page === totalPages} onClick={() => setPage((old) => Math.min(totalPages, old + 1))} className="gold-button px-4 py-2 disabled:opacity-40">পরের</button>
        </div>
      </div>

      <Modal open={Boolean(selected)} title="সদস্য প্রোফাইল" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gold/10 text-2xl text-gold-light">{selected.name[0]}</div>
              <div>
                <h3 className="text-2xl font-bold">{selected.name}</h3>
                <p className="text-muted">{selected.phone}</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Card><p className="text-sm text-muted">ডাউনলাইন</p><p className="text-2xl font-black text-gold-light">{toBn(selected.downline)}</p></Card>
              <Card><p className="text-sm text-muted">কমিশন</p><p className="text-2xl font-black text-gold-light">{taka(selected.commissionEarned)}</p></Card>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
