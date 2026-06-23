"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShoppingBag, Tag } from "lucide-react";
import { useGetProductsQuery } from "@/lib/api";
import { isOutOfStock, stockLabel, taka } from "@/lib/utils";

export default function PublicProductsPage() {
  const { data, isLoading } = useGetProductsQuery();
  const products = data ?? [];

  return (
    <div>
      <section className="border-b border-line bg-elevated px-4 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-gold-light">Online shop</p>
            <h1 className="mt-2 text-4xl font-black leading-tight md:text-6xl">
              Products
            </h1>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-gold-light">
            <ShoppingBag size={17} />
            {products.length} products
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        {isLoading ? (
          <p className="text-sm text-muted">Loading products...</p>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.length ? (
            products.map((product) => {
              const detailsHref = `/products/${product.id}`;
              const checkoutHref = `/products/${product.id}/checkout`;
              const highlights = product.highlights ?? [];
              const soldOut = isOutOfStock(product.stock);

              return (
                <article
                  key={product.id}
                  className="nexa-card group flex min-h-full flex-col overflow-hidden bg-surface"
                >
                  <Link
                    href={detailsHref}
                    className="relative block aspect-[4/3] overflow-hidden bg-elevated"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    {product.offer ? (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-bold text-white">
                        <Tag size={14} />
                        {product.offer}
                      </span>
                    ) : null}
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex rounded-full border border-gold-light bg-gold-light/20 px-3 py-1 text-xs font-semibold text-gold">
                        {product.category}
                      </span>
                      {product.stock !== undefined ? (
                        <span className="text-xs font-semibold text-gold-light">
                          {stockLabel(product.stock)}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="mt-4 text-xl font-bold">{product.name}</h2>
                    <p className="mt-2 flex-1 text-sm leading-7 text-muted">
                      {product.description}
                    </p>

                    <div className="mt-4 rounded-2xl border border-line bg-elevated p-3">
                      <div className="flex flex-wrap items-end justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted">Offer price</p>
                          <p className="text-xl font-black text-gold-light">
                            {taka(product.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted line-through">
                            {taka(product.originalPrice)}
                          </p>
                          <p className="text-xs font-semibold text-foreground">
                            Save {taka(product.originalPrice - product.price)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {highlights.length ? (
                      <div className="mt-4 space-y-2">
                        {highlights.slice(0, 2).map((item) => (
                          <p
                            key={item}
                            className="flex items-start gap-2 text-sm leading-6 text-muted"
                          >
                            <CheckCircle2
                              className="mt-1 shrink-0 text-gold-light"
                              size={15}
                            />
                            {item}
                          </p>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      <Link
                        href={detailsHref}
                        className="outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition hover:bg-gold/10"
                      >
                        Details
                      </Link>
                      {soldOut ? (
                        <span className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-line bg-elevated px-4 py-2.5 text-sm font-semibold text-muted">
                          Out of stock
                        </span>
                      ) : (
                        <Link
                          href={checkoutHref}
                          className="gold-button inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
                        >
                          Buy
                          <ArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="text-sm text-muted">No products are available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
