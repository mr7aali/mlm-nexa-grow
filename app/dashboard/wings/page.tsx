"use client";

import { useMemo, useState } from "react";
import { Download, Minus, Plus, Search } from "lucide-react";
import { Badge, Button, Card, Input, Select } from "@/components/ui";
import { referralTree, type TreeNode } from "@/lib/mock-data";
import { initials, toBn } from "@/lib/utils";

const depthClass: Record<number, string> = {
  0: "border-gold/50 bg-gold/10",
  1: "border-emerald-400/40 bg-emerald-400/10",
  2: "border-sky-400/40 bg-sky-400/10",
  3: "border-amber-400/40 bg-amber-400/10",
  4: "border-red-400/40 bg-red-400/10",
  5: "border-purple-light/40 bg-purple-light/10",
  6: "border-gold/50 bg-gold/10",
};

export default function WingsPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ root: true, "l1-a": true, "l1-b": true, "l2-d": true });
  const [level, setLevel] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const [query, setQuery] = useState("");

  const total = useMemo(() => countNodes(referralTree) - 1, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-gold-light">রেফারেল নেটওয়ার্ক</p>
          <h2 className="heading-gradient text-4xl font-black">মাই উইংস</h2>
        </div>
        <Button variant="outline"><Download size={16} /> ইমেজ এক্সপোর্ট</Button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        {[
          ["লেফট উইং", "১২"],
          ["রাইট উইং", "১৮"],
          ["সক্রিয় সদস্য", "২৬"],
          ["নিষ্ক্রিয় সদস্য", "৪"],
        ].map(([label, value]) => (
          <Card key={label} className="p-5">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 text-3xl font-black text-gold-light">{value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="নাম দিয়ে খুঁজুন" className="pl-10" />
          </div>
          <Select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="all">সব লেভেল</option>
            {[1, 2, 3, 4, 5, 6].map((item) => <option key={item} value={item}>লেভেল {toBn(item)}</option>)}
          </Select>
          <label className="flex h-12 items-center gap-2 rounded-2xl border border-white/10 bg-elevated/70 px-4 text-sm text-muted">
            <input type="checkbox" checked={activeOnly} onChange={(event) => setActiveOnly(event.target.checked)} className="accent-gold" />
            শুধু সক্রিয়
          </label>
          <div className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold-light">মোট নেটওয়ার্ক: {toBn(total)}</div>
        </div>
      </Card>

      <Card className="overflow-x-auto p-5 scrollbar-soft">
        <div className="min-w-[760px]">
          <TreeView
            node={referralTree}
            expanded={expanded}
            toggle={(id) => setExpanded((old) => ({ ...old, [id]: !old[id] }))}
            filter={{ level, activeOnly, query }}
          />
        </div>
      </Card>
    </div>
  );
}

function TreeView({
  node,
  expanded,
  toggle,
  filter,
}: {
  node: TreeNode;
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  filter: { level: string; activeOnly: boolean; query: string };
}) {
  const visible = matches(node, filter);
  const hasChildren = Boolean(node.children?.length);
  const childrenVisible = expanded[node.id] && hasChildren;

  if (!visible && node.id !== "root" && !node.children?.some((child) => matchesDeep(child, filter))) return null;

  return (
    <div className="pl-4">
      <div className="flex items-center gap-3 py-3">
        <button onClick={() => hasChildren && toggle(node.id)} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-muted">
          {hasChildren ? expanded[node.id] ? <Minus size={15} /> : <Plus size={15} /> : null}
        </button>
        <div className={`flex min-w-[360px] items-center gap-3 rounded-[18px] border p-4 ${depthClass[node.level] ?? depthClass[6]}`}>
          <div className="grid h-11 w-11 place-items-center rounded-full bg-background text-sm font-bold text-gold-light">{initials(node.name)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold">{node.name}</h3>
              <Badge tone={node.active ? "green" : "muted"}>{node.active ? "সক্রিয়" : "নিষ্ক্রিয়"}</Badge>
            </div>
            <p className="text-sm text-muted">যোগদান: {node.joined} · নিজস্ব রেফারেল: {toBn(node.referrals)}</p>
          </div>
          <Badge tone={node.level === 0 ? "gold" : "purple"}>{node.level === 0 ? "মূল" : `লেভেল ${toBn(node.level)}`}</Badge>
        </div>
      </div>
      {childrenVisible ? (
        <div className="ml-4 border-l border-white/10">
          {node.children?.map((child) => (
            <TreeView key={child.id} node={child} expanded={expanded} toggle={toggle} filter={filter} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function matches(node: TreeNode, filter: { level: string; activeOnly: boolean; query: string }) {
  const byLevel = filter.level === "all" || String(node.level) === filter.level || node.id === "root";
  const byActive = !filter.activeOnly || node.active;
  const byQuery = !filter.query || node.name.toLowerCase().includes(filter.query.toLowerCase());
  return byLevel && byActive && byQuery;
}

function matchesDeep(node: TreeNode, filter: { level: string; activeOnly: boolean; query: string }): boolean {
  return matches(node, filter) || Boolean(node.children?.some((child) => matchesDeep(child, filter)));
}

function countNodes(node: TreeNode): number {
  return 1 + (node.children?.reduce((sum, child) => sum + countNodes(child), 0) ?? 0);
}
