import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { getProductById, products } from "@/lib/mock-data";
import { referralLink, taka } from "@/lib/utils";

type ProductDetailsPageProps = {
  params: {
    productId: string;
  };
};

export function generateStaticParams() {
  return products.map((product) => ({
    productId: product.id,
  }));
}

export function generateMetadata({ params }: ProductDetailsPageProps): Metadata {
  const product = getProductById(params.productId);

  return {
    title: product ? `${product.name} | পণ্য` : "পণ্য পাওয়া যায়নি",
    description: product?.description,
  };
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const product = getProductById(params.productId);

  if (!product) {
    notFound();
  }

  const referralUrl = `${referralLink()}&product=${product.id}`;
  const encodedReferralUrl = encodeURIComponent(referralUrl);
  const encodedShareText = encodeURIComponent(`${product.name} - ${referralUrl}`);

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
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-white">
            <Tag size={16} />
            {product.offer}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-gold-light">{product.category}</p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-foreground md:text-5xl">{product.name}</h2>
            <p className="mt-4 leading-8 text-muted">{product.full}</p>
          </div>

          <div className="rounded-[18px] border border-line bg-surface p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted">অফার মূল্য</p>
                <p className="mt-1 text-4xl font-black text-gold-light">{taka(product.price)}</p>
                <p className="mt-1 text-sm text-muted">
                  নিয়মিত মূল্য <span className="line-through">{taka(product.originalPrice)}</span>
                </p>
              </div>
              <Badge tone="gold">সাশ্রয় {taka(product.originalPrice - product.price)}</Badge>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-elevated p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <PackageCheck size={17} />
                  স্টক
                </p>
                <p className="mt-2 text-sm text-muted">{product.stock}</p>
              </div>
              <div className="rounded-2xl border border-line bg-elevated p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock3 size={17} />
                  অফার শেষ
                </p>
                <p className="mt-2 text-sm text-muted">{product.offerEnds}</p>
              </div>
              <div className="rounded-2xl border border-line bg-elevated p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ShieldCheck size={17} />
                  কমিশন
                </p>
                <p className="mt-2 text-sm text-muted">{taka(product.commission)}</p>
              </div>
              <div className="rounded-2xl border border-line bg-elevated p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Truck size={17} />
                  ডেলিভারি
                </p>
                <p className="mt-2 text-sm text-muted">{product.delivery}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-line bg-surface p-5">
            <p className="mb-2 text-sm text-muted">প্রোডাক্ট রেফারেল লিংক</p>
            <div className="break-all rounded-2xl border border-line bg-elevated p-4 text-sm text-gold-light">{referralUrl}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <CopyButton value={referralUrl} label="লিংক কপি" />
              <a
                href={`https://wa.me/?text=${encodedShareText}`}
                target="_blank"
                rel="noreferrer"
                className="outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition hover:bg-gold/10"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedReferralUrl}`}
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
          <h3 className="text-2xl font-bold">হাইলাইটস</h3>
          <div className="mt-4 grid gap-3">
            {product.highlights.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-elevated p-4">
                <CheckCircle2 className="mt-1 shrink-0 text-gold-light" size={18} />
                <p className="leading-7 text-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="nexa-card p-5">
          <h3 className="text-2xl font-bold">প্যাকেজে যা আছে</h3>
          <div className="mt-4 space-y-3">
            {product.includes.map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-elevated px-4 py-3 text-sm font-semibold text-foreground">
                {item}
              </div>
            ))}
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
          {product.details.map((item) => (
            <div key={item.label} className="rounded-2xl border border-line bg-elevated p-4">
              <p className="text-sm text-muted">{item.label}</p>
              <p className="mt-2 font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
