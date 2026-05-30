"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Boxes, Eye, ImagePlus, PackagePlus, Pencil, Plus, Search, Tag, Trash2, X } from "lucide-react";
import { Badge, Button, Card, Input, Textarea } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useCreateAdminProductMutation,
  useDeleteAdminProductMutation,
  useGetAdminProductsQuery,
  useUpdateAdminProductMutation,
  useUploadAdminProductImageMutation,
} from "@/lib/api";
import type { Product, ProductInput, ProductUpdateInput } from "@/lib/api-types";
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

type ProductForm = typeof initialForm;

function listFromText(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function textFromList(value?: string[]) {
  return value?.join("\n") ?? "";
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

function textFromDetails(value?: Array<{ label: string; value: string }>) {
  return value?.map((item) => `${item.label}: ${item.value}`).join("\n") ?? "";
}

function formFromProduct(product: Product): ProductForm {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    image: product.image,
    sku: product.sku,
    price: String(product.price),
    originalPrice: String(product.originalPrice),
    commission: product.commission === undefined ? "" : String(product.commission),
    stock: product.stock ?? "",
    offer: product.offer ?? "",
    offerEnds: product.offerEnds ?? "",
    delivery: product.delivery ?? "",
    description: product.description ?? "",
    full: product.full ?? "",
    highlights: textFromList(product.highlights),
    includes: textFromList(product.includes),
    details: textFromDetails(product.details),
  };
}

export default function SuperAdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [message, setMessage] = useState("");
  const query = useMemo(() => ({
    page,
    limit: pageSize,
    search: search.trim() || undefined,
    category: category.trim() || undefined,
  }), [category, page, search]);
  const { data, isLoading, error } = useGetAdminProductsQuery(query);
  const [createProduct, { isLoading: creating }] = useCreateAdminProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateAdminProductMutation();
  const [deleteProduct, { isLoading: deleting }] = useDeleteAdminProductMutation();
  const [uploadImage, { isLoading: uploadingImage }] = useUploadAdminProductImageMutation();
  const products = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const saving = creating || updating;
  const formMode = editingProductId ? "edit" : "create";

  function updateField(name: keyof ProductForm, value: string) {
    setForm((old) => ({ ...old, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingProductId(null);
    setShowForm(false);
  }

  function startCreate() {
    setMessage("");
    setForm(initialForm);
    setEditingProductId(null);
    setShowForm(true);
  }

  function startEdit(product: Product) {
    setMessage("");
    setForm(formFromProduct(product));
    setEditingProductId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setMessage("");

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("শুধু image file আপলোড করা যাবে।");
      return;
    }

    try {
      const uploaded = await uploadImage(file).unwrap();
      updateField("image", uploaded.url);
      setMessage("ছবি আপলোড হয়েছে।");
    } catch (err) {
      setMessage(getApiErrorMessage(err, "ছবি আপলোড ব্যর্থ হয়েছে"));
    }
  }

  function buildPayload(): ProductInput {
    const price = Number(form.price);
    const originalPrice = Number(form.originalPrice);
    const commission = form.commission ? Number(form.commission) : undefined;

    if (!form.image) {
      throw new Error("পণ্যের ছবি আপলোড করুন।");
    }
    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(originalPrice) || originalPrice <= 0) {
      throw new Error("সঠিক মূল্য লিখুন।");
    }
    if (commission !== undefined && (!Number.isFinite(commission) || commission < 0)) {
      throw new Error("সঠিক কমিশন লিখুন।");
    }

    return {
      id: form.id.trim() || undefined,
      name: form.name.trim(),
      category: form.category.trim(),
      image: form.image,
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
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    let payload: ProductInput;
    try {
      payload = buildPayload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "পণ্যের তথ্য সঠিক নয়।");
      return;
    }

    try {
      if (editingProductId) {
        const body: ProductUpdateInput = {
          name: payload.name,
          category: payload.category,
          image: payload.image,
          sku: payload.sku,
          price: payload.price,
          originalPrice: payload.originalPrice,
          commission: payload.commission,
          stock: payload.stock,
          offer: payload.offer,
          offerEnds: payload.offerEnds,
          delivery: payload.delivery,
          description: payload.description,
          full: payload.full,
          highlights: payload.highlights,
          includes: payload.includes,
          details: payload.details,
        };
        await updateProduct({ productId: editingProductId, body }).unwrap();
        setMessage("পণ্য আপডেট হয়েছে।");
      } else {
        await createProduct(payload).unwrap();
        setMessage("পণ্য যোগ হয়েছে।");
        setPage(1);
      }
      resetForm();
    } catch (err) {
      setMessage(getApiErrorMessage(err, editingProductId ? "পণ্য আপডেট ব্যর্থ হয়েছে" : "পণ্য যোগ করা ব্যর্থ হয়েছে"));
    }
  }

  async function handleDelete(product: Product) {
    setMessage("");
    const confirmed = window.confirm(`${product.name} ডিলিট করবেন?`);
    if (!confirmed) return;

    try {
      await deleteProduct(product.id).unwrap();
      setMessage("পণ্য ডিলিট হয়েছে।");
      if (products.length === 1 && page > 1) {
        setPage((old) => old - 1);
      }
      if (editingProductId === product.id) {
        resetForm();
      }
    } catch (err) {
      setMessage(getApiErrorMessage(err, "পণ্য ডিলিট ব্যর্থ হয়েছে"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-gold-light">সুপার অ্যাডমিন</p>
          <h2 className="heading-gradient text-4xl font-black">পণ্য ম্যানেজমেন্ট</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-light">
            <Boxes size={17} />
            মোট {toBn(data?.total ?? 0)} পণ্য
          </div>
          <Button type="button" onClick={showForm ? resetForm : startCreate} className="shrink-0">
            {showForm ? <X size={17} /> : <Plus size={17} />}
            {showForm ? "ফর্ম বন্ধ করুন" : "নতুন পণ্য যোগ করুন"}
          </Button>
        </div>
      </div>

      {message ? <p className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p> : null}
      {error ? <p className="rounded-2xl border border-foreground/20 bg-foreground/5 px-4 py-3 text-sm text-foreground">{getApiErrorMessage(error, "পণ্য লোড ব্যর্থ হয়েছে")}</p> : null}

      {showForm ? (
        <Card className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold-light"><PackagePlus size={22} /></span>
            <div>
              <h3 className="text-2xl font-bold">{formMode === "edit" ? "পণ্য আপডেট করুন" : "নতুন পণ্য যোগ করুন"}</h3>
              <p className="text-sm text-muted">{formMode === "edit" ? "এই পরিবর্তন পাবলিক catalog-এ আপডেট হবে।" : "এই পণ্যটি পাবলিক catalog-এ দেখা যাবে।"}</p>
            </div>
          </div>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
              <div className="space-y-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-elevated">
                  {form.image ? (
                    <Image src={form.image} alt="Product preview" fill sizes="320px" className="object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center p-6 text-center text-muted">
                      <div>
                        <ImagePlus className="mx-auto text-gold-light" size={34} />
                        <p className="mt-3 text-sm font-semibold">ছবি আপলোড করুন</p>
                      </div>
                    </div>
                  )}
                </div>
                <label className="outline-gold inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition hover:bg-gold/10">
                  <ImagePlus size={16} />
                  {uploadingImage ? "আপলোড হচ্ছে..." : form.image ? "ছবি পরিবর্তন করুন" : "ছবি নির্বাচন করুন"}
                  <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
                {form.image ? (
                  <Button type="button" variant="ghost" className="w-full" onClick={() => updateField("image", "")}>
                    <X size={16} />
                    ছবি মুছুন
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="পণ্যের নাম" required />
                  <Input value={form.category} onChange={(e) => updateField("category", e.target.value)} placeholder="ক্যাটাগরি" required />
                  <Input value={form.sku} onChange={(e) => updateField("sku", e.target.value)} placeholder="SKU" required />
                  <Input value={form.id} onChange={(e) => updateField("id", e.target.value)} placeholder="পণ্য ID (optional)" disabled={formMode === "edit"} />
                  <Input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="অফার মূল্য" required />
                  <Input type="number" value={form.originalPrice} onChange={(e) => updateField("originalPrice", e.target.value)} placeholder="নিয়মিত মূল্য" required />
                  <Input type="number" value={form.commission} onChange={(e) => updateField("commission", e.target.value)} placeholder="কমিশন" />
                  <Input value={form.stock} onChange={(e) => updateField("stock", e.target.value)} placeholder="স্টক" />
                </div>
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
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={resetForm}>বাতিল</Button>
              <Button type="submit" disabled={saving || uploadingImage}>{formMode === "edit" ? "আপডেট করুন" : "পণ্য যোগ করুন"}</Button>
            </div>
          </form>
        </Card>
      ) : null}

      <Card className="p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="নাম, SKU বা ক্যাটাগরি" className="pl-10" />
          </div>
          <Input value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} placeholder="ক্যাটাগরি ফিল্টার" />
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {products.length ? products.map((product) => (
          <article key={product.id} className="nexa-card overflow-hidden bg-surface">
            <div className="relative aspect-[4/3] overflow-hidden bg-elevated">
              <Image src={product.image} alt={product.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
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
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Link href={`/products/${product.id}`} className="outline-gold inline-flex min-h-10 items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold transition hover:bg-gold/10">
                  <Eye size={15} />
                  দেখুন
                </Link>
                <Button type="button" variant="outline" className="min-h-10 px-3 py-2 text-xs" onClick={() => startEdit(product)}>
                  <Pencil size={15} />
                  এডিট
                </Button>
                <Button type="button" variant="danger" className="min-h-10 px-3 py-2 text-xs" disabled={deleting} onClick={() => handleDelete(product)}>
                  <Trash2 size={15} />
                  ডিলিট
                </Button>
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
  );
}
