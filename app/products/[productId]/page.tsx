"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, PackageCheck, ShieldCheck, Tag, Truck } from "lucide-react";
import { useGetProductQuery } from "@/lib/api";
import { taka } from "@/lib/utils";

export default function PublicProductDetailsPage() {
  const params = useParams<{ productId: string }>();
  const productId = params.productId;
  const { data: product, isLoading, isError } = useGetProductQuery(productId, { skip: !productId });

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted">Loading product...</div>;
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-gold">
          <ArrowLeft size={17} />
          All products
        </Link>
        <div className="mt-6 rounded-[18px] border border-line bg-surface p-6">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="mt-2 text-muted">This product does not exist in the live catalog.</p>
        </div>
      </div>
    );
  }

  const highlights = product.highlights ?? [];
  const includes = product.includes ?? [];
  const details = product.details ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-gold">
        <ArrowLeft size={17} />
        All products
      </Link>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
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
            <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">{product.name}</h1>
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
              <span className="inline-flex rounded-full border border-gold bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                Save {taka(product.originalPrice - product.price)}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoBox icon={<PackageCheck size={17} />} label="Stock" value={product.stock ?? "Available"} />
              <InfoBox icon={<Clock3 size={17} />} label="Offer ends" value={product.offerEnds ?? "Not scheduled"} />
              <InfoBox icon={<ShieldCheck size={17} />} label="Payment" value="Cash on delivery available" />
              <InfoBox icon={<Truck size={17} />} label="Delivery" value={product.delivery ?? "Standard delivery"} />
            </div>

            <Link
              href={`/products/${product.id}/checkout`}
              className="gold-button mt-5 inline-flex w-full min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm font-bold"
            >
              Checkout
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="nexa-card p-5">
          <h2 className="text-2xl font-bold">Highlights</h2>
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
          <h2 className="text-2xl font-bold">Package includes</h2>
          <div className="mt-4 space-y-3">
            {includes.length ? includes.map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-elevated px-4 py-3 text-sm font-semibold">
                {item}
              </div>
            )) : <p className="text-sm text-muted">No package items have been added.</p>}
          </div>
        </div>
      </section>

      <section className="nexa-card mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gold-light">SKU: {product.sku}</p>
            <h2 className="mt-1 text-2xl font-bold">Product details</h2>
          </div>
          <span className="inline-flex rounded-full border border-line bg-elevated px-3 py-1 text-xs font-semibold text-muted">
            {product.category}
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {details.length ? details.map((item) => (
            <div key={item.label} className="rounded-2xl border border-line bg-elevated p-4">
              <p className="text-sm text-muted">{item.label}</p>
              <p className="mt-2 font-semibold">{item.value}</p>
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
      <p className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-sm text-muted">{value}</p>
    </div>
  );
}
