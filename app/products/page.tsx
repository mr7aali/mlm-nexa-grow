import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShoppingBag, Tag } from "lucide-react";
import { products } from "@/lib/mock-data";
import { taka } from "@/lib/utils";

export const metadata: Metadata = {
  title: "পণ্য কিনুন | GIOTO",
  description: "GIOTO public product catalog, product details and checkout flow.",
};

export default function PublicProductsPage() {
  return (
    <div>
      <section className="border-b border-line bg-elevated px-4 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-gold-light">অনলাইন শপ</p>
            <h1 className="mt-2 text-4xl font-black leading-tight md:text-6xl">পণ্য কিনুন</h1>
            <p className="mt-4 max-w-2xl leading-8 text-muted">
              এখানে সরাসরি পণ্য দেখা, বিস্তারিত জানা এবং checkout করা যাবে।
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-gold-light">
            <ShoppingBag size={17} />
            {products.length} টি পণ্য
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            const detailsHref = `/products/${product.id}`;
            const checkoutHref = `/products/${product.id}/checkout`;

            return (
              <article key={product.id} className="nexa-card group flex min-h-full flex-col overflow-hidden bg-surface">
                <Link href={detailsHref} className="relative block aspect-[4/3] overflow-hidden bg-elevated">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-bold text-white">
                    <Tag size={14} />
                    {product.offer}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-full border border-gold-light bg-gold-light/20 px-3 py-1 text-xs font-semibold text-gold">
                      {product.category}
                    </span>
                    <span className="text-xs font-semibold text-gold-light">{product.stock}</span>
                  </div>

                  <h2 className="mt-4 text-xl font-bold">{product.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-7 text-muted">{product.description}</p>

                  <div className="mt-4 rounded-2xl border border-line bg-elevated p-3">
                    <div className="flex flex-wrap items-end justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted">অফার মূল্য</p>
                        <p className="text-xl font-black text-gold-light">{taka(product.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted line-through">{taka(product.originalPrice)}</p>
                        <p className="text-xs font-semibold text-foreground">সাশ্রয় {taka(product.originalPrice - product.price)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {product.highlights.slice(0, 2).map((item) => (
                      <p key={item} className="flex items-start gap-2 text-sm leading-6 text-muted">
                        <CheckCircle2 className="mt-1 shrink-0 text-gold-light" size={15} />
                        {item}
                      </p>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <Link
                      href={detailsHref}
                      className="outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition hover:bg-gold/10"
                    >
                      বিস্তারিত
                    </Link>
                    <Link
                      href={checkoutHref}
                      className="gold-button inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
                    >
                      কিনুন
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
