"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button, Card, Input } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { useRegisterMutation } from "@/lib/api";
import { setCredentials } from "@/lib/auth-slice";
import { useAppDispatch } from "@/lib/hooks";

const schema = z.object({
  fullName: z.string().min(3, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(8, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  referralCode: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-background text-muted">Loading...</main>}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [registerMember, { isLoading }] = useRegisterMutation();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { referralCode: "" },
  });
  const referralCode = watch("referralCode")?.trim();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setValue("referralCode", ref);
  }, [searchParams, setValue]);

  async function handleRegisterSubmit(values: RegisterFormValues) {
    try {
      const auth = await registerMember({
        ...values,
        referralCode: values.referralCode?.trim() || undefined,
      }).unwrap();
      dispatch(setCredentials(auth));
      setMessage("Registration completed. Redirecting to dashboard...");
      router.push("/dashboard");
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Registration failed"));
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(232,82,10,0.14),transparent_38%),#FFF8F4] px-4 py-10">
      <Card className="w-full max-w-xl p-6 md:p-8">
        <Link href="/" className="mx-auto mb-6 flex w-max items-center gap-3">
          <BrandLogo className="h-16 w-16" priority />
        </Link>
        <h1 className="heading-gradient text-center text-4xl font-black">Create your account</h1>
        <p className="mt-3 text-center text-muted">Join the GIOTO Bangladesh member network.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(handleRegisterSubmit)}>
          <Field label="Full name" error={errors.fullName?.message}>
            <Input {...register("fullName")} placeholder="Your name" />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input {...register("email")} placeholder="name@example.com" />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <Input {...register("phone")} placeholder="01XXXXXXXXX" />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <Input type="password" {...register("password")} placeholder="At least 6 characters" />
          </Field>
          <Field label="Referral code" error={errors.referralCode?.message}>
            <Input {...register("referralCode")} placeholder="Optional sponsor code" />
            {referralCode ? (
              <p className="mt-2 rounded-2xl bg-gold/10 px-4 py-2 text-sm text-gold-light">
                Sponsor code: {referralCode}
              </p>
            ) : null}
          </Field>
          {message ? <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p> : null}
          <Button className="w-full" type="submit" disabled={isLoading}>
            Register <ArrowRight size={17} />
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account? <Link href="/login" className="text-gold-light">Log in</Link>
        </p>
      </Card>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-muted">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-gold">{error}</span> : null}
    </label>
  );
}
