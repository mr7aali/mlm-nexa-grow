"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Copy, Gift, Layers3, Mail, MapPin, Menu, Network, Phone, ShieldCheck, ShoppingBag, Sparkles, Tag, UserPlus, WalletCards, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { commissionLevels, products } from "@/lib/mock-data";
import { taka, toBn } from "@/lib/utils";

const testimonials = [
  { name: "তানিয়া", text: "প্রথম মাসেই নিজের পরিচিত নেটওয়ার্ক সাজিয়ে নিয়মিত আয়ের পথ দেখেছি।", earning: 12000 },
  { name: "মাহিন", text: "ড্যাশবোর্ডে লেভেল ট্র্যাকিং থাকায় কে কোথায় আছে পরিষ্কার বোঝা যায়।", earning: 28500 },
  { name: "সাবিহা", text: "পণ্য রেফার করা, লিংক কপি করা আর কমিশন দেখা খুব সহজ।", earning: 8200 },
];

const slideImages = [
  "/slide_image/WhatsApp Image 2026-05-28 at 3.10.54 PM.jpeg",
  "/slide_image/WhatsApp Image 2026-05-28 at 3.12.24 PM.jpeg",
  "/slide_image/WhatsApp Image 2026-05-28 at 3.14.58 PM.jpeg",
  "/slide_image/WhatsApp Image 2026-05-28 at 3.19.59 PM.jpeg",
  "/slide_image/WhatsApp Image 2026-05-28 at 3.32.29 PM.jpeg",
];

function FacebookIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.2 8.1V6.6c0-.8.5-1 1-1h1.9V2.3L14.5 2c-3 0-4.8 1.8-4.8 5v1.1H6.9v3.7h2.8V22h4.1V11.8h2.8l.5-3.7h-3Z" />
    </svg>
  );
}

function YouTubeIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.6 7.2s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C15.2 3.7 12 3.7 12 3.7s-3.2 0-6.4.2c-.5.1-1.4.1-2.3 1-.7.7-.9 2.3-.9 2.3S2.2 9.1 2.2 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 6.1.2 6.1.2s3.2 0 6.4-.3c.5 0 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8ZM10.1 14.9V8.4l5.8 3.3-5.8 3.2Z" />
    </svg>
  );
}

function XSocialIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.7 10.4 22 2h-1.7l-6.4 7.3L8.8 2H3l7.7 11L3 22h1.7l6.8-7.8L17 22h5.8l-8.1-11.6Zm-2.4 2.7-.8-1.1-6.2-8.7H8l5 7.1.8 1.1 6.5 9.2h-2.7l-5.3-7.6Z" />
    </svg>
  );
}

function TikTokIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 2c.3 2.3 1.6 3.8 3.9 4v3.5c-1.3.1-2.6-.3-3.8-1.1v6.8c0 4.4-3 6.8-6.4 6.8-3.1 0-5.8-2.3-5.8-5.6 0-3.6 2.9-5.7 6.3-5.7.4 0 .8 0 1.1.1v3.7a3.9 3.9 0 0 0-1.3-.2c-1.4 0-2.5.8-2.5 2 0 1.3 1.1 2 2.3 2 1.4 0 2.4-.8 2.4-2.8V2h3.8Z" />
    </svg>
  );
}

function PinterestIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.1 2C6.6 2 3 5.6 3 10.4c0 3.2 1.8 5.1 3.5 5.1.6 0 .9-1.6.9-2.1 0-.5-1.3-1.6-1.3-3.6 0-3.1 2.4-5.4 5.6-5.4 2.7 0 4.8 1.6 4.8 4.4 0 2.1-.9 6-3.6 6-1 0-1.8-.7-1.8-1.7 0-1.5 1-2.9 1-4.4 0-2.4-3.4-2-3.4 1.1 0 .7.1 1.4.4 2l-1.6 6.8c-.3 1.2 0 3.1.1 3.2.1.1.2.1.3 0 .5-.7 1.5-2.5 1.8-3.6.1-.4.6-2.3.6-2.3.6 1.1 1.9 1.8 3.2 1.8 4.2 0 7.2-3.9 7.2-8.7C20.7 5.1 17.3 2 12.1 2Z" />
    </svg>
  );
}

function ThreadsIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M16.4 11.1c-.2-3.2-1.9-5-4.8-5-2.1 0-3.8 1-4.8 2.8m9.7 5.5c-.7 2.2-2.5 3.5-5.1 3.5-3.8 0-6.2-2.8-6.2-7.1C5.2 6.5 7.7 3.8 11.8 3.8c3.8 0 6.2 2.4 6.8 6.9.3 2 .2 4.5-.4 6.1-.8 2.3-2.7 3.4-5.9 3.4-3.3 0-5.8-1.2-7.2-3.5-1.2-2-1.5-4.8-.9-8.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M14.8 11.4c-.8-.4-1.8-.6-2.8-.6-1.9 0-3 .9-3 2.2s1.1 2.1 2.7 2.1c1.9 0 3.1-1.2 3.1-2.9 0-.3 0-.5-.1-.8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function TelegramIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.7 4.4 18.5 19c-.2 1-.8 1.3-1.6.8l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.4-4.9 8.9-8c.4-.4-.1-.6-.6-.2L6.4 12.8l-4.7-1.5c-1-.3-1-1 .2-1.5L20.2 2.7c.9-.3 1.7.2 1.5 1.7Z" />
    </svg>
  );
}

function InstagramIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="16" height="16" x="4" y="4" rx="4.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.8 8.9H3.2V21h3.6V8.9ZM5 3C3.8 3 3 3.8 3 4.8s.8 1.8 2 1.8 2-.8 2-1.8S6.2 3 5 3Zm16 11.1c0-3.5-1.9-5.2-4.5-5.2-2.1 0-3 1.2-3.5 2V8.9H9.4V21H13v-6c0-1.6.3-3.1 2.3-3.1 1.9 0 1.9 1.8 1.9 3.2V21H21v-6.9Z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.4 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.9a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.5c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.1 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.2-.3-.3-.5-.4Z" />
    </svg>
  );
}

function ImoIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <text x="12" y="15.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8.6" fontWeight="800">
        imo
      </text>
    </svg>
  );
}

export default function Home() {
  const [level, setLevel] = useState(2);
  const [activeSlide, setActiveSlide] = useState(0);
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
            <div className="absolute inset-6 rounded-full bg-white/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-white/25 bg-white/10 p-6 shadow-2xl backdrop-blur md:p-8">
              <div className="flex items-center justify-between gap-4">
                <BrandLogo className="h-20 w-52 sm:h-24 sm:w-72" framed={false} variant="wide" />
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                  <Sparkles size={24} />
                </span>
              </div>

              <div className="mt-8 grid gap-3">
                {[
                  [ShoppingBag, "পণ্য নির্বাচন", "পছন্দের পণ্য দেখে দ্রুত অর্ডার করুন"],
                  [Network, "নেটওয়ার্ক বৃদ্ধি", "রেফারেল শেয়ার করে সদস্য যুক্ত করুন"],
                  [WalletCards, "আয়ের হিসাব", "ড্যাশবোর্ডে ইনকাম ও অগ্রগতি দেখুন"],
                ].map(([Icon, title, text]) => {
                  const TypedIcon = Icon as typeof ShoppingBag;
                  return (
                    <div key={String(title)} className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/12 p-4 text-left">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-gold">
                        <TypedIcon size={20} />
                      </span>
                      <span>
                        <span className="block text-base font-black text-white">{String(title)}</span>
                        <span className="mt-1 block text-sm leading-6 text-white/75">{String(text)}</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  ["৮+", "Product"],
                  ["৬", "Level"],
                  ["২৪/৭", "Support"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <p className="text-2xl font-black text-white">{value}</p>
                    <p className="mt-1 text-xs font-semibold text-white/65">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 md:pt-10">
        <div className="relative overflow-hidden rounded-xl border border-line bg-surface shadow-[0_18px_55px_rgba(232,82,10,0.12)]">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slideImages.map((src, index) => (
              <div key={src} className="relative h-[190px] w-full shrink-0 overflow-hidden sm:h-[280px] lg:h-[465px]">
                <Image
                  src={src}
                  alt={`GIOTO promotional slide ${index + 1}`}
                  fill
                  sizes="(min-width: 1280px) 1280px, 100vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2 sm:bottom-6 sm:left-8">
            {slideImages.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                aria-current={activeSlide === index}
                onClick={() => setActiveSlide(index)}
                className={`h-3 w-3 rounded-full transition ${
                  activeSlide === index ? "bg-gold" : "bg-white/85 hover:bg-white"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={showPreviousSlide}
            className="absolute left-0 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-white text-gold shadow-lg transition hover:bg-gold hover:text-white sm:left-4 sm:rounded-full"
          >
            <ArrowLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={showNextSlide}
            className="absolute right-0 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center bg-white text-gold shadow-lg transition hover:bg-gold hover:text-white sm:right-4 sm:rounded-full"
          >
            <ArrowRight size={22} />
          </button>
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
          <div className="col-span-2 flex flex-col items-center text-center lg:col-span-1">
            <Link href="/" className="inline-flex w-fit items-center">
              <BrandLogo className="h-28 w-72 max-w-full sm:w-[26rem] lg:h-32 lg:w-[32rem]" framed={false} variant="wide" />
            </Link>
            <div className="mt-5 grid grid-cols-5 place-items-center gap-3">
              {[
                { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61582547472235", icon: FacebookIcon },
                { label: "YouTube", href: "https://youtube.com/@gioto_bangladesh?si=Pfbkqjy72UQU5dQn", icon: YouTubeIcon },
                { label: "X", href: "https://x.com/GiotoBangladesh", icon: XSocialIcon },
                { label: "TikTok", href: "https://www.tiktok.com/@urbanbro_bd?_r=1&_t=ZS-96fHDwNlUo8", icon: TikTokIcon },
                { label: "Pinterest", href: "https://pin.it/5pev5NgTM", icon: PinterestIcon },
                { label: "Threads", href: "https://www.threads.com/@gioto_bd", icon: ThreadsIcon },
                { label: "Telegram", href: "https://t.me/gioto_bangladesh", icon: TelegramIcon },
                { label: "Instagram", href: "https://www.instagram.com/gioto_bd?igsh=MWZ3NjV6NHZ0bGY2eA==", icon: InstagramIcon },
                { label: "LinkedIn", href: "https://www.linkedin.com/groups/19487010", icon: LinkedInIcon },
                { label: "WhatsApp", href: "https://wa.me/8801312684708", icon: WhatsAppIcon },
                { label: "Imo", href: "https://s.channelcom.tech/ZgLqeu?from=copy_link", icon: ImoIcon },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white/75 transition hover:border-gold-light hover:bg-gold-light hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
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
              <Link href="/privacy-policy" className="transition hover:text-gold-light">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="transition hover:text-gold-light">Terms and Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
