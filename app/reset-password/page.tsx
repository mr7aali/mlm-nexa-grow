"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, KeyRound } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { Button, Card, Input } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { useResetPasswordMutation } from "@/lib/api";

const schema = z
  .object({
    password: z.string().min(6, "কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন"),
    confirmPassword: z.string().min(6, "আবার পাসওয়ার্ড লিখুন"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "দুইটি পাসওয়ার্ড একই হতে হবে",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-background text-muted">লোড হচ্ছে...</main>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier") ?? "";
  const resetToken = searchParams.get("token") ?? "";
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(schema),
  });

  async function handleResetSubmit(values: ResetPasswordForm) {
    try {
      await resetPassword({
        identifier,
        password: values.password,
        resetToken,
      }).unwrap();
      setSuccess("Password updated. You can now sign in.");
      reset();
    } catch (error) {
      setSuccess(getApiErrorMessage(error, "Password reset failed"));
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(232,82,10,0.14),transparent_36%),#FFF8F4] px-4 py-10">
      <div className="fixed right-4 top-4 z-50">
        <LanguageToggle tone="light" />
      </div>
      <Card className="w-full max-w-lg p-6 md:p-8">
        <Link href="/" className="mx-auto mb-6 flex w-max items-center gap-3">
          <BrandLogo className="h-16 w-16" priority />
        </Link>
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold-light">
          <KeyRound size={24} />
        </div>
        <h1 className="heading-gradient text-center text-4xl font-black">নতুন পাসওয়ার্ড দিন</h1>
        <p className="mt-3 text-center text-muted">
          {identifier ? `${identifier} অ্যাকাউন্টের জন্য নতুন পাসওয়ার্ড সেট করুন।` : "আপনার নতুন পাসওয়ার্ড সেট করুন।"}
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(handleResetSubmit)}>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">নতুন পাসওয়ার্ড</span>
            <Input type="password" {...register("password")} placeholder="••••••••" />
            {errors.password ? <span className="mt-2 block text-sm text-gold">{errors.password.message}</span> : null}
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">পাসওয়ার্ড নিশ্চিত করুন</span>
            <Input type="password" {...register("confirmPassword")} placeholder="••••••••" />
            {errors.confirmPassword ? <span className="mt-2 block text-sm text-gold">{errors.confirmPassword.message}</span> : null}
          </label>
          <Button className="w-full" type="submit" disabled={isLoading}>
            পাসওয়ার্ড আপডেট করুন
          </Button>
          {success ? <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">{success}</p> : null}
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/login" className="inline-flex items-center gap-1 text-gold-light"><ArrowLeft size={14} /> লগইনে ফিরে যান</Link>
        </p>
      </Card>
    </main>
  );
}
