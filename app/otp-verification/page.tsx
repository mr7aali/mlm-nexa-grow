"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button, Card, Input } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { useVerifyOtpMutation } from "@/lib/api";

const demoOtp = "246810";

const schema = z.object({
  otp: z.string().length(6, "৬ সংখ্যার OTP লিখুন"),
});

type OtpForm = z.infer<typeof schema>;

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-background text-muted">লোড হচ্ছে...</main>}>
      <OtpVerificationForm />
    </Suspense>
  );
}

function OtpVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier") ?? "";
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpForm>({
    resolver: zodResolver(schema),
    defaultValues: { otp: demoOtp },
  });

  async function handleOtpSubmit(values: OtpForm) {
    try {
      const response = await verifyOtp({ identifier, otp: values.otp }).unwrap();
      setMessage("OTP verified.");
      router.push(
        `/reset-password?identifier=${encodeURIComponent(response.identifier)}&token=${encodeURIComponent(response.resetToken)}`,
      );
    } catch (error) {
      setMessage(getApiErrorMessage(error, "OTP verification failed"));
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(232,82,10,0.14),transparent_36%),#FFF8F4] px-4 py-10">
      <Card className="w-full max-w-lg p-6 md:p-8">
        <Link href="/" className="mx-auto mb-6 flex w-max items-center gap-3">
          <BrandLogo className="h-16 w-16" priority />
        </Link>
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold-light">
          <ShieldCheck size={24} />
        </div>
        <h1 className="heading-gradient text-center text-4xl font-black">OTP যাচাই করুন</h1>
        <p className="mt-3 text-center text-muted">
          {identifier ? `${identifier} ঠিকানায় পাঠানো OTP দিন।` : "আপনার OTP দিন।"}
        </p>

        <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">
          ডেমো OTP: {demoOtp}
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(handleOtpSubmit)}>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">OTP কোড</span>
            <Input inputMode="numeric" maxLength={6} {...register("otp")} placeholder="246810" />
            {errors.otp ? <span className="mt-2 block text-sm text-gold">{errors.otp.message}</span> : null}
          </label>
          <Button className="w-full" type="submit" disabled={isLoading}>
            যাচাই করুন <ArrowRight size={17} />
          </Button>
          {message ? <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">{message}</p> : null}
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          নম্বর বদলাবেন? <Link href="/forgot-password" className="inline-flex items-center gap-1 text-gold-light"><ArrowLeft size={14} /> ফিরে যান</Link>
        </p>
      </Card>
    </main>
  );
}
