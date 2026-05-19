"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";

const schema = z.object({
  fullName: z.string().min(3, "পুরো নাম লিখুন"),
  email: z.string().email("সঠিক ইমেইল লিখুন"),
  phone: z.string().min(8, "সঠিক ফোন নম্বর লিখুন"),
  password: z.string().min(6, "কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন"),
  referralCode: z.string().optional(),
});

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-background text-muted">লোড হচ্ছে...</main>}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: { referralCode: "" },
  });
  const referralCode = watch("referralCode");

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setValue("referralCode", ref);
  }, [searchParams, setValue]);

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.2),transparent_38%),#0A0A0F] px-4 py-10">
      <Card className="w-full max-w-xl p-6 md:p-8">
        <Link href="/" className="mx-auto mb-6 flex w-max items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-gold-light to-purple-light font-display font-black text-black">NG</span>
          <span className="font-display text-2xl font-black text-gold-light">NexaGrow</span>
        </Link>
        <h1 className="heading-gradient text-center text-4xl font-black">নতুন অ্যাকাউন্ট খুলুন</h1>
        <p className="mt-3 text-center text-muted">ফ্রন্টএন্ড ডেমো রেজিস্ট্রেশন ফর্ম</p>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(() => setSuccess("ডেমো রেজিস্ট্রেশন সম্পন্ন হয়েছে। এখন ড্যাশবোর্ড দেখা যাবে।"))}
        >
          <Field label="পুরো নাম" error={errors.fullName?.message}><Input {...register("fullName")} placeholder="আপনার নাম" /></Field>
          <Field label="ইমেইল" error={errors.email?.message}><Input {...register("email")} placeholder="name@example.com" /></Field>
          <Field label="ফোন" error={errors.phone?.message}><Input {...register("phone")} placeholder="০১৭XXXXXXXX" /></Field>
          <Field label="পাসওয়ার্ড" error={errors.password?.message}><Input type="password" {...register("password")} placeholder="••••••••" /></Field>
          <Field label="রেফারেল কোড" error={errors.referralCode?.message}>
            <Input {...register("referralCode")} placeholder="NXG-RAFI-2048" />
            {referralCode ? <p className="mt-2 rounded-2xl bg-gold/10 px-4 py-2 text-sm text-gold-light">রেফারার: রাফি হাসান</p> : null}
          </Field>
          {success ? <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{success}</p> : null}
          <Button className="w-full" type="submit">
            রেজিস্টার করুন <ArrowRight size={17} />
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">আগেই অ্যাকাউন্ট আছে? <Link href="/login" className="text-gold-light">লগইন করুন</Link></p>
      </Card>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-muted">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-red-200">{error}</span> : null}
    </label>
  );
}
