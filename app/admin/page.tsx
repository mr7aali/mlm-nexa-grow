"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { Badge, Button, Card, Input, Select, Textarea } from "@/components/ui";
import { users, withdrawals } from "@/lib/mock-data";
import { taka, toBn } from "@/lib/utils";

const creditSchema = z.object({
  user: z.string().min(1, "সদস্য নির্বাচন করুন"),
  amount: z.string().min(1, "পরিমাণ লিখুন"),
  note: z.string().min(3, "নোট লিখুন"),
});

const broadcastSchema = z.object({
  message: z.string().min(5, "বার্তা লিখুন"),
});

export default function AdminPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [notice, setNotice] = useState("");
  const credit = useForm<z.infer<typeof creditSchema>>({ resolver: zodResolver(creditSchema), defaultValues: { user: users[0].id } });
  const broadcast = useForm<z.infer<typeof broadcastSchema>>({ resolver: zodResolver(broadcastSchema) });

  const filtered = useMemo(() => users.filter((user) => {
    const bySearch = `${user.name} ${user.phone}`.toLowerCase().includes(query.toLowerCase());
    const byLevel = level === "all" || String(user.level) === level;
    return bySearch && byLevel;
  }), [query, level]);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-[24px] border border-gold bg-sidebar p-5 text-white md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-elevated text-gold"><ShieldCheck /></span>
            <div>
              <p className="text-sm text-white/80">Protected-looking UI</p>
              <h1 className="heading-gradient text-4xl font-black !text-white">অ্যাডমিন প্যানেল</h1>
            </div>
          </div>
          <Link href="/dashboard" className="rounded-full bg-elevated px-5 py-2.5 text-center font-semibold text-gold transition hover:bg-elevated/90">সদস্য ড্যাশবোর্ড</Link>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          <Card><p className="text-muted">মোট ইউজার</p><p className="mt-2 text-3xl font-black text-gold-light">{toBn(12480)}</p></Card>
          <Card><p className="text-muted">মোট কমিশন পেইড</p><p className="mt-2 text-3xl font-black text-gold-light">{taka(742000)}</p></Card>
          <Card><p className="text-muted">এই মাসে সক্রিয়</p><p className="mt-2 text-3xl font-black text-gold-light">{toBn(890)}</p></Card>
        </div>

        <Card className="p-5">
          <h2 className="mb-4 text-2xl font-bold">ইউজার ম্যানেজমেন্ট</h2>
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px]">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="নাম বা ফোন খুঁজুন" />
            <Select value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="all">সব লেভেল</option>
              {[1, 2, 3, 4, 5, 6].map((item) => <option key={item} value={item}>লেভেল {toBn(item)}</option>)}
            </Select>
          </div>
          <div className="overflow-x-auto scrollbar-soft">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-elevated text-muted"><tr>{["নাম", "ফোন", "লেভেল", "স্ট্যাটাস", "আয়", "অ্যাকশন"].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr></thead>
              <tbody>{filtered.map((user) => <tr key={user.id} className="border-t border-line"><td className="px-4 py-3 font-semibold">{user.name}</td><td className="px-4 py-3 text-muted">{user.phone}</td><td className="px-4 py-3">লেভেল {toBn(user.level)}</td><td className="px-4 py-3"><Badge tone={user.status === "Active" ? "green" : user.status === "Banned" ? "red" : "muted"}>{user.status === "Active" ? "সক্রিয়" : user.status === "Banned" ? "ব্যান" : "নিষ্ক্রিয়"}</Badge></td><td className="px-4 py-3 text-gold-light">{taka(user.earned)}</td><td className="px-4 py-3"><Button variant="outline" className="min-h-9 px-3 py-1">{user.status === "Banned" ? "আনব্যান" : "ব্যান"}</Button></td></tr>)}</tbody>
            </table>
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="p-5">
            <h2 className="mb-4 text-2xl font-bold">উইথড্র অনুমোদন</h2>
            <div className="space-y-3">
              {withdrawals.map((item) => (
                <div key={item.id} className="rounded-2xl border border-line bg-elevated p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><p className="font-bold">{item.method} · {taka(item.amount)}</p><p className="text-sm text-muted">{item.date}</p></div>
                    <div className="flex gap-2"><Button className="min-h-9 px-3 py-1">Approve</Button><Button variant="danger" className="min-h-9 px-3 py-1">Reject</Button></div>
                  </div>
                  <Input className="mt-3" placeholder="নোট লিখুন" />
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-5">
              <h2 className="mb-4 text-2xl font-bold">ম্যানুয়াল কমিশন ক্রেডিট</h2>
              <form className="space-y-3" onSubmit={credit.handleSubmit(() => { setNotice("কমিশন ক্রেডিট UI সম্পন্ন হয়েছে।"); credit.reset({ user: users[0].id }); })}>
                <Select {...credit.register("user")}>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</Select>
                <Input type="number" {...credit.register("amount")} placeholder="পরিমাণ" />
                <Input {...credit.register("note")} placeholder="নোট" />
                <Button type="submit">ক্রেডিট দিন</Button>
              </form>
            </Card>
            <Card className="p-5">
              <h2 className="mb-4 text-2xl font-bold">ব্রডকাস্ট নোটিফিকেশন</h2>
              <form className="space-y-3" onSubmit={broadcast.handleSubmit(() => { setNotice("ডেমো নোটিফিকেশন পাঠানো হয়েছে।"); broadcast.reset(); })}>
                <Textarea {...broadcast.register("message")} placeholder="সবার জন্য বার্তা লিখুন" />
                <Button type="submit">পাঠান</Button>
              </form>
              {notice ? <p className="mt-3 rounded-2xl bg-gold/10 px-4 py-3 text-sm text-gold">{notice}</p> : null}
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
