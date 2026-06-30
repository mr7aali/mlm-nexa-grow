"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Copy, Eye, MessageCircle, Share2, ShoppingCart, Tag } from "lucide-react";
import { Badge, Button, Modal } from "@/components/ui";
import {
  useGetMeQuery,
  useGetProductsQuery,
} from "@/lib/api";
import type { Product } from "@/lib/api-types";
import { isOutOfStock, stockLabel, taka } from "@/lib/utils";

export default function ProductsPage() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);
  const { data, isLoading } = useGetProductsQuery();
  const { data: me } = useGetMeQuery();
  const productRows = data ?? [];
  const selectedSoldOut = selected ? isOutOfStock(selected.stock) : false;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const selectedCheckoutPath =
    selected && me
      ? `/products/${selected.id}/checkout?ref=${encodeURIComponent(me.referralCode)}`
      : "";
  const link =
    selectedCheckoutPath && !selectedSoldOut
      ? `${origin}${selectedCheckoutPath}`
      : "";
  const shareText = selected
    ? `Checkout ${selected.name} from GIOTO Bangladesh`
    : "Checkout this product from GIOTO Bangladesh";
  const whatsappShareUrl = link
    ? `https://wa.me/?text=${encodeURIComponent(`${shareText}: ${link}`)}`
    : "";
  const facebookShareUrl = link
    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`
    : "";

  useEffect(() => {
    setCopied(false);
  }, [selected?.id]);

  async function handleCopyReferralLink() {
    if (!link) return;

    await navigator.clipboard?.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

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
          const checkoutHref = `/products/${product.id}/checkout`;
          const soldOut = isOutOfStock(product.stock);

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
                  <span className="text-xs font-semibold text-gold-light">{stockLabel(product.stock, "স্টকে আছে", "স্টক", "স্টক শেষ")}</span>
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

                <Link
                  href={soldOut ? "#" : checkoutHref}
                  aria-disabled={soldOut}
                  tabIndex={soldOut ? -1 : undefined}
                  onClick={(event) => {
                    if (soldOut) event.preventDefault();
                  }}
                  className={
                    soldOut
                      ? "mt-5 inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-line bg-elevated px-4 py-2.5 text-sm font-semibold text-muted"
                      : "gold-button mt-5 inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
                  }
                >
                  <ShoppingCart size={16} />
                  {soldOut ? "Stock out" : "Buy now"}
                </Link>

                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Link
                    href={detailsHref}
                    className="gold-button inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold"
                  >
                    <Eye size={16} />
                    বিস্তারিত
                  </Link>
                  <Button variant="outline" className="w-full px-4" disabled={soldOut} onClick={() => setSelected(product)}>
                    {soldOut ? "স্টক শেষ" : "রেফার করুন"}
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
                <Badge tone="gold">ক্রয় ধাপে যুক্ত হবে</Badge>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm text-muted">প্রোডাক্ট রেফারেল চেকআউট</p>
              <div className="break-all rounded-2xl border border-line bg-elevated p-4 text-sm text-gold-light">
                {selectedSoldOut
                  ? "স্টক শেষ, চেকআউট লিংক বন্ধ আছে।"
                  : link || "Referral checkout link is loading..."}
              </div>
              {copied ? (
                <p className="mt-2 text-sm font-semibold text-gold-light" aria-live="polite">
                  Link copied.
                </p>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {selectedSoldOut ? (
                <p className="rounded-2xl border border-line bg-elevated px-4 py-3 text-sm text-muted sm:col-span-3">স্টক শেষ, তাই শেয়ার বন্ধ আছে।</p>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!link}
                    onClick={handleCopyReferralLink}
                    className="w-full"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy link"}
                  </Button>
                  <a
                    href={whatsappShareUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!whatsappShareUrl}
                    onClick={(event) => {
                      if (!whatsappShareUrl) event.preventDefault();
                    }}
                    className="outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition hover:bg-gold/10"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                  <a
                    href={facebookShareUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    aria-disabled={!facebookShareUrl}
                    onClick={(event) => {
                      if (!facebookShareUrl) event.preventDefault();
                    }}
                    className="outline-gold inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition hover:bg-gold/10"
                  >
                    <Share2 size={16} /> Facebook
                  </a>
                </>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
