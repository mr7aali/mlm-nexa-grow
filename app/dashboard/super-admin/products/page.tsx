"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { Boxes, PackagePlus, Search, Tag } from "lucide-react";
import { Badge, Button, Card, Input, Textarea } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { useCreateAdminProductMutation, useGetAdminProductsQuery } from "@/lib/api";
import type { ProductInput } from "@/lib/api-types";
import { taka, toBn } from "@/lib/utils";

const pageSize = 8;

const initialForm = {
  id: "",
  name: "",
  category: "",
  image: "",
  sku: "",
  price: "",
  originalPrice: "",
  commission: "",
  stock: "",
  offer: "",
  offerEnds: "",
  delivery: "",
  description: "",
  full: "",
  highlights: "",
  includes: "",
  details: "",
};

function listFromText(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function detailsFromText(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return {
        label: label?.trim(),
        value: rest.join(":").trim(),
      };
    })
    .filter((item): item is { label: string; value: string } => Boolean(item.label && item.value));
}

export default function SuperAdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const query = useMemo(() => ({
    page,
    limit: pageSize,
    search: search.trim() || undefined,
    category: category.trim() || undefined,
  }), [category, page, search]);
  const { data, isLoading, error } = useGetAdminProductsQuery(query);
  const [createProduct, { isLoading: creating }] = useCreateAdminProductMutation();
  const products = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  function updateField(name: keyof typeof form, value: string) {
    setForm((old) => ({ ...old, [name]: value }));
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const price = Number(form.price);
    const originalPrice = Number(form.originalPrice);
    const commission = form.commission ? Number(form.commission) : undefined;

    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(originalPrice) || originalPrice <= 0) {
      setMessage("সঠিক মূল্য লিখুন।");
      return;
    }

    const payload: ProductInput = {
      id: form.id.trim() || undefined,
      name: form.name.trim(),
      category: form.category.trim(),
      image: form.image.trim(),
      sku: form.sku.trim(),
      price,
      originalPrice,
      commission,
      stock: form.stock.trim() || undefined,
      offer: form.offer.trim() || undefined,
      offerEnds: form.offerEnds.trim() || undefined,
      delivery: form.delivery.trim() || undefined,
      description: form.description.trim() || undefined,
      full: form.full.trim() || undefined,
      highlights: listFromText(form.highlights),
      includes: listFromText(form.includes),
      details: detailsFromText(form.details),
    };

    try {
      await createProduct(payload).unwrap();
      setMessage("পণ্য যোগ হয়েছে।");
      setForm(initialForm);
      setPage(1);
    } catch (err) {
      setMessage(getApiErrorMessage(err, "পণ্য যোগ করা ব্যর্থ হয়েছে"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-gold-light">সুপার অ্যাডমিন</p>
          <h2 className="heading-gradient text-4xl font-black">পণ্য ম্যানেজমেন্ট</h2>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-light">
          <Boxes size={17} />
          মোট {toBn(data?.total ?? 0)} পণ্য
        </div>
      </div>

      {message ? <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p> : null}
      {error ? <p className="rounded-2xl border border-foreground/20 bg-foreground/5 px-4 py-3 text-sm text-foreground">{getApiErrorMessage(error, "পণ্য লোড ব্যর্থ হয়েছে")}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold-light"><PackagePlus size={22} /></span>
            <div>
              <h3 className="text-2xl font-bold">নতুন পণ্য যোগ করুন</h3>
              <p className="text-sm text-muted">এই পণ্যটি পাবলিক catalog-এ দেখা যাবে।</p>
            </div>
          </div>

          <form className="grid gap-4" onSubmit={handleCreate}>
            <div className="grid gap-3 md:grid-cols-2">
              <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="পণ্যের নাম" required />
              <Input value={form.category} onChange={(e) => updateField("category", e.target.value)} placeholder="ক্যাটাগরি" required />
              <Input value={form.sku} onChange={(e) => updateField("sku", e.target.value)} placeholder="SKU" required />
              <Input value={form.id} onChange={(e) => updateField("id", e.target.value)} placeholder="পণ্য ID (optional)" />
              <Input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="অফার মূল্য" required />
              <Input type="number" value={form.originalPrice} onChange={(e) => updateField("originalPrice", e.target.value)} placeholder="নিয়মিত মূল্য" required />
              <Input type="number" value={form.commission} onChange={(e) => updateField("commission", e.target.value)} placeholder="কমিশন" />
              <Input value={form.stock} onChange={(e) => updateField("stock", e.target.value)} placeholder="স্টক" />
            </div>
            <Input value={form.image} onChange={(e) => updateField("image", e.target.value)} placeholder="/products/example.png বা image URL" required />
            <div className="grid gap-3 md:grid-cols-2">
              <Input value={form.offer} onChange={(e) => updateField("offer", e.target.value)} placeholder="অফার টেক্সট" />
              <Input value={form.offerEnds} onChange={(e) => updateField("offerEnds", e.target.value)} placeholder="অফার শেষ" />
            </div>
            <Input value={form.delivery} onChange={(e) => updateField("delivery", e.target.value)} placeholder="ডেলিভারি তথ্য" />
            <Textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="ছোট বিবরণ" />
            <Textarea value={form.full} onChange={(e) => updateField("full", e.target.value)} placeholder="পূর্ণ বিবরণ" />
            <Textarea value={form.highlights} onChange={(e) => updateField("highlights", e.target.value)} placeholder="হাইলাইটস: লাইন বা কমা দিয়ে আলাদা করুন" />
            <Textarea value={form.includes} onChange={(e) => updateField("includes", e.target.value)} placeholder="প্যাকেজ আইটেম: লাইন বা কমা দিয়ে আলাদা করুন" />
            <Textarea value={form.details} onChange={(e) => updateField("details", e.target.value)} placeholder="ডিটেইলস: Label: Value, প্রতি লাইনে একটি" />
            <Button type="submit" disabled={creating}>পণ্য যোগ করুন</Button>
          </form>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="নাম, SKU বা ক্যাটাগরি" className="pl-10" />
              </div>
              <Input value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} placeholder="ক্যাটাগরি ফিল্টার" />
            </div>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            {products.length ? products.map((product) => (
              <article key={product.id} className="nexa-card overflow-hidden bg-surface">
                <div className="relative aspect-[4/3] overflow-hidden bg-elevated">
                  <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
                  {product.offer ? <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-bold text-white"><Tag size={14} />{product.offer}</span> : null}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Badge tone="purple">{product.category}</Badge>
                    <span className="text-xs font-semibold text-gold-light">{product.sku}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted">{product.description}</p>
                  <div className="mt-4 flex items-end justify-between gap-3 rounded-2xl border border-line bg-elevated p-3">
                    <div>
                      <p className="text-xs text-muted">অফার মূল্য</p>
                      <p className="text-lg font-black text-gold-light">{taka(product.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted line-through">{taka(product.originalPrice)}</p>
                      <p className="text-xs font-semibold text-foreground">{product.stock ?? "স্টক তথ্য নেই"}</p>
                    </div>
                  </div>
                </div>
              </article>
            )) : (
              <Card className="p-5">
                <p className="text-sm text-muted">{isLoading ? "পণ্য লোড হচ্ছে..." : "কোনো পণ্য পাওয়া যায়নি।"}</p>
              </Card>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">পৃষ্ঠা {toBn(data?.page ?? page)} / {toBn(totalPages)}</p>
            <div className="flex gap-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((old) => Math.max(1, old - 1))}>আগের</Button>
              <Button disabled={page >= totalPages} onClick={() => setPage((old) => Math.min(totalPages, old + 1))}>পরের</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
