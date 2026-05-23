import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, PackageCheck, ShieldCheck, Tag, Truck } from "lucide-react";
import { getProductById, products } from "@/lib/mock-data";
import { taka } from "@/lib/utils";

type PublicProductDetailsPageProps = {
  params: {
    productId: string;
  };
};

export function generateStaticParams() {
  return products.map((product) => ({
    productId: product.id,
  }));
}

export function generateMetadata({ params }: PublicProductDetailsPageProps): Metadata {
  const product = getProductById(params.productId);

  return {
    title: product ? `${product.name} কিনুন | GIOTO` : "পণ্য পাওয়া যায়নি",
    description: product?.description,
  };
}

export default function PublicProductDetailsPage({ params }: PublicProductDetailsPageProps) {
  const product = getProductById(params.productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-gold">
        <ArrowLeft size={17} />
        সব পণ্য
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
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-white">
            <Tag size={16} />
            {product.offer}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-gold-light">{product.category}</p>
            <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">{product.name}</h1>
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
              <span className="inline-flex rounded-full border border-gold bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                সাশ্রয় {taka(product.originalPrice - product.price)}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-elevated p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <PackageCheck size={17} />
                  স্টক
                </p>
                <p className="mt-2 text-sm text-muted">{product.stock}</p>
              </div>
              <div className="rounded-2xl border border-line bg-elevated p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Clock3 size={17} />
                  অফার শেষ
                </p>
                <p className="mt-2 text-sm text-muted">{product.offerEnds}</p>
              </div>
              <div className="rounded-2xl border border-line bg-elevated p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck size={17} />
                  নিশ্চয়তা
                </p>
                <p className="mt-2 text-sm text-muted">ক্যাশ অন ডেলিভারি সুবিধা</p>
              </div>
              <div className="rounded-2xl border border-line bg-elevated p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Truck size={17} />
                  ডেলিভারি
                </p>
                <p className="mt-2 text-sm text-muted">{product.delivery}</p>
              </div>
            </div>

            <Link
              href={`/products/${product.id}/checkout`}
              className="gold-button mt-5 inline-flex w-full min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm font-bold"
            >
              চেকআউট করুন
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="nexa-card p-5">
          <h2 className="text-2xl font-bold">হাইলাইটস</h2>
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
          <h2 className="text-2xl font-bold">প্যাকেজে যা আছে</h2>
          <div className="mt-4 space-y-3">
            {product.includes.map((item) => (
              <div key={item} className="rounded-2xl border border-line bg-elevated px-4 py-3 text-sm font-semibold">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nexa-card mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gold-light">SKU: {product.sku}</p>
            <h2 className="mt-1 text-2xl font-bold">পণ্যের সম্পূর্ণ তথ্য</h2>
          </div>
          <span className="inline-flex rounded-full border border-line bg-elevated px-3 py-1 text-xs font-semibold text-muted">
            {product.category}
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {product.details.map((item) => (
            <div key={item.label} className="rounded-2xl border border-line bg-elevated p-4">
              <p className="text-sm text-muted">{item.label}</p>
              <p className="mt-2 font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
