"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, MailCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button, Card, Input } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { useForgotPasswordMutation } from "@/lib/api";

const schema = z.object({
  email: z.string().email("সঠিক ইমেইল লিখুন"),
});

type ForgotPasswordForm = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(schema),
  });

  async function handleForgotSubmit(values: ForgotPasswordForm) {
    try {
      const response = await forgotPassword({
        email: values.email.trim().toLowerCase(),
      }).unwrap();
      setMessage("OTP আপনার ইমেইলে পাঠানো হয়েছে।");
      router.push(`/otp-verification?identifier=${encodeURIComponent(response.identifier)}`);
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Could not send OTP"));
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(232,82,10,0.14),transparent_36%),#FFF8F4] px-4 py-10">
      <Card className="w-full max-w-lg p-6 md:p-8">
        <Link href="/" className="mx-auto mb-6 flex w-max items-center gap-3">
          <BrandLogo className="h-16 w-16" priority />
        </Link>
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold-light">
          <MailCheck size={24} />
        </div>
        <h1 className="heading-gradient text-center text-4xl font-black">পাসওয়ার্ড রিকভার করুন</h1>
        <p className="mt-3 text-center text-muted">আপনার ইমেইল দিন, আমরা নিরাপদ OTP পাঠাবো।</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(handleForgotSubmit)}>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">ইমেইল</span>
            <Input type="email" {...register("email")} placeholder="name@example.com" />
            {errors.email ? <span className="mt-2 block text-sm text-gold">{errors.email.message}</span> : null}
          </label>
          <Button className="w-full" type="submit" disabled={isLoading}>
            OTP পাঠান <ArrowRight size={17} />
          </Button>
          {message ? <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">{message}</p> : null}
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          মনে পড়েছে? <Link href="/login" className="inline-flex items-center gap-1 text-gold-light"><ArrowLeft size={14} /> লগইন করুন</Link>
        </p>
      </Card>
    </main>
  );
}
