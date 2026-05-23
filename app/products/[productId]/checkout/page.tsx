import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { getProductById, products } from "@/lib/mock-data";
import { taka } from "@/lib/utils";
import { CheckoutForm } from "./checkout-form";

type CheckoutPageProps = {
  params: {
    productId: string;
  };
};

export function generateStaticParams() {
  return products.map((product) => ({
    productId: product.id,
  }));
}

export function generateMetadata({ params }: CheckoutPageProps): Metadata {
  const product = getProductById(params.productId);

  return {
    title: product ? `${product.name} checkout | GIOTO` : "Checkout",
    description: product ? `${product.name} checkout page` : undefined,
  };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const product = getProductById(params.productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href={`/products/${product.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-gold">
        <ArrowLeft size={17} />
        পণ্যের বিস্তারিত
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
        <aside className="space-y-5">
          <div className="rounded-[18px] border border-line bg-surface p-5">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[16px] border border-line bg-elevated">
              <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
            </div>
            <p className="mt-5 text-sm font-semibold text-gold-light">{product.category}</p>
            <h1 className="mt-2 text-3xl font-black leading-tight">{product.name}</h1>
            <p className="mt-3 leading-8 text-muted">{product.description}</p>

            <div className="mt-5 rounded-2xl border border-line bg-elevated p-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm text-muted">অফার মূল্য</p>
                  <p className="mt-1 text-3xl font-black text-gold-light">{taka(product.price)}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted line-through">{taka(product.originalPrice)}</p>
                  <p className="font-semibold text-foreground">{product.offer}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <PackageCheck size={17} />
                {product.stock}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Truck size={17} />
                {product.delivery}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck size={17} />
                নিরাপদ checkout
              </p>
            </div>
          </div>
        </aside>

        <CheckoutForm product={product} />
      </div>
    </div>
  );
}
