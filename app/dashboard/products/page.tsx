"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, MessageCircle, Share2, Tag } from "lucide-react";
import { Badge, Button, CopyButton, Modal } from "@/components/ui";
import { useGetMeQuery, useGetProductsQuery } from "@/lib/api";
import type { Product } from "@/lib/api-types";
import { taka } from "@/lib/utils";

export default function ProductsPage() {
  const [selected, setSelected] = useState<Product | null>(null);
  const { data, isLoading } = useGetProductsQuery();
  const { data: me } = useGetMeQuery();
  const productRows = data ?? [];
  const link = selected && me ? `/products/${selected.id}/checkout?ref=${encodeURIComponent(me.referralCode)}` : "";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">পণ্য ক্যাটালগ</p>
        <h2 className="heading-gradient text-4xl font-black">পণ্য</h2>
      </div>

      {isLoading ? <p className="text-sm text-muted">পণ্য লোড হচ্ছে...</p> : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {productRows.length ? productRows.map((product) => {
          const detailsHref = `/dashboard/products/${product.id}`;

          return (
            <article key={product.id} className="nexa-card group relative flex min-h-full flex-col overflow-hidden bg-surface">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-elevated">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                {product.offer ? (
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-bold text-white">
                    <Tag size={14} />
                    {product.offer}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <Badge tone="purple">{product.category}</Badge>
                  <span className="text-xs font-semibold text-gold-light">{product.stock}</span>
                </div>

                <h3 className="mt-4 text-xl font-bold">{product.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-7 text-muted">{product.description}</p>

                <div className="mt-4 rounded-2xl border border-line bg-elevated p-3">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted">অফার মূল্য</p>
                      <p className="text-lg font-black text-gold-light">{taka(product.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted line-through">{taka(product.originalPrice)}</p>
                      <p className="text-xs font-semibold text-foreground">সাশ্রয় {taka(product.originalPrice - product.price)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <Link
                    href={detailsHref}
                    className="gold-button inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
                  >
                    <Eye size={16} />
                    বিস্তারিত
                  </Link>
                  <Button variant="outline" className="w-full px-4" onClick={() => setSelected(product)}>
                    রেফার করুন
                  </Button>
                </div>
              </div>
            </article>
          );
        }) : <p className="text-sm text-muted">পণ্য নেই।</p>}
      </div>

      <Modal open={Boolean(selected)} title={selected?.name ?? "পণ্য"} onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-5">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[18px] border border-line bg-elevated">
              <Image src={selected.image} alt={selected.name} fill sizes="(max-width: 640px) 100vw, 560px" className="object-cover" />
              {selected.offer ? <div className="absolute left-3 top-3 rounded-full bg-foreground px-3 py-1 text-xs font-bold text-white">{selected.offer}</div> : null}
            </div>
            <div className="rounded-[18px] border border-line bg-elevated p-4">
              <p className="text-sm text-muted">পূর্ণ বিবরণ</p>
              <p className="mt-2 leading-8">{selected.full}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <p className="font-bold text-gold-light">{taka(selected.price)}</p>
                <p className="text-sm text-muted line-through">{taka(selected.originalPrice)}</p>
                <Badge tone="gold">কমিশন {taka(selected.commission ?? 0)}</Badge>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm text-muted">প্রোডাক্ট রেফারেল চেকআউট</p>
              <div className="break-all rounded-2xl border border-line bg-elevated p-4 text-sm text-gold-light">{link}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <CopyButton value={link} label="চেকআউট লিংক কপি" />
              <Button variant="outline"><MessageCircle size={16} /> WhatsApp</Button>
              <Button variant="outline"><Share2 size={16} /> Facebook</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
