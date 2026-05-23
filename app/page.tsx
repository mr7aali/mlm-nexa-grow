"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Gift, Network, ShoppingBag, Sparkles, Tag, UserPlus, WalletCards } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge, Card, Progress, SectionHeading } from "@/components/ui";
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
      <nav className="sticky top-0 z-40 border-b border-gold bg-gold text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo className="h-12 w-12" priority />
          </Link>
          <div className="hidden items-center gap-7 text-sm text-white/85 md:flex">
            <Link href="/products" className="hover:text-white">পণ্য</Link>
            <a href="#calculator" className="hover:text-white">ক্যালকুলেটর</a>
            <Link href="/login" className="hover:text-white">লগইন</Link>
          </div>
          <Link href="/register" className="rounded-full bg-elevated px-5 py-2.5 text-sm font-bold text-gold transition hover:bg-elevated/90">যোগ দিন</Link>
        </div>
      </nav>

      <section className="hero-grid relative overflow-hidden bg-gold text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.18),transparent_34%),radial-gradient(circle_at_18%_78%,rgba(255,164,114,0.38),transparent_30%)]" />
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="particle"
            style={{ left: `${(index * 17) % 100}%`, top: `${18 + ((index * 23) % 72)}%`, animationDelay: `${index * 0.35}s` }}
          />
        ))}
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Badge>ফ্রন্টএন্ড ডেমো নেটওয়ার্ক প্ল্যাটফর্ম</Badge>
            <h1 className="heading-gradient mt-6 max-w-4xl text-5xl font-black leading-tight !text-white md:text-7xl">
              আপনার নেটওয়ার্ক দিয়ে আয় করুন লক্ষাধিক টাকা
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
              GIOTO একটি সম্পূর্ণ mock MLM referral UI, যেখানে পণ্য, রেফারেল ট্রি, কমিশন, আয় ও admin panel একসঙ্গে দেখা যায়।
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="gold-button inline-flex items-center justify-center gap-2 px-7 py-3 font-bold">
                রেজিস্টার করুন <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full border border-elevated bg-transparent px-7 py-3 font-bold text-white transition hover:bg-gold-light/20">
                ডেমো ড্যাশবোর্ড
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="relative">
            <div className="absolute inset-10 rounded-full bg-gold-light/20 blur-3xl" />
            <Card className="relative p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">আপনার রেফার লিংক</p>
                  <h2 className="heading-gradient text-3xl font-bold">NXG-RAFI-2048</h2>
                </div>
                <Sparkles className="text-gold-light" size={34} />
              </div>
              <div className="rounded-[18px] border border-line bg-elevated p-4 text-sm text-muted">{referralLink()}</div>
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
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold text-gold-light">অনলাইন শপ</p>
            <h2 className="heading-gradient text-3xl font-bold leading-tight md:text-5xl">জনপ্রিয় পণ্য</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
              সরাসরি পণ্য কিনতে dedicated public product page থেকে details ও checkout করুন।
            </p>
          </div>
          <Link href="/products" className="outline-gold inline-flex w-fit items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold transition hover:bg-gold/10">
            <ShoppingBag size={17} />
            সব পণ্য
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} asMotion className="flex min-h-full flex-col overflow-hidden p-0">
              <Link href={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-elevated">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-300 hover:scale-105"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-bold text-white">
                  <Tag size={14} />
                  {product.offer}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-5">
                <Badge tone="purple">{product.category}</Badge>
                <h3 className="mt-4 text-xl font-bold">{product.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-7 text-muted">{product.description}</p>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-lg font-black text-gold-light">{taka(product.price)}</p>
                    <p className="text-xs text-muted line-through">{taka(product.originalPrice)}</p>
                  </div>
                  <Link href={`/products/${product.id}/checkout`} className="gold-button inline-flex min-h-10 items-center justify-center gap-2 px-4 py-2 text-sm font-bold">
                    কিনুন
                  </Link>
                </div>
              </div>
            </Card>
          ))}
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
          <select value={level} onChange={(event) => setLevel(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-line bg-elevated px-4 outline-none focus:border-gold">
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
        <div className="testimonial-marquee overflow-hidden">
          <div className="testimonial-track flex w-max gap-5">
          {[...testimonials, ...testimonials].map((item, index) => (
            <Card key={`${item.name}-${index}`} className="w-[300px] shrink-0 md:w-[380px]">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gold-light/20 text-gold-light">{item.name[0]}</div>
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <Badge>{taka(item.earning)} আয়</Badge>
                </div>
              </div>
              <p className="mt-4 leading-8 text-muted">{item.text}</p>
            </Card>
          ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-line bg-[radial-gradient(circle_at_50%_0%,rgba(232,82,10,0.24),rgba(26,26,26,1)_45%)] p-8 text-center md:p-14">
          <Gift className="mx-auto text-gold-light" size={42} />
          <h2 className="heading-gradient mt-4 text-4xl font-black !text-white md:text-6xl">আজই নেটওয়ার্ক শুরু করুন</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">সবকিছু frontend-only mock data দিয়ে তৈরি, তাই দ্রুত UI flow পরীক্ষা করা যায়।</p>
          <Link href="/register" className="gold-button mt-8 inline-flex items-center gap-2 px-8 py-3 font-bold">
            রেজিস্টার করুন <Copy size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
