"use client";

import { useState } from "react";
import { MessageCircle, Share2 } from "lucide-react";
import { Badge, Button, Card, CopyButton, Modal } from "@/components/ui";
import { products } from "@/lib/mock-data";
import { referralLink, taka } from "@/lib/utils";

export default function ProductsPage() {
  const [selected, setSelected] = useState<(typeof products)[number] | null>(null);
  const link = selected ? `${referralLink()}&product=${selected.id}` : "";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">পণ্য ক্যাটালগ</p>
        <h2 className="heading-gradient text-4xl font-black">পণ্য</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <div className="grid h-20 w-full place-items-center rounded-[18px] bg-gradient-to-br from-gold/15 to-purple-light/15 text-4xl text-gold-light">{product.icon}</div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <Badge tone="purple">{product.category}</Badge>
              <span className="font-bold text-gold-light">{taka(product.price)}</span>
            </div>
            <h3 className="mt-4 text-xl font-bold">{product.name}</h3>
            <p className="mt-2 flex-1 text-sm leading-7 text-muted">{product.description}</p>
            <Button className="mt-5 w-full" onClick={() => setSelected(product)}>রেফার করুন</Button>
          </Card>
        ))}
      </div>

      <Modal open={Boolean(selected)} title={selected?.name ?? "পণ্য"} onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-5">
            <div className="rounded-[18px] border border-white/7 bg-elevated p-4">
              <p className="text-sm text-muted">পূর্ণ বিবরণ</p>
              <p className="mt-2 leading-8">{selected.full}</p>
              <p className="mt-3 font-bold text-gold-light">{taka(selected.price)}</p>
            </div>
            <div>
              <p className="mb-2 text-sm text-muted">প্রোডাক্ট রেফারেল লিংক</p>
              <div className="break-all rounded-2xl border border-white/10 bg-elevated p-4 text-sm text-gold-light">{link}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <CopyButton value={link} label="লিংক কপি" />
              <Button variant="outline"><MessageCircle size={16} /> WhatsApp</Button>
              <Button variant="outline"><Share2 size={16} /> Facebook</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
