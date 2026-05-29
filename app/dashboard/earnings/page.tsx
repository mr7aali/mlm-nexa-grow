"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button, Card, Input, Select } from "@/components/ui";
import { earningsByMonth, withdrawals } from "@/lib/mock-data";
import { useCreateWithdrawalMutation, useGetEarningsQuery } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
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
  const { data } = useGetEarningsQuery();
  const [createWithdrawal, { isLoading }] = useCreateWithdrawalMutation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<WithdrawForm>({ resolver: zodResolver(schema), defaultValues: { amount: "", method: "bKash", account: "" } });
  const balance = data?.balance ?? 2780;
  const monthlyRows = data?.earningsByMonth ?? earningsByMonth;
  const withdrawalRows = data?.withdrawals ?? withdrawals;

  useEffect(() => setMounted(true), []);

  async function handleWithdrawalSubmit(values: WithdrawForm) {
    try {
      await createWithdrawal({
        amount: Number(values.amount),
        method: values.method,
        account: values.account,
      }).unwrap();
      setSuccess("Withdrawal request submitted.");
      reset({ amount: "", method: "bKash", account: "" });
    } catch (error) {
      setSuccess(getApiErrorMessage(error, "Withdrawal request failed"));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">ব্যালেন্স ও উইথড্র</p>
        <h2 className="heading-gradient text-4xl font-black">আয়</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="bg-[radial-gradient(circle_at_top_right,rgba(232,82,10,0.14),#FFFFFF_45%)] p-6">
          <p className="text-muted">মোট ব্যালেন্স</p>
          <p className="mt-3 text-6xl font-black text-gold-light">{taka(balance)}</p>
          <p className="mt-4 rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">ন্যূনতম উইথড্র: ৳২০০</p>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">উইথড্র অনুরোধ</h3>
          <form className="space-y-4" onSubmit={handleSubmit(handleWithdrawalSubmit)}>
            <label className="block"><span className="mb-2 block text-sm text-muted">পরিমাণ</span><Input type="number" {...register("amount")} placeholder="২০০" />{errors.amount ? <span className="text-sm text-gold">{errors.amount.message}</span> : null}</label>
            <label className="block"><span className="mb-2 block text-sm text-muted">মেথড</span><Select {...register("method")}><option>bKash</option><option>Nagad</option><option>Bank</option></Select></label>
            <label className="block"><span className="mb-2 block text-sm text-muted">অ্যাকাউন্ট নম্বর</span><Input {...register("account")} placeholder="০১৭XXXXXXXX" />{errors.account ? <span className="text-sm text-gold">{errors.account.message}</span> : null}</label>
            {success ? <p className="rounded-2xl bg-gold/10 px-4 py-3 text-sm text-gold">{success}</p> : null}
            <Button className="w-full" type="submit" disabled={isLoading}>অনুরোধ জমা দিন</Button>
          </form>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-2xl font-bold">মাসভিত্তিক আয়</h3>
        <div className="h-80">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRows}>
                <CartesianGrid stroke="#FFD4B8" vertical={false} />
                <XAxis dataKey="month" stroke="#6D5A4F" />
                <YAxis stroke="#6D5A4F" />
                <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #FFD4B8", borderRadius: 16, color: "#1A1A1A" }} />
                <Bar dataKey="income" name="আয়" fill="#E8520A" radius={[10, 10, 0, 0]} />
                <Bar dataKey="pending" name="পেন্ডিং" fill="#FFA472" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center rounded-[18px] border border-line bg-elevated text-muted">চার্ট লোড হচ্ছে...</div>
          )}
        </div>
      </Card>

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-elevated text-muted"><tr>{["তারিখ", "পরিমাণ", "মেথড", "স্ট্যাটাস"].map((head) => <th key={head} className="px-5 py-4">{head}</th>)}</tr></thead>
          <tbody>{withdrawalRows.map((item) => <tr key={item.id} className="border-t border-line"><td className="px-5 py-4">{item.date}</td><td className="px-5 py-4 text-gold-light">{taka(item.amount)}</td><td className="px-5 py-4">{item.method}</td><td className="px-5 py-4 text-muted">{item.status}</td></tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}
