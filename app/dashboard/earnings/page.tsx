"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button, Card, Input, Select } from "@/components/ui";
import { earningsByMonth, withdrawals } from "@/lib/mock-data";
import { taka } from "@/lib/utils";

const schema = z.object({
  amount: z.string().refine((value) => Number(value) >= 200, "ন্যূনতম উইথড্র ৳২০০"),
  method: z.string().min(1, "মেথড নির্বাচন করুন"),
  account: z.string().min(6, "অ্যাকাউন্ট নম্বর লিখুন"),
});

type WithdrawForm = z.infer<typeof schema>;

export default function EarningsPage() {
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<WithdrawForm>({ resolver: zodResolver(schema), defaultValues: { amount: "", method: "bKash", account: "" } });

  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">ব্যালেন্স ও উইথড্র</p>
        <h2 className="heading-gradient text-4xl font-black">আয়</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="bg-[radial-gradient(circle_at_top_right,rgba(232,184,75,0.16),#1A1A26_45%)] p-6">
          <p className="text-muted">মোট ব্যালেন্স</p>
          <p className="mt-3 text-6xl font-black text-gold-light">{taka(2780)}</p>
          <p className="mt-4 rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">ন্যূনতম উইথড্র: ৳২০০</p>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">উইথড্র অনুরোধ</h3>
          <form className="space-y-4" onSubmit={handleSubmit(() => { setSuccess("ডেমো উইথড্র অনুরোধ জমা হয়েছে।"); reset({ method: "bKash" }); })}>
            <label className="block"><span className="mb-2 block text-sm text-muted">পরিমাণ</span><Input type="number" {...register("amount")} placeholder="২০০" />{errors.amount ? <span className="text-sm text-red-200">{errors.amount.message}</span> : null}</label>
            <label className="block"><span className="mb-2 block text-sm text-muted">মেথড</span><Select {...register("method")}><option>bKash</option><option>Nagad</option><option>Bank</option></Select></label>
            <label className="block"><span className="mb-2 block text-sm text-muted">অ্যাকাউন্ট নম্বর</span><Input {...register("account")} placeholder="০১৭XXXXXXXX" />{errors.account ? <span className="text-sm text-red-200">{errors.account.message}</span> : null}</label>
            {success ? <p className="rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{success}</p> : null}
            <Button className="w-full" type="submit">অনুরোধ জমা দিন</Button>
          </form>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-2xl font-bold">মাসভিত্তিক আয়</h3>
        <div className="h-80">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsByMonth}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="#9896B0" />
                <YAxis stroke="#9896B0" />
                <Tooltip contentStyle={{ background: "#1A1A26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, color: "#F0EEF8" }} />
                <Bar dataKey="income" name="আয়" fill="#E8B84B" radius={[10, 10, 0, 0]} />
                <Bar dataKey="pending" name="পেন্ডিং" fill="#A855F7" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center rounded-[18px] border border-white/7 bg-elevated text-muted">চার্ট লোড হচ্ছে...</div>
          )}
        </div>
      </Card>

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-elevated text-muted"><tr>{["তারিখ", "পরিমাণ", "মেথড", "স্ট্যাটাস"].map((head) => <th key={head} className="px-5 py-4">{head}</th>)}</tr></thead>
          <tbody>{withdrawals.map((item) => <tr key={item.id} className="border-t border-white/7"><td className="px-5 py-4">{item.date}</td><td className="px-5 py-4 text-gold-light">{taka(item.amount)}</td><td className="px-5 py-4">{item.method}</td><td className="px-5 py-4 text-muted">{item.status}</td></tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}
