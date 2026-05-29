"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Network,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  UserPlus,
  WalletCards,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { useGetProductsQuery } from "@/lib/api";
import { taka, toBn } from "@/lib/utils";

const commissionLevels = [
  { level: 1, earning: 200 },
  { level: 2, earning: 600 },
  { level: 3, earning: 2000 },
  { level: 4, earning: 10000 },
  { level: 5, earning: 50000 },
  { level: 6, earning: 300000 },
];

const slideImages = [
  "/slide_image/WhatsApp Image 2026-05-28 at 3.10.54 PM.jpeg",
  "/slide_image/WhatsApp Image 2026-05-28 at 3.12.24 PM.jpeg",
  "/slide_image/WhatsApp Image 2026-05-28 at 3.14.58 PM.jpeg",
  "/slide_image/WhatsApp Image 2026-05-28 at 3.19.59 PM.jpeg",
  "/slide_image/WhatsApp Image 2026-05-28 at 3.32.29 PM.jpeg",
];

export default function Home() {
  const [level, setLevel] = useState(2);
  const [activeSlide, setActiveSlide] = useState(0);
  const { data: products = [], isLoading } = useGetProductsQuery();
  const total = useMemo(
    () => commissionLevels.filter((item) => item.level <= level).reduce((sum, item) => sum + item.earning, 0),
    [level],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slideImages.length);
    }, 3800);

    return () => window.clearInterval(timer);
  }, []);

  function showPreviousSlide() {
    setActiveSlide((current) => (current - 1 + slideImages.length) % slideImages.length);
  }

  function showNextSlide() {
    setActiveSlide((current) => (current + 1) % slideImages.length);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="sticky top-0 z-40 border-b border-gold bg-gold text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:py-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <BrandLogo className="h-11 w-28 sm:h-12 sm:w-44 md:h-14 md:w-56" priority framed={false} variant="wide" />
          </Link>
          <div className="hidden items-center gap-7 text-sm text-white/85 md:flex">
            <Link href="/products" className="hover:text-white">Products</Link>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#calculator" className="hover:text-white">Calculator</a>
            <Link href="/login" className="hover:text-white">Login</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/register" className="shrink-0 rounded-full bg-elevated px-4 py-2 text-sm font-bold text-gold transition hover:bg-elevated/90 sm:px-5 sm:py-2.5">Join</Link>
            <details className="group relative md:hidden">
              <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-white/25 text-white transition hover:bg-white/10 [&::-webkit-details-marker]:hidden">
                <Menu className="group-open:hidden" size={20} />
                <X className="hidden group-open:block" size={20} />
                <span className="sr-only">Menu</span>
              </summary>
              <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-white/15 bg-gold p-2 text-sm font-semibold text-white shadow-2xl">
                <Link href="/products" className="block rounded-xl px-4 py-3 transition hover:bg-white/10">Products</Link>
                <a href="#about" className="block rounded-xl px-4 py-3 transition hover:bg-white/10">About</a>
                <a href="#calculator" className="block rounded-xl px-4 py-3 transition hover:bg-white/10">Calculator</a>
                <Link href="/login" className="block rounded-xl px-4 py-3 transition hover:bg-white/10">Login</Link>
              </div>
            </details>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gold text-white">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge>MLM commerce platform</Badge>
            <h1 className="heading-gradient mt-6 max-w-4xl text-5xl font-black leading-tight !text-white md:text-7xl">
              Build your referral business with live account data.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90">
              GIOTO Bangladesh connects product checkout, sponsor registration, referral tracking, commission progress, and member dashboards through one backend.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="gold-button inline-flex items-center justify-center gap-2 px-7 py-3 font-bold">
                Register <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full border border-elevated bg-transparent px-7 py-3 font-bold text-white transition hover:bg-gold-light/20">
                Member dashboard
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/25 bg-white/10 p-3 shadow-2xl backdrop-blur">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
              <Image
                src={slideImages[activeSlide]}
                alt="GIOTO product and business visuals"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button type="button" onClick={showPreviousSlide} className="grid h-11 w-11 place-items-center rounded-full border border-white/35 text-white hover:bg-white/10" aria-label="Previous slide">
                <ArrowLeft size={18} />
              </button>
              <div className="flex gap-2">
                {slideImages.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${activeSlide === index ? "w-8 bg-white" : "w-2.5 bg-white/45"}`}
                  />
                ))}
              </div>
              <button type="button" onClick={showNextSlide} className="grid h-11 w-11 place-items-center rounded-full border border-white/35 text-white hover:bg-white/10" aria-label="Next slide">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold text-gold-light">Online shop</p>
            <h2 className="heading-gradient text-3xl font-bold leading-tight md:text-5xl">Live products</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
              This section reads from MongoDB through the Express API. Empty database means empty product list.
            </p>
          </div>
          <Link href="/products" className="outline-gold inline-flex w-fit items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold transition hover:bg-gold/10">
            <ShoppingBag size={17} />
            All products
          </Link>
        </div>

        {isLoading ? <p className="mb-4 text-sm text-muted">Loading products...</p> : null}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {products.length ? products.map((product) => (
            <Card key={product.id} asMotion className="flex min-h-full flex-col overflow-hidden p-0">
              <Link href={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-elevated">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-300 hover:scale-105"
                />
                {product.offer ? (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-bold text-white">
                    <Tag size={14} />
                    {product.offer}
                  </span>
                ) : null}
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
                    Buy
                  </Link>
                </div>
              </div>
            </Card>
          )) : (
            <Card className="p-5">
              <p className="text-sm text-muted">No products are available yet.</p>
            </Card>
          )}
        </div>
      </section>

      <section id="about" className="bg-elevated px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold text-gold-light">About</p>
            <h2 className="heading-gradient text-3xl font-black leading-tight md:text-5xl">
              Product sales, referrals, and earnings are managed from one live system.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted md:text-lg">
              A new account starts with zero referrals, zero downline, and zero earnings. Referral records are created only when another member registers with that account&apos;s referral code.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                [ShieldCheck, "Scoped member data", "Dashboard pages only read data owned by the logged-in user."],
                [Layers3, "Modular backend", "Auth, products, dashboard, and admin API modules are separated."],
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
                [toBn(products.length), "Live products"],
                [toBn(commissionLevels.length), "Commission levels"],
                ["0", "Demo referrals shown"],
              ].map(([value, label]) => (
                <div key={label} className="border-b border-line p-5 sm:border-b-0 sm:border-r last:border-r-0">
                  <p className="text-3xl font-black text-gold-light">{value}</p>
                  <p className="mt-1 text-sm text-muted">{label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4 p-6">
              {["Create an account", "Share your own referral link", "Track only your real network"].map((item, index) => (
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
        <SectionHeading title="How it works" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [UserPlus, "Register", "Create a member account with an optional sponsor code."],
            [Network, "Refer", "Share your own link and build a real downline."],
            [WalletCards, "Earn", "Commissions update from backend records, not frontend placeholders."],
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
          <SectionHeading title="Earning calculator" text="Select a level to preview the cumulative commission plan." />
        </div>
        <Card className="p-6">
          <label className="text-sm text-muted">Select level</label>
          <select value={level} onChange={(event) => setLevel(Number(event.target.value))} className="mt-2 h-12 w-full rounded-2xl border border-line bg-elevated px-4 outline-none focus:border-gold">
            {commissionLevels.map((item) => <option key={item.level} value={item.level}>Level {toBn(item.level)}</option>)}
          </select>
          <div className="mt-6 rounded-[20px] border border-gold/20 bg-gold/10 p-6">
            <p className="text-muted">Potential total earning</p>
            <p className="mt-2 text-5xl font-black text-gold-light">{taka(total)}</p>
          </div>
        </Card>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-line bg-[radial-gradient(circle_at_50%_0%,rgba(232,82,10,0.24),rgba(26,26,26,1)_45%)] p-8 text-center md:p-14">
          <Sparkles className="mx-auto text-gold-light" size={42} />
          <h2 className="heading-gradient mt-4 text-4xl font-black !text-white md:text-6xl">Start with a clean account.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">Your dashboard stays empty until your own referral activity creates records in MongoDB.</p>
          <Link href="/register" className="gold-button mt-8 inline-flex items-center gap-2 px-8 py-3 font-bold">
            Register <Copy size={17} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-line bg-foreground text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-9 px-4 py-10 lg:grid-cols-[1.2fr_0.75fr_0.75fr_1fr] lg:gap-10 lg:py-12">
          <div className="col-span-2 flex flex-col items-center text-center lg:col-span-1">
            <Link href="/" className="inline-flex w-fit items-center">
              <BrandLogo className="h-28 w-72 max-w-full sm:w-[26rem] lg:h-32 lg:w-[32rem]" framed={false} variant="wide" />
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase text-white/50">Navigation</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <Link href="/products" className="text-white/75 transition hover:text-gold-light">Products</Link>
              <a href="#about" className="text-white/75 transition hover:text-gold-light">About</a>
              <a href="#calculator" className="text-white/75 transition hover:text-gold-light">Calculator</a>
              <Link href="/dashboard" className="text-white/75 transition hover:text-gold-light">Dashboard</Link>
              <Link href="/admin" className="text-white/75 transition hover:text-gold-light">Admin</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase text-white/50">Account</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <Link href="/login" className="text-white/75 transition hover:text-gold-light">Login</Link>
              <Link href="/register" className="text-white/75 transition hover:text-gold-light">Register</Link>
              <Link href="/dashboard/profile" className="text-white/75 transition hover:text-gold-light">Profile</Link>
              <Link href="/dashboard/earnings" className="text-white/75 transition hover:text-gold-light">Earnings</Link>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold uppercase text-white/50">Support</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/75 sm:grid-cols-2 lg:block lg:space-y-3">
              <p className="flex items-center gap-3"><Phone size={16} className="text-gold-light" /> +8809658979698</p>
              <p className="flex min-w-0 items-center gap-3"><Mail size={16} className="shrink-0 text-gold-light" /> <span className="break-all">contact@giotobangladesh.com</span></p>
              <p className="flex items-start gap-3"><MapPin size={16} className="mt-1 shrink-0 text-gold-light" /> <span>Nischintapur, Ashulia, Savar, Dhaka, Bangladesh</span></p>
            </div>
            <Link href="/register" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-foreground transition hover:bg-gold-light hover:text-white">
              Start <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-5">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center text-sm text-white/50 md:flex-row md:items-center md:justify-between md:text-left">
            <p>(c) 2026 GIOTO Bangladesh. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-end">
              <Link href="/privacy-policy" className="transition hover:text-gold-light">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="transition hover:text-gold-light">Terms and Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
