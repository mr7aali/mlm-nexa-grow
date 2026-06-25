"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MessageCircle,
  PackageCheck,
  Share2,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";
import { Badge, CopyButton } from "@/components/ui";
import {
  useGetMeQuery,
  useGetProductQuery,
} from "@/lib/api";
import { isOutOfStock, stockLabel, taka } from "@/lib/utils";

export default function ProductDetailsPage() {
  const params = useParams<{ productId: string }>();
  const productId = params.productId;
  const { data: product, isLoading, isError } = useGetProductQuery(productId, { skip: !productId });
  const { data: me } = useGetMeQuery();

  if (isLoading) {
    return <p className="text-sm text-muted">পণ্য লোড হচ্ছে...</p>;
  }

  if (isError || !product) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-gold">
          <ArrowLeft size={17} />
          পণ্যে ফিরে যান
        </Link>
        <div className="rounded-[18px] border border-line bg-surface p-6">
          <h2 className="text-2xl font-bold">পণ্য পাওয়া যায়নি</h2>
          <p className="mt-2 text-muted">এই পণ্যটি লাইভ ক্যাটালগে নেই।</p>
        </div>
      </div>
    );
  }

  const soldOut = isOutOfStock(product.stock);
  const referralUrl =
    me && !soldOut
      ? `/products/${product.id}/checkout?ref=${encodeURIComponent(me.referralCode)}`
      : "";
  const encodedReferralUrl = encodeURIComponent(referralUrl);
  const encodedShareText = encodeURIComponent(`${product.name} - ${referralUrl}`);
  const highlights = product.highlights ?? [];
  const includes = product.includes ?? [];
  const details = product.details ?? [];

  return (
    <div className="space-y-6">
      <Link href="/dashboard/products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-gold">
        <ArrowLeft size={17} />
        পণ্যে ফিরে যান
      </Link>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
        <div className="relative overflow-hidden rounded-[18px] border border-line bg-surface">
          <div className="relative aspect-[16/11] min-h-[280px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
          {product.offer ? (
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-white">
              <Tag size={16} />
              {product.offer}
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-gold-light">{product.category}</p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-foreground md:text-5xl">{product.name}</h2>
            <p className="mt-4 leading-8 text-muted">{product.full ?? product.description}</p>
          </div>

          <div className="rounded-[18px] border border-line bg-surface p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted">অফার মূল্য</p>
                <p className="mt-1 text-4xl font-black text-gold-light">{taka(product.price)}</p>
                <p className="mt-1 text-sm text-muted">
                  নিয়মিত মূল্য <span className="line-through">{taka(product.originalPrice)}</span>
                </p>
              </div>
              <Badge tone="gold">সাশ্রয় {taka(product.originalPrice - product.price)}</Badge>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoBox icon={<PackageCheck size={17} />} label="স্টক" value={stockLabel(product.stock, "স্টকে আছে", "স্টক", "স্টক শেষ")} />
              <InfoBox icon={<Clock3 size={17} />} label="অফার শেষ" value={product.offerEnds ?? "নির্ধারিত নয়"} />
              <InfoBox icon={<ShieldCheck size={17} />} label="কমিশন ধাপ" value="প্রতিটি নিশ্চিত ক্রয় ধাপে যুক্ত হবে" />
              <InfoBox icon={<Truck size={17} />} label="ডেলিভারি" value={product.delivery ?? "স্ট্যান্ডার্ড ডেলিভারি"} />
            </div>
          </div>

          <div className="rounded-[18px] border border-line bg-surface p-5">
            <p className="mb-2 text-sm text-muted">প্রোডাক্ট রেফারেল চেকআউট</p>
            <div className="break-all rounded-2xl border border-line bg-elevated p-4 text-sm text-gold-light">
              {soldOut ? "স্টক শেষ, চেকআউট লিংক বন্ধ আছে।" : referralUrl || "চেকআউট লিংক লোড হচ্ছে..."}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {soldOut ? (
                <p className="rounded-2xl border border-line bg-elevated px-4 py-3 text-sm text-muted sm:col-span-3">স্টক শেষ, তাই শেয়ার বন্ধ আছে।</p>
              ) : (
                <>
                  <CopyButton value={referralUrl} label="চেকআউট লিংক কপি" />
                  <a
                    href={referralUrl ? `https://wa.me/?text=${encodedShareText}` : undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition hover:bg-gold/10"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                  <a
                    href={referralUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodedReferralUrl}` : undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition hover:bg-gold/10"
                  >
                    <Share2 size={16} />
                    Facebook
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="nexa-card p-5">
          <h3 className="text-2xl font-bold">হাইলাইটস</h3>
          <div className="mt-4 grid gap-3">
            {highlights.length ? highlights.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-elevated p-4">
                <CheckCircle2 className="mt-1 shrink-0 text-gold-light" size={18} />
                <p className="leading-7 text-muted">{item}</p>
              </div>
            )) : <p className="text-sm text-muted">এই পণ্যের হাইলাইটস নেই।</p>}
          </div>
        </div>

        <div className="nexa-card p-5">
          <h3 className="text-2xl font-bold">প্যাকেজে যা আছে</h3>
          <div className="mt-4 space-y-3">
            {includes.length ? includes.map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-elevated px-4 py-3 text-sm font-semibold text-foreground">
                {item}
              </div>
            )) : <p className="text-sm text-muted">প্যাকেজ আইটেম নেই।</p>}
          </div>
        </div>
      </section>

      <section className="nexa-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gold-light">SKU: {product.sku}</p>
            <h3 className="mt-1 text-2xl font-bold">পণ্যের সম্পূর্ণ তথ্য</h3>
          </div>
          <Badge tone="muted">{product.category}</Badge>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {details.length ? details.map((item) => (
            <div key={item.label} className="rounded-2xl border border-line bg-elevated p-4">
              <p className="text-sm text-muted">{item.label}</p>
              <p className="mt-2 font-semibold text-foreground">{item.value}</p>
            </div>
          )) : <p className="text-sm text-muted">অতিরিক্ত তথ্য নেই।</p>}
        </div>
      </section>
    </div>
  );
}

function InfoBox({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-elevated p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-sm text-muted">{value}</p>
    </div>
  );
}
