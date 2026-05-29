"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
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
import { useGetMeQuery, useGetProductQuery } from "@/lib/api";
import { referralLink, taka } from "@/lib/utils";

export default function ProductDetailsPage() {
  const params = useParams<{ productId: string }>();
  const productId = params.productId;
  const { data: product, isLoading, isError } = useGetProductQuery(productId, { skip: !productId });
  const { data: me } = useGetMeQuery();

  if (isLoading) {
    return <p className="text-sm text-muted">Loading product...</p>;
  }

  if (isError || !product) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-gold">
          <ArrowLeft size={17} />
          Back to products
        </Link>
        <div className="rounded-[18px] border border-line bg-surface p-6">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="mt-2 text-muted">This product does not exist in MongoDB.</p>
        </div>
      </div>
    );
  }

  const referralUrl = me ? `${referralLink(me.referralCode)}&product=${product.id}` : "";
  const encodedReferralUrl = encodeURIComponent(referralUrl);
  const encodedShareText = encodeURIComponent(`${product.name} - ${referralUrl}`);
  const highlights = product.highlights ?? [];
  const includes = product.includes ?? [];
  const details = product.details ?? [];

  return (
    <div className="space-y-6">
      <Link href="/dashboard/products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-gold">
        <ArrowLeft size={17} />
        Back to products
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
                <p className="text-sm text-muted">Offer price</p>
                <p className="mt-1 text-4xl font-black text-gold-light">{taka(product.price)}</p>
                <p className="mt-1 text-sm text-muted">
                  Regular price <span className="line-through">{taka(product.originalPrice)}</span>
                </p>
              </div>
              <Badge tone="gold">Save {taka(product.originalPrice - product.price)}</Badge>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoBox icon={<PackageCheck size={17} />} label="Stock" value={product.stock ?? "Available"} />
              <InfoBox icon={<Clock3 size={17} />} label="Offer ends" value={product.offerEnds ?? "Not scheduled"} />
              <InfoBox icon={<ShieldCheck size={17} />} label="Commission" value={taka(product.commission ?? 0)} />
              <InfoBox icon={<Truck size={17} />} label="Delivery" value={product.delivery ?? "Standard delivery"} />
            </div>
          </div>

          <div className="rounded-[18px] border border-line bg-surface p-5">
            <p className="mb-2 text-sm text-muted">Product referral link</p>
            <div className="break-all rounded-2xl border border-line bg-elevated p-4 text-sm text-gold-light">
              {referralUrl || "Referral link loading..."}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <CopyButton value={referralUrl} label="Copy link" />
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
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="nexa-card p-5">
          <h3 className="text-2xl font-bold">Highlights</h3>
          <div className="mt-4 grid gap-3">
            {highlights.length ? highlights.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-elevated p-4">
                <CheckCircle2 className="mt-1 shrink-0 text-gold-light" size={18} />
                <p className="leading-7 text-muted">{item}</p>
              </div>
            )) : <p className="text-sm text-muted">No highlights have been added for this product.</p>}
          </div>
        </div>

        <div className="nexa-card p-5">
          <h3 className="text-2xl font-bold">Package includes</h3>
          <div className="mt-4 space-y-3">
            {includes.length ? includes.map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-elevated px-4 py-3 text-sm font-semibold text-foreground">
                {item}
              </div>
            )) : <p className="text-sm text-muted">No package items have been added.</p>}
          </div>
        </div>
      </section>

      <section className="nexa-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gold-light">SKU: {product.sku}</p>
            <h3 className="mt-1 text-2xl font-bold">Product details</h3>
          </div>
          <Badge tone="muted">{product.category}</Badge>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {details.length ? details.map((item) => (
            <div key={item.label} className="rounded-2xl border border-line bg-elevated p-4">
              <p className="text-sm text-muted">{item.label}</p>
              <p className="mt-2 font-semibold text-foreground">{item.value}</p>
            </div>
          )) : <p className="text-sm text-muted">No extra details have been added.</p>}
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
