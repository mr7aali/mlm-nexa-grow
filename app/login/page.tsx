"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";

const demoEmail = "rafi@nexagrow.demo";
const demoPassword = "123456";

const schema = z.object({
  email: z.string().email("সঠিক ইমেইল লিখুন"),
  password: z.string().min(6, "কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন"),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: demoEmail, password: demoPassword, remember: true },
  });

  function onSubmit(values: LoginForm) {
    if (values.email.trim().toLowerCase() === demoEmail && values.password === demoPassword) {
      setMessage("লগইন সফল হয়েছে। ড্যাশবোর্ডে নেওয়া হচ্ছে...");
      router.push("/dashboard");
      return;
    }

    setMessage("ডেমো লগইনের জন্য rafi@nexagrow.demo এবং 123456 ব্যবহার করুন।");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(232,82,10,0.14),transparent_36%),#FFF8F4] px-4 py-10">
      <Card className="w-full max-w-lg p-6 md:p-8">
        <Link href="/" className="mx-auto mb-6 flex w-max items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-gold font-display font-black text-white">NG</span>
          <span className="font-display text-2xl font-black text-gold-light">NexaGrow</span>
        </Link>
        <h1 className="heading-gradient text-center text-4xl font-black">লগইন করুন</h1>
        <p className="mt-3 text-center text-muted">ডেমো ড্যাশবোর্ডে প্রবেশ করুন</p>

        <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">
          ডেমো ইমেইল: {demoEmail} · পাসওয়ার্ড: {demoPassword}
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">ইমেইল</span>
            <Input {...register("email")} placeholder="name@example.com" />
            {errors.email ? <span className="mt-2 block text-sm text-gold">{errors.email.message}</span> : null}
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">পাসওয়ার্ড</span>
            <Input type="password" {...register("password")} placeholder="••••••••" />
            {errors.password ? <span className="mt-2 block text-sm text-gold">{errors.password.message}</span> : null}
          </label>
          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="flex items-center gap-2 text-muted">
              <input type="checkbox" {...register("remember")} className="h-4 w-4 accent-gold" />
              মনে রাখুন
            </label>
            <a href="#" className="text-gold-light">পাসওয়ার্ড ভুলে গেছেন?</a>
          </div>
          <Button className="w-full" type="submit">
            ড্যাশবোর্ডে যান <ArrowRight size={17} />
          </Button>
          {message ? <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">{message}</p> : null}
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          নতুন সদস্য? <Link href="/register" className="text-gold-light">রেজিস্টার করুন</Link>
        </p>
      </Card>
    </main>
  );
}
