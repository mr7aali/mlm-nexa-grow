"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Copy, Trash2 } from "lucide-react";
import { Badge, Button, Card, CopyButton, Input } from "@/components/ui";
import { referralLink } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(3, "নাম লিখুন"),
  phone: z.string().min(8, "ফোন নম্বর লিখুন"),
});

const passwordSchema = z.object({
  current: z.string().min(6, "বর্তমান পাসওয়ার্ড লিখুন"),
  next: z.string().min(6, "নতুন পাসওয়ার্ড লিখুন"),
});

export default function ProfilePage() {
  const [saved, setSaved] = useState("");
  const link = referralLink();
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "রাফি হাসান", phone: "০১৭১১-২২৩৩৪৪" },
  });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema) });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">অ্যাকাউন্ট সেটিংস</p>
        <h2 className="heading-gradient text-4xl font-black">প্রোফাইল</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="grid h-28 w-28 place-items-center rounded-full bg-gold text-4xl font-black text-white">রা</div>
              <button className="absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-full bg-elevated text-gold-light"><Camera size={17} /></button>
            </div>
            <h3 className="mt-4 text-2xl font-bold">রাফি হাসান</h3>
            <Badge>বর্তমান লেভেল ২</Badge>
          </div>
          <div className="mt-6 space-y-3 rounded-[18px] border border-line bg-elevated p-4 text-sm">
            <p><span className="text-muted">অ্যাকাউন্ট তৈরি:</span> ১২ জানুয়ারি ২০২৬</p>
            <p><span className="text-muted">রেফার কোড:</span> NXG-RAFI-2048</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">প্রোফাইল সম্পাদনা</h3>
          <form className="space-y-4" onSubmit={profileForm.handleSubmit(() => setSaved("প্রোফাইল তথ্য ডেমোভাবে সংরক্ষিত হয়েছে।"))}>
            <label className="block"><span className="mb-2 block text-sm text-muted">পুরো নাম</span><Input {...profileForm.register("fullName")} />{profileForm.formState.errors.fullName ? <span className="text-sm text-gold">{profileForm.formState.errors.fullName.message}</span> : null}</label>
            <label className="block"><span className="mb-2 block text-sm text-muted">ফোন</span><Input {...profileForm.register("phone")} />{profileForm.formState.errors.phone ? <span className="text-sm text-gold">{profileForm.formState.errors.phone.message}</span> : null}</label>
            {saved ? <p className="rounded-2xl bg-gold/10 px-4 py-3 text-sm text-gold">{saved}</p> : null}
            <Button type="submit">সংরক্ষণ করুন</Button>
          </form>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">পাসওয়ার্ড পরিবর্তন</h3>
          <form className="space-y-4" onSubmit={passwordForm.handleSubmit(() => passwordForm.reset())}>
            <Input type="password" {...passwordForm.register("current")} placeholder="বর্তমান পাসওয়ার্ড" />
            <Input type="password" {...passwordForm.register("next")} placeholder="নতুন পাসওয়ার্ড" />
            <Button type="submit" variant="outline">আপডেট করুন</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">আমার রেফার লিংক</h3>
          <div className="break-all rounded-2xl border border-line bg-elevated p-4 text-sm text-gold-light">{link}</div>
          <div className="mt-4 flex flex-wrap gap-3">
            <CopyButton value={link} />
            <Button variant="outline"><Copy size={16} /> QR দেখুন</Button>
          </div>
          <div className="mt-5 grid h-36 w-36 grid-cols-6 gap-1 rounded-2xl bg-white p-3">
            {Array.from({ length: 36 }).map((_, index) => <span key={index} className={(index * 7) % 5 === 0 || index < 8 || index > 27 ? "bg-black" : "bg-white"} />)}
          </div>
        </Card>
      </div>

      <Card className="border-foreground/20 p-6">
        <h3 className="text-2xl font-bold text-foreground">অ্যাকাউন্ট ডিলিট</h3>
        <p className="mt-2 text-muted">এটি শুধু UI action; কোনো বাস্তব ডেটা মুছে যাবে না।</p>
        <Button variant="danger" className="mt-4"><Trash2 size={16} /> ডিলিট অপশন</Button>
      </Card>
    </div>
  );
}
