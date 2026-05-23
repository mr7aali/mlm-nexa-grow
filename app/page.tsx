"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, Copy, Gift, Layers3, Mail, MapPin, Menu, Network, Phone, ShieldCheck, ShoppingBag, Sparkles, Tag, UserPlus, WalletCards, X } from "lucide-react";
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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:py-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <BrandLogo className="h-11 w-28 sm:h-12 sm:w-44 md:h-14 md:w-56" priority framed={false} variant="wide" />
          </Link>
          <div className="hidden items-center gap-7 text-sm text-white/85 md:flex">
            <Link href="/products" className="hover:text-white">পণ্য</Link>
            <a href="#about" className="hover:text-white">আমাদের সম্পর্কে</a>
            <a href="#calculator" className="hover:text-white">ক্যালকুলেটর</a>
            <Link href="/login" className="hover:text-white">লগইন</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/register" className="shrink-0 rounded-full bg-elevated px-4 py-2 text-sm font-bold text-gold transition hover:bg-elevated/90 sm:px-5 sm:py-2.5">যোগ দিন</Link>
            <details className="group relative md:hidden">
              <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-white/25 text-white transition hover:bg-white/10 [&::-webkit-details-marker]:hidden">
                <Menu className="group-open:hidden" size={20} />
                <X className="hidden group-open:block" size={20} />
                <span className="sr-only">মেনু</span>
              </summary>
              <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-white/15 bg-gold p-2 text-sm font-semibold text-white shadow-2xl">
                <Link href="/products" className="block rounded-xl px-4 py-3 transition hover:bg-white/10">পণ্য</Link>
                <a href="#about" className="block rounded-xl px-4 py-3 transition hover:bg-white/10">আমাদের সম্পর্কে</a>
                <a href="#calculator" className="block rounded-xl px-4 py-3 transition hover:bg-white/10">ক্যালকুলেটর</a>
                <Link href="/login" className="block rounded-xl px-4 py-3 transition hover:bg-white/10">লগইন</Link>
              </div>
            </details>
          </div>
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
          <div>
            <Badge>ডিজিটাল নেটওয়ার্ক কমার্স প্ল্যাটফর্ম</Badge>
            <h1 className="heading-gradient mt-6 max-w-4xl text-5xl font-black leading-tight !text-white md:text-7xl">
              আপনার নেটওয়ার্ক দিয়ে আয় করুন লক্ষাধিক টাকা
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
              GIOTO Bangladesh পণ্য বিক্রয়, রেফারেল নেটওয়ার্ক, কমিশন ট্র্যাকিং এবং সদস্য ব্যবস্থাপনাকে এক জায়গায় সহজ করে।
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="gold-button inline-flex items-center justify-center gap-2 px-7 py-3 font-bold">
                রেজিস্টার করুন <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full border border-elevated bg-transparent px-7 py-3 font-bold text-white transition hover:bg-gold-light/20">
                সদস্য ড্যাশবোর্ড
              </Link>
            </div>
          </div>

          <div className="relative">
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
          </div>
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

      <section id="about" className="bg-elevated px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold text-gold-light">আমাদের সম্পর্কে</p>
            <h2 className="heading-gradient text-3xl font-black leading-tight md:text-5xl">
              পণ্য, রেফারেল ও আয়ের পুরো যাত্রা এক জায়গায় পরিচালনার সহজ প্ল্যাটফর্ম
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted md:text-lg">
              GIOTO Bangladesh এমন একটি সদস্যভিত্তিক commerce platform, যেখানে product catalog, referral journey,
              commission progress, checkout এবং member dashboard একই অভিজ্ঞতায় সাজানো হয়েছে।
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                [ShieldCheck, "স্বচ্ছ আয়ের পথ", "রেফারেল, অর্ডার এবং কমিশনের অগ্রগতি পরিষ্কারভাবে দেখা যায়।"],
                [Layers3, "একসঙ্গে সব module", "Products, referrals, earnings ও profile একই platform-এ।"],
              ].map(([Icon, title, text]) => {
                const TypedIcon = Icon as typeof ShieldCheck;
                return (
                  <div key={String(title)} className="rounded-[18px] border border-line bg-surface p-5">
                    <TypedIcon className="text-gold-light" size={28} />
                    <h3 className="mt-4 text-xl font-bold">{String(title)}</h3>
                    <p className="mt-2 leading-7 text-muted">{String(text)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="overflow-hidden p-0">
            <div className="bg-gold p-6 text-white">
              <p className="text-sm text-white/75">GIOTO overview</p>
              <h3 className="mt-2 text-3xl font-black">Referral commerce system</h3>
            </div>
            <div className="grid gap-0 sm:grid-cols-3">
              {[
                ["৪", "Product categories"],
                ["৬", "Commission levels"],
                ["২৪", "Active referrals"],
              ].map(([value, label]) => (
                <div key={label} className="border-b border-line p-5 sm:border-b-0 sm:border-r last:border-r-0">
                  <p className="text-3xl font-black text-gold-light">{value}</p>
                  <p className="mt-1 text-sm text-muted">{label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4 p-6">
              {["পণ্য নির্বাচন করুন", "রেফারেল লিংক শেয়ার করুন", "আয় ও অগ্রগতি ট্র্যাক করুন"].map((item, index) => (
                <div key={item} className="flex items-center gap-4 rounded-2xl border border-line bg-elevated p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-sm font-black text-white">
                    {toBn(index + 1)}
                  </span>
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading title="কীভাবে কাজ করে" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [UserPlus, "রেজিস্টার", "রেফার কোড দিয়ে সদস্য অ্যাকাউন্ট তৈরি করুন।"],
            [Network, "রেফার", "আপনার অনন্য লিংক শেয়ার করে network দেখুন।"],
            [WalletCards, "আয়", "লেভেল পূর্ণ হলে কমিশন অগ্রগতি আপডেট হয়।"],
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
          <SectionHeading title="আয় ক্যালকুলেটর" text="লেভেল নির্বাচন করলে সম্ভাব্য cumulative earning সঙ্গে সঙ্গে দেখা যাবে।" />
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
          <p className="mx-auto mt-4 max-w-2xl text-white/80">পণ্য শেয়ার করুন, নতুন সদস্য যুক্ত করুন এবং এক জায়গা থেকে আয়ের অগ্রগতি দেখুন।</p>
          <Link href="/register" className="gold-button mt-8 inline-flex items-center gap-2 px-8 py-3 font-bold">
            রেজিস্টার করুন <Copy size={17} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-line bg-foreground text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-9 px-4 py-10 lg:grid-cols-[1.2fr_0.75fr_0.75fr_1fr] lg:gap-10 lg:py-12">
          <div className="col-span-2 flex flex-col items-center text-center lg:col-span-1 lg:items-start lg:text-left">
            <Link href="/" className="inline-flex w-fit items-center">
              <BrandLogo className="h-28 w-72 max-w-full sm:w-[26rem] lg:h-32 lg:w-[32rem]" framed={false} variant="wide" />
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase text-white/50">নেভিগেশন</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <Link href="/products" className="text-white/75 transition hover:text-gold-light">পণ্য</Link>
              <a href="#about" className="text-white/75 transition hover:text-gold-light">আমাদের সম্পর্কে</a>
              <a href="#calculator" className="text-white/75 transition hover:text-gold-light">ক্যালকুলেটর</a>
              <Link href="/dashboard" className="text-white/75 transition hover:text-gold-light">ড্যাশবোর্ড</Link>
              <Link href="/admin" className="text-white/75 transition hover:text-gold-light">অ্যাডমিন</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase text-white/50">অ্যাকাউন্ট</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <Link href="/login" className="text-white/75 transition hover:text-gold-light">লগইন</Link>
              <Link href="/register" className="text-white/75 transition hover:text-gold-light">রেজিস্টার</Link>
              <Link href="/dashboard/profile" className="text-white/75 transition hover:text-gold-light">প্রোফাইল</Link>
              <Link href="/dashboard/earnings" className="text-white/75 transition hover:text-gold-light">আয়</Link>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold uppercase text-white/50">সাপোর্ট</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/75 sm:grid-cols-2 lg:block lg:space-y-3">
              <p className="flex items-center gap-3"><Phone size={16} className="text-gold-light" /> +880 1711-223344</p>
              <p className="flex min-w-0 items-center gap-3"><Mail size={16} className="shrink-0 text-gold-light" /> <span className="break-all">support@giotobangladesh.com</span></p>
              <p className="flex items-center gap-3"><MapPin size={16} className="text-gold-light" /> Dhaka, Bangladesh</p>
            </div>
            <Link href="/register" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-foreground transition hover:bg-gold-light hover:text-white">
              শুরু করুন <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-5">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center text-sm text-white/50 md:flex-row md:items-center md:justify-between md:text-left">
            <p>(c) 2026 GIOTO Bangladesh. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-end">
              <a href="#products" className="transition hover:text-gold-light">Products</a>
              <a href="#about" className="transition hover:text-gold-light">About</a>
              <a href="#calculator" className="transition hover:text-gold-light">Calculator</a>
              <Link href="/privacy-policy" className="transition hover:text-gold-light">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="transition hover:text-gold-light">Terms</Link>
              <Link href="/login" className="transition hover:text-gold-light">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
