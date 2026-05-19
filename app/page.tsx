"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Gift, Network, Sparkles, UserPlus, WalletCards } from "lucide-react";
import { Badge, Button, Card, Progress, SectionHeading } from "@/components/ui";
import { commissionLevels, products } from "@/lib/mock-data";
import { referralLink, taka, toBn } from "@/lib/utils";

const testimonials = [
  { name: "তানিয়া", text: "প্রথম মাসেই নিজের পরিচিত নেটওয়ার্ক সাজিয়ে নিয়মিত আয়ের পথ দেখেছি।", earning: 12000 },
  { name: "মাহিন", text: "ড্যাশবোর্ডে লেভেল ট্র্যাকিং থাকায় কে কোথায় আছে পরিষ্কার বোঝা যায়।", earning: 28500 },
  { name: "সাবিহা", text: "পণ্য রেফার করা, লিংক কপি করা আর কমিশন দেখা খুব সহজ।", earning: 8200 },
];

const rowColors = ["green", "blue", "amber", "red", "purple", "gold"] as const;

export default function Home() {
  const [level, setLevel] = useState(2);
  const total = useMemo(
    () => commissionLevels.filter((item) => item.level <= level).reduce((sum, item) => sum + item.earning, 0),
    [level],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="sticky top-0 z-40 border-b border-white/7 bg-background/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-gold-light to-purple-light font-display font-black text-black">NG</span>
            <span className="font-display text-xl font-black text-gold-light">NexaGrow</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#products" className="hover:text-gold-light">পণ্য</a>
            <a href="#plan" className="hover:text-gold-light">কমিশন</a>
            <a href="#calculator" className="hover:text-gold-light">ক্যালকুলেটর</a>
            <Link href="/login" className="hover:text-gold-light">লগইন</Link>
          </div>
          <Link href="/register" className="gold-button px-5 py-2.5 text-sm font-bold">যোগ দিন</Link>
        </div>
      </nav>

      <section className="hero-grid relative min-h-[calc(100vh-76px)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(168,85,247,0.24),transparent_34%),radial-gradient(circle_at_18%_78%,rgba(232,184,75,0.13),transparent_30%)]" />
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="particle"
            style={{ left: `${(index * 17) % 100}%`, top: `${18 + ((index * 23) % 72)}%`, animationDelay: `${index * 0.35}s` }}
          />
        ))}
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 lg:min-h-[calc(100vh-76px)] lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Badge>ফ্রন্টএন্ড ডেমো নেটওয়ার্ক প্ল্যাটফর্ম</Badge>
            <h1 className="heading-gradient mt-6 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
              আপনার নেটওয়ার্ক দিয়ে আয় করুন লক্ষাধিক টাকা
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              NexaGrow একটি সম্পূর্ণ mock MLM referral UI, যেখানে পণ্য, রেফারেল ট্রি, কমিশন, আয় ও admin panel একসঙ্গে দেখা যায়।
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="gold-button inline-flex items-center justify-center gap-2 px-7 py-3 font-bold">
                রেজিস্টার করুন <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="outline-gold inline-flex items-center justify-center gap-2 px-7 py-3 font-bold">
                ডেমো ড্যাশবোর্ড
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ["সক্রিয় সদস্য", "১২,৪৮০"],
                ["সর্বোচ্চ আয়", "৳৩,৬২,৮০০"],
                ["লেভেল", "৬"],
              ].map(([label, value]) => (
                <Card key={label} className="p-4 text-center">
                  <p className="text-xl font-black text-gold-light md:text-3xl">{value}</p>
                  <p className="mt-1 text-xs text-muted md:text-sm">{label}</p>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="relative">
            <div className="absolute inset-10 rounded-full bg-purple-light/20 blur-3xl" />
            <Card className="relative p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">আপনার রেফার লিংক</p>
                  <h2 className="heading-gradient text-3xl font-bold">NXG-RAFI-2048</h2>
                </div>
                <Sparkles className="text-gold-light" size={34} />
              </div>
              <div className="rounded-[18px] border border-white/10 bg-elevated p-4 text-sm text-muted">{referralLink()}</div>
              <div className="mt-6 space-y-4">
                {commissionLevels.slice(0, 4).map((item) => (
                  <div key={item.level}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>লেভেল {toBn(item.level)} · {toBn(item.required)} আইডি</span>
                      <span className="text-gold-light">{taka(item.earning)}</span>
                    </div>
                    <Progress value={(item.current / item.required) * 100} color={rowColors[item.level - 1]} />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading title="রেফার করার মতো পণ্য" text="প্রতিটি পণ্যের জন্য আলাদা mock referral action রাখা হয়েছে।" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} asMotion>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold/10 text-2xl text-gold-light">{product.icon}</div>
              <Badge tone="purple">{product.category}</Badge>
              <h3 className="mt-4 text-xl font-bold">{product.name}</h3>
              <p className="mt-2 min-h-20 text-sm leading-7 text-muted">{product.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-black text-gold-light">{taka(product.price)}</span>
                <Button variant="outline">রেফার করুন</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="plan" className="bg-[#0d0d15] px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="৬ লেভেলের কমিশন প্ল্যান" text="প্রয়োজনীয় আইডি, সম্ভাব্য আয় এবং ভিজুয়াল অগ্রগতি এক নজরে।" />
          <div className="overflow-x-auto rounded-[20px] border border-white/7 bg-surface scrollbar-soft">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-elevated text-sm text-muted">
                <tr>
                  <th className="px-5 py-4">লেভেল</th>
                  <th className="px-5 py-4">প্রয়োজনীয় আইডি</th>
                  <th className="px-5 py-4">আয়</th>
                  <th className="px-5 py-4">অগ্রগতি</th>
                </tr>
              </thead>
              <tbody>
                {commissionLevels.map((item, index) => {
                  const percent = (item.earning / commissionLevels[5].earning) * 100;
                  return (
                    <tr key={item.level} className="border-t border-white/7">
                      <td className="px-5 py-5"><Badge tone={index === 0 ? "green" : index === 1 ? "blue" : index === 3 ? "red" : index === 4 ? "purple" : "gold"}>লেভেল {toBn(item.level)}</Badge></td>
                      <td className="px-5 py-5">{toBn(item.required)} আইডি</td>
                      <td className="px-5 py-5 font-bold text-gold-light">{taka(item.earning)}</td>
                      <td className="px-5 py-5"><Progress value={percent} color={rowColors[index]} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading title="কীভাবে কাজ করে" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [UserPlus, "রেজিস্টার", "রেফার কোড দিয়ে demo account form পূরণ করুন।"],
            [Network, "রেফার", "আপনার অনন্য লিংক শেয়ার করে network দেখুন।"],
            [WalletCards, "আয়", "লেভেল পূর্ণ হলে mock commission tracker আপডেট হয়।"],
          ].map(([Icon, title, text]) => {
            const TypedIcon = Icon as typeof UserPlus;
            return (
              <Card key={String(title)} asMotion className="text-center">
                <TypedIcon className="mx-auto text-gold-light" size={38} />
                <h3 className="mt-4 text-2xl font-bold">{String(title)}</h3>
                <p className="mt-2 text-muted">{String(text)}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="calculator" className="mx-auto grid max-w-7xl gap-6 px-4 py-20 lg:grid-cols-2">
        <div>
          <SectionHeading title="আয় ক্যালকুলেটর" text="লেভেল নির্বাচন করলে cumulative mock earning সঙ্গে সঙ্গে দেখা যাবে।" />
        </div>
        <Card className="p-6">
          <label className="text-sm text-muted">লেভেল নির্বাচন করুন</label>
          <select value={level} onChange={(event) => setLevel(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-elevated px-4 outline-none focus:border-gold">
            {commissionLevels.map((item) => <option key={item.level} value={item.level}>লেভেল {toBn(item.level)}</option>)}
          </select>
          <div className="mt-6 rounded-[20px] border border-gold/20 bg-gold/10 p-6">
            <p className="text-muted">সম্ভাব্য মোট আয়</p>
            <p className="mt-2 text-5xl font-black text-gold-light">{taka(total)}</p>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading title="সদস্যদের গল্প" />
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} asMotion>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-purple-light/20 text-gold-light">{item.name[0]}</div>
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <Badge>{taka(item.earning)} আয়</Badge>
                </div>
              </div>
              <p className="mt-4 leading-8 text-muted">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-purple-light/20 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.38),rgba(26,26,38,1)_45%)] p-8 text-center md:p-14">
          <Gift className="mx-auto text-gold-light" size={42} />
          <h2 className="heading-gradient mt-4 text-4xl font-black md:text-6xl">আজই নেটওয়ার্ক শুরু করুন</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">সবকিছু frontend-only mock data দিয়ে তৈরি, তাই দ্রুত UI flow পরীক্ষা করা যায়।</p>
          <Link href="/register" className="gold-button mt-8 inline-flex items-center gap-2 px-8 py-3 font-bold">
            রেজিস্টার করুন <Copy size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
