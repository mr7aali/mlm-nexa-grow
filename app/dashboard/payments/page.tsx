"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Send, WalletCards } from "lucide-react";
import { Button, Card, Input, Select } from "@/components/ui";
import { useCreateWithdrawalMutation, useGetPaymentsQuery } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { taka } from "@/lib/utils";

const schema = z.object({
  amount: z.string().refine((value) => Number(value) >= 200, "ন্যূনতম উইথড্র ৳২০০"),
  method: z.string().min(1, "মেথড নির্বাচন করুন"),
  account: z.string().min(6, "অ্যাকাউন্ট নম্বর লিখুন"),
});

type WithdrawForm = z.infer<typeof schema>;

export default function MemberPaymentsPage() {
  const [message, setMessage] = useState("");
  const { data, isLoading: paymentsLoading } = useGetPaymentsQuery();
  const [createWithdrawal, { isLoading }] = useCreateWithdrawalMutation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<WithdrawForm>({
    resolver: zodResolver(schema),
    defaultValues: { amount: "", method: "bKash", account: "" },
  });
  const balance = data?.balance ?? 0;
  const withdrawals = data?.withdrawals ?? [];

  async function handleWithdrawalSubmit(values: WithdrawForm) {
    const amount = Number(values.amount);

    if (amount > balance) {
      setMessage("আপনার বর্তমান ব্যালেন্সের বেশি অনুরোধ করা যাবে না।");
      return;
    }

    try {
      await createWithdrawal({
        amount,
        method: values.method,
        account: values.account,
      }).unwrap();
      setMessage("টাকা তোলার অনুরোধ জমা হয়েছে।");
      reset({ amount: "", method: "bKash", account: "" });
    } catch (error) {
      setMessage(getApiErrorMessage(error, "অনুরোধ জমা ব্যর্থ হয়েছে"));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">পেমেন্ট ও ট্রানজ্যাকশন</p>
        <h2 className="heading-gradient text-4xl font-black">আমার পেমেন্ট</h2>
      </div>

      {paymentsLoading ? <p className="text-sm text-muted">পেমেন্ট ডেটা লোড হচ্ছে...</p> : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="bg-[radial-gradient(circle_at_top_right,rgba(232,82,10,0.14),#FFFFFF_45%)] p-6">
          <div className="flex items-center gap-3 text-gold-light">
            <WalletCards size={30} />
            <p className="font-semibold">বর্তমান ব্যালেন্স</p>
          </div>
          <p className="mt-3 text-6xl font-black text-gold-light">{taka(balance)}</p>
          <p className="mt-4 rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">ন্যূনতম উত্তোলন: ৳২০০</p>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold-light"><Send size={20} /></span>
            <h3 className="text-2xl font-bold">টাকা তোলার অনুরোধ</h3>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(handleWithdrawalSubmit)}>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">পরিমাণ</span>
              <Input type="number" {...register("amount")} placeholder="২০০" />
              {errors.amount ? <span className="text-sm text-gold">{errors.amount.message}</span> : null}
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">মেথড</span>
              <Select {...register("method")}><option>bKash</option><option>Nagad</option><option>Bank</option></Select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">অ্যাকাউন্ট নম্বর</span>
              <Input {...register("account")} placeholder="০১৭XXXXXXXX" />
              {errors.account ? <span className="text-sm text-gold">{errors.account.message}</span> : null}
            </label>
            {message ? <p className="rounded-2xl bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p> : null}
            <Button className="w-full" type="submit" disabled={isLoading || balance < 200}>অনুরোধ জমা দিন</Button>
          </form>
        </Card>
      </div>

      <Card className="overflow-x-auto p-0 scrollbar-soft">
        <div className="flex items-center gap-3 p-5">
          <CreditCard className="text-gold-light" size={22} />
          <h3 className="text-2xl font-bold">আমার ট্রানজ্যাকশন হিস্ট্রি</h3>
        </div>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-elevated text-muted">
            <tr>{["তারিখ", "পরিমাণ", "মেথড", "অ্যাকাউন্ট", "স্ট্যাটাস"].map((head) => <th key={head} className="px-5 py-4">{head}</th>)}</tr>
          </thead>
          <tbody>
            {withdrawals.length ? withdrawals.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-5 py-4">{item.date}</td>
                <td className="px-5 py-4 font-bold text-gold-light">{taka(item.amount)}</td>
                <td className="px-5 py-4">{item.method}</td>
                <td className="px-5 py-4 text-muted">{item.account ?? "-"}</td>
                <td className="px-5 py-4 text-muted">{item.status}</td>
              </tr>
            )) : (
              <tr><td className="px-5 py-8 text-center text-muted" colSpan={5}>কোনো ট্রানজ্যাকশন নেই।</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
