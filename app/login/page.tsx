"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button, Card, Input } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { useLoginMutation } from "@/lib/api";
import { setCredentials } from "@/lib/auth-slice";
import { useAppDispatch } from "@/lib/hooks";

// const memberEmail = "rafi@giotobangladesh.com";
// const memberPassword = "123456";

const schema = z.object({
  email: z.string().email("সঠিক ইমেইল লিখুন"),
  password: z.string().min(6, "কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন"),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  async function handleLoginSubmit(values: LoginForm) {
    try {
      const auth = await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }).unwrap();
      dispatch(setCredentials(auth));
      setMessage("Login successful. Redirecting to dashboard...");
      router.push("/dashboard");
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Login failed"));
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(232,82,10,0.14),transparent_36%),#FFF8F4] px-4 py-10">
      <Card className="w-full max-w-lg p-6 md:p-8">
        <Link href="/" className="mx-auto mb-6 flex w-max items-center gap-3">
          <BrandLogo className="h-16 w-16" priority />
        </Link>
        <h1 className="heading-gradient text-center text-4xl font-black">
          লগইন করুন
        </h1>
        <p className="mt-3 text-center text-muted">
          আপনার সদস্য ড্যাশবোর্ডে প্রবেশ করুন
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(handleLoginSubmit)}
        >
          <label className="block">
            <span className="mb-2 block text-sm text-muted">ইমেইল</span>
            <Input {...register("email")} placeholder="name@example.com" />
            {errors.email ? (
              <span className="mt-2 block text-sm text-gold">
                {errors.email.message}
              </span>
            ) : null}
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">পাসওয়ার্ড</span>
            <span className="relative block">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-gold/10 hover:text-gold"
                aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
            {errors.password ? (
              <span className="mt-2 block text-sm text-gold">
                {errors.password.message}
              </span>
            ) : null}
          </label>
          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="flex items-center gap-2 text-muted">
              <input
                type="checkbox"
                {...register("remember")}
                className="h-4 w-4 accent-gold"
              />
              মনে রাখুন
            </label>
            <Link href="/forgot-password" className="text-gold-light">
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            ড্যাশবোর্ডে যান <ArrowRight size={17} />
          </Button>
          {message ? (
            <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">
              {message}
            </p>
          ) : null}
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          নতুন সদস্য?{" "}
          <Link href="/products" className="text-gold-light">
            পণ্য কিনে সদস্য হন
          </Link>
        </p>
      </Card>
    </main>
  );
}
