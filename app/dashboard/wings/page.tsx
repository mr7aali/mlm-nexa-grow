"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  LoaderCircle,
  MousePointerClick,
  Network,
  Search,
  UserCheck,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import { Badge, Card, Input, Select } from "@/components/ui";
import {
  useAssignWingPlacementMutation,
  useGetWingsQuery,
} from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import type { TreeNode, WingsResponse } from "@/lib/api-types";
import { initials, taka, toBn } from "@/lib/utils";

type TreeFilter = {
  level: string;
  activeOnly: boolean;
  query: string;
};

export default function WingsPage() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [level, setLevel] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [assigningMemberId, setAssigningMemberId] = useState("");
  const [placementMessage, setPlacementMessage] = useState("");
  const { data, isLoading } = useGetWingsQuery();
  const [assignWingPlacement] = useAssignWingPlacementMutation();
  const tree = data?.tree;
  const pendingPlacements = data?.pendingPlacements ?? [];
  const selectedMember = pendingPlacements.find(
    (member) => member.id === selectedMemberId,
  );
  const filter = useMemo(
    () => ({ level, activeOnly, query: query.trim() }),
    [activeOnly, level, query],
  );
  const filteredTree = useMemo(
    () => (tree ? filterTree(tree, filter) : null),
    [filter, tree],
  );
  const total = useMemo(() => (tree ? countNodes(tree) - 1 : 0), [tree]);
  const activeMembers = useMemo(
    () =>
      tree
        ? countMatchingNodes(tree.left, (node) => node.active) +
          countMatchingNodes(tree.right, (node) => node.active)
        : 0,
    [tree],
  );
  const inactiveMembers = Math.max(0, total - activeMembers);
  const hasFilter = level !== "all" || activeOnly || Boolean(query.trim());

  useEffect(() => {
    if (hasFilter) setCollapsed({});
  }, [hasFilter]);

  function toggleNode(id: string) {
    setCollapsed((current) => ({ ...current, [id]: !current[id] }));
  }

  function collapseAll() {
    if (!tree) return;
    setCollapsed(
      Object.fromEntries(
        collectParentIds(tree)
          .filter((id) => id !== "root")
          .map((id) => [id, true]),
      ),
    );
  }

  function selectMember(memberId: string) {
    setSelectedMemberId(memberId);
    setPlacementMessage("");
    setQuery("");
    setLevel("all");
    setActiveOnly(false);
    setCollapsed({});
    window.setTimeout(() => {
      document.getElementById("binary-placement-tree")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  async function placeMember(
    parentUserId: string,
    position: "Left" | "Right",
  ) {
    if (!selectedMember) return;

    setAssigningMemberId(selectedMember.id);
    setPlacementMessage("");
    try {
      const result = await assignWingPlacement({
        memberId: selectedMember.id,
        parentUserId,
        position,
      }).unwrap();
      setPlacementMessage(
        `${result.memberName} was placed in the selected ${position.toLowerCase()} slot.`,
      );
      setSelectedMemberId("");
    } catch (error) {
      setPlacementMessage(
        getApiErrorMessage(error, "The member could not be placed."),
      );
    } finally {
      setAssigningMemberId("");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-gold">রেফারেল নেটওয়ার্ক</p>
          <h2 className="mt-1 text-3xl font-black text-foreground md:text-4xl">
            মাই উইংস
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            আপনার অ্যাকাউন্ট থেকে শুরু করে সম্পূর্ণ ডাউনলাইন কাঠামো দেখুন।
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCollapsed({})}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-foreground transition hover:border-gold hover:text-gold"
          >
            <ChevronDown size={16} />
            সব খুলুন
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-foreground transition hover:border-gold hover:text-gold"
          >
            <ChevronRight size={16} />
            শাখা বন্ধ করুন
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryItem
          icon={Network}
          label="মোট নেটওয়ার্ক"
          value={data?.summary.totalNetwork ?? total}
        />
        <SummaryItem
          icon={Users}
          label="সরাসরি শাখা"
          value={(tree?.left ? 1 : 0) + (tree?.right ? 1 : 0)}
        />
        <SummaryItem
          icon={UserCheck}
          label="সক্রিয় সদস্য"
          value={activeMembers}
        />
        <SummaryItem
          icon={UserRound}
          label="নিষ্ক্রিয় সদস্য"
          value={inactiveMembers}
        />
        <SummaryItem
          icon={UserPlus}
          label="প্লেসমেন্ট অপেক্ষমাণ"
          value={pendingPlacements.length}
        />
      </section>

      <PendingPlacementQueue
        members={pendingPlacements}
        assigningMemberId={assigningMemberId}
        selectedMemberId={selectedMemberId}
        message={placementMessage}
        onSelect={selectMember}
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr_1.2fr]">
        <PairMetric
          label="আজকের লেফট ভলিউম"
          value={data?.dailyPairs.leftVolume ?? 0}
          icon={ChevronDown}
        />
        <PairMetric
          label="আজকের রাইট ভলিউম"
          value={data?.dailyPairs.rightVolume ?? 0}
          icon={ChevronDown}
        />
        <div className="border border-line bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">আজকের Pair Matching</p>
              <p className="mt-1 text-3xl font-black text-foreground">
                {toBn(data?.dailyPairs.pairCount ?? 0)}
                <span className="text-base font-semibold text-muted">
                  {" "}/ {toBn(data?.dailyPairs.pairLimit ?? 100)}
                </span>
              </p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gold/10 text-gold">
              <CircleDollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-gold transition-[width]"
              style={{
                width: `${Math.min(
                  100,
                  ((data?.dailyPairs.pairCount ?? 0) /
                    Math.max(1, data?.dailyPairs.pairLimit ?? 100)) *
                    100,
                )}%`,
              }}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock size={14} />
              প্রতিদিন রাত ১২টায় রিসেট ({data?.dailyPairs.resetsAtTimeZone ?? "Asia/Dhaka"})
            </span>
            <span className="font-semibold text-gold">
              {data?.dailyPairs.commissionPaid
                ? "কমিশন প্রদান হয়েছে"
                : (data?.dailyPairs.commissionAmount ?? 0) > 0
                  ? `কমিশন: ${taka(data?.dailyPairs.commissionAmount ?? 0)}`
                  : "কমিশন পরিমাণ কনফিগার করা হয়নি"}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-3 border-y border-line py-4 md:grid-cols-[minmax(240px,1fr)_180px_180px_auto]">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={16}
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            disabled={Boolean(selectedMember)}
            placeholder="সদস্যের নাম খুঁজুন"
            className="pl-10"
          />
        </div>
        <Select
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          disabled={Boolean(selectedMember)}
        >
          <option value="all">সব লেভেল</option>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <option key={item} value={item}>
              লেভেল {toBn(item)}
            </option>
          ))}
        </Select>
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-line bg-white px-4 text-sm font-medium text-muted">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(event) => setActiveOnly(event.target.checked)}
            disabled={Boolean(selectedMember)}
            className="h-4 w-4 accent-gold"
          />
          শুধু সক্রিয়
        </label>
        <div className="flex h-12 items-center rounded-2xl border border-gold/25 bg-gold/10 px-4 text-sm font-semibold text-gold">
          প্রদর্শিত: {toBn(filteredTree ? countNodes(filteredTree) - 1 : 0)}
        </div>
      </section>

      {isLoading ? (
        <TreeSkeleton />
      ) : filteredTree ? (
        <section
          id="binary-placement-tree"
          className="scroll-mt-5 overflow-hidden rounded-lg border border-line bg-white"
        >
          {selectedMember ? (
            <div className="flex flex-col justify-between gap-3 border-b border-gold/25 bg-gold/10 px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <MousePointerClick className="shrink-0 text-gold" size={20} />
                <div>
                  <p className="font-bold text-foreground">
                    {selectedMember.name} এর জন্য খালি স্লট নির্বাচন করুন
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    ট্রির যেকোনো সদস্যের নিচে খালি লেফট বা রাইট স্লটে ক্লিক করুন।
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMemberId("")}
                className="h-10 border border-line bg-white px-4 text-sm font-semibold text-muted transition hover:border-gold hover:text-gold"
              >
                নির্বাচন বাতিল
              </button>
            </div>
          ) : null}
          <div className="border-b border-line bg-elevated/60 px-5 py-3 text-xs font-medium text-muted">
            বাম বা ডানে স্ক্রল করে সম্পূর্ণ নেটওয়ার্ক দেখুন
          </div>
          <div className="scrollbar-soft overflow-x-auto px-5 py-8">
            <div className="network-tree mx-auto w-max min-w-full">
              <ul>
                <TreeBranch
                  node={filteredTree}
                  collapsed={collapsed}
                  toggle={toggleNode}
                  selectedMemberName={selectedMember?.name}
                  assigning={Boolean(assigningMemberId)}
                  onPlace={placeMember}
                />
              </ul>
            </div>
          </div>
        </section>
      ) : (
        <Card className="py-14 text-center">
          <Search className="mx-auto text-muted" size={28} />
          <h3 className="mt-4 font-bold">কোনো সদস্য পাওয়া যায়নি</h3>
          <p className="mt-2 text-sm text-muted">
            অন্য নাম বা লেভেল দিয়ে আবার চেষ্টা করুন।
          </p>
        </Card>
      )}
    </div>
  );
}

function PendingPlacementQueue({
  members,
  assigningMemberId,
  selectedMemberId,
  message,
  onSelect,
}: {
  members: NonNullable<WingsResponse["pendingPlacements"]>;
  assigningMemberId: string;
  selectedMemberId: string;
  message: string;
  onSelect: (memberId: string) => void;
}) {
  return (
    <section className="overflow-hidden border border-line bg-white">
      <div className="flex flex-col justify-between gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-gold" />
            <h3 className="text-lg font-bold text-foreground">
              নতুন সদস্য প্লেসমেন্ট
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted">
            সদস্য নির্বাচন করুন, তারপর ট্রির যেকোনো খালি লেফট বা রাইট স্লটে ক্লিক করুন।
          </p>
        </div>
        <Badge tone={members.length ? "gold" : "muted"}>
          {toBn(members.length)} জন অপেক্ষমাণ
        </Badge>
      </div>

      {message ? (
        <p className="border-b border-line bg-gold/10 px-5 py-3 text-sm font-medium text-gold">
          {message}
        </p>
      ) : null}

      {members.length ? (
        <div className="divide-y divide-line">
          {members.map((member) => {
            const assigning = assigningMemberId === member.id;
            const selected = selectedMemberId === member.id;
            return (
              <article
                key={member.id}
                className={`grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center ${
                  selected ? "bg-gold/5" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-elevated text-sm font-bold text-gold">
                    {initials(member.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate font-bold text-foreground">
                        {member.name}
                      </h4>
                      <Badge tone={member.active ? "green" : "muted"}>
                        {member.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {member.phone} · পেমেন্ট সদস্য · {formatJoined(member.joined)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={Boolean(assigningMemberId)}
                  onClick={() => onSelect(member.id)}
                  className={`inline-flex h-11 min-w-44 items-center justify-center gap-2 border px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    selected
                      ? "border-gold bg-gold text-white"
                      : "border-line bg-white text-foreground hover:border-gold hover:text-gold"
                  }`}
                >
                  {assigning ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : selected ? (
                    <Check size={16} />
                  ) : (
                    <MousePointerClick size={16} />
                  )}
                  {selected ? "নির্বাচিত সদস্য" : "স্লট নির্বাচন করুন"}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="px-5 py-8 text-center">
          <UserCheck className="mx-auto text-emerald-500" size={26} />
          <p className="mt-3 font-semibold text-foreground">
            কোনো সদস্য প্লেসমেন্টের অপেক্ষায় নেই
          </p>
          <p className="mt-1 text-sm text-muted">
            নতুন রেফারেল সফলভাবে পেমেন্ট করলে এখানে দেখা যাবে।
          </p>
        </div>
      )}
    </section>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Network;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-line bg-white px-4 py-5 sm:border-b-0 sm:border-l-4 sm:border-l-gold">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
        <Icon size={19} />
      </div>
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-1 text-2xl font-black text-foreground">{toBn(value)}</p>
      </div>
    </div>
  );
}

function PairMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Network;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between border border-line bg-white p-5">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-2 text-3xl font-black text-foreground">{toBn(value)}</p>
      </div>
      <div className="grid h-10 w-10 place-items-center rounded-full bg-elevated text-gold">
        <Icon size={19} />
      </div>
    </div>
  );
}

function TreeBranch({
  node,
  collapsed,
  toggle,
  selectedMemberName,
  assigning,
  onPlace,
}: {
  node: TreeNode;
  collapsed: Record<string, boolean>;
  toggle: (id: string) => void;
  selectedMemberName?: string;
  assigning: boolean;
  onPlace: (parentUserId: string, position: "Left" | "Right") => void;
}) {
  const hasChildren = Boolean(node.left || node.right);
  const isCollapsed = Boolean(collapsed[node.id]);

  return (
    <li>
      <MemberNode
        node={node}
        hasChildren={hasChildren}
        collapsed={isCollapsed}
        toggle={() => toggle(node.id)}
      />
      {!isCollapsed ? (
        <ul>
          <TreeSlot
            node={node.left}
            parentUserId={node.userId}
            position="Left"
            collapsed={collapsed}
            toggle={toggle}
            selectedMemberName={selectedMemberName}
            assigning={assigning}
            onPlace={onPlace}
          />
          <TreeSlot
            node={node.right}
            parentUserId={node.userId}
            position="Right"
            collapsed={collapsed}
            toggle={toggle}
            selectedMemberName={selectedMemberName}
            assigning={assigning}
            onPlace={onPlace}
          />
        </ul>
      ) : null}
    </li>
  );
}

function TreeSlot({
  node,
  parentUserId,
  position,
  collapsed,
  toggle,
  selectedMemberName,
  assigning,
  onPlace,
}: {
  node: TreeNode | null;
  parentUserId: string;
  position: "Left" | "Right";
  collapsed: Record<string, boolean>;
  toggle: (id: string) => void;
  selectedMemberName?: string;
  assigning: boolean;
  onPlace: (parentUserId: string, position: "Left" | "Right") => void;
}) {
  if (node) {
    return (
      <TreeBranch
        node={node}
        collapsed={collapsed}
        toggle={toggle}
        selectedMemberName={selectedMemberName}
        assigning={assigning}
        onPlace={onPlace}
      />
    );
  }

  return (
    <li className="network-tree-empty">
      <button
        type="button"
        disabled={!selectedMemberName || assigning}
        onClick={() => onPlace(parentUserId, position)}
        className={`mx-auto flex h-[148px] w-[210px] flex-col items-center justify-center gap-2 border border-dashed text-sm font-semibold transition ${
          selectedMemberName
            ? "border-gold bg-gold/5 text-gold hover:bg-gold hover:text-white"
            : "border-line bg-elevated/40 text-muted"
        } disabled:cursor-default`}
        title={
          selectedMemberName
            ? `${selectedMemberName} কে এই স্লটে রাখুন`
            : "প্রথমে অপেক্ষমাণ সদস্য নির্বাচন করুন"
        }
      >
        {assigning ? (
          <LoaderCircle size={20} className="animate-spin" />
        ) : (
          <UserPlus size={20} />
        )}
        <span>
          খালি {position === "Left" ? "লেফট" : "রাইট"} স্লট
        </span>
        <span className="text-xs font-normal">
          {selectedMemberName ? "এখানে প্লেস করুন" : "Available"}
        </span>
      </button>
    </li>
  );
}

function MemberNode({
  node,
  hasChildren,
  collapsed,
  toggle,
}: {
  node: TreeNode;
  hasChildren: boolean;
  collapsed: boolean;
  toggle: () => void;
}) {
  const isRoot = node.id === "root";

  return (
    <article
      className={`relative mx-auto w-[210px] border bg-white text-left shadow-sm ${
        isRoot
          ? "border-gold shadow-[0_10px_28px_rgba(232,82,10,0.14)]"
          : "border-line"
      }`}
    >
      <div className={`h-1 ${isRoot ? "bg-gold" : node.active ? "bg-emerald-500" : "bg-zinc-300"}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
              isRoot ? "bg-gold text-white" : "bg-elevated text-gold"
            }`}
          >
            {initials(node.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-foreground" title={node.name}>
              {node.name}
            </h3>
            <p className="mt-1 text-xs text-muted">
              {isRoot
                ? "রুট সদস্য"
                : `${node.position === "Left" ? "লেফট" : "রাইট"} · লেভেল ${toBn(node.level)}`}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <Badge tone={node.active ? "green" : "muted"}>
            {node.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
          </Badge>
          <span className="text-xs font-medium text-muted">
            {toBn(node.referrals)} রেফারেল
          </span>
        </div>
        <p className="mt-3 truncate text-xs text-muted" title={node.joined}>
          যোগদান: {formatJoined(node.joined)}
        </p>
      </div>

      {hasChildren ? (
        <button
          type="button"
          onClick={toggle}
          className="absolute -bottom-4 left-1/2 z-10 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border border-gold bg-white text-gold shadow-sm transition hover:bg-gold hover:text-white"
          aria-label={collapsed ? "শাখা খুলুন" : "শাখা বন্ধ করুন"}
          title={collapsed ? "শাখা খুলুন" : "শাখা বন্ধ করুন"}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
        </button>
      ) : null}
    </article>
  );
}

function TreeSkeleton() {
  return (
    <div className="rounded-lg border border-line bg-white px-5 py-10">
      <div className="mx-auto h-32 w-[210px] animate-pulse bg-elevated" />
      <div className="mx-auto h-10 w-px bg-line" />
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-12">
        <div className="h-32 animate-pulse bg-elevated" />
        <div className="h-32 animate-pulse bg-elevated" />
      </div>
    </div>
  );
}

function filterTree(
  node: TreeNode,
  filter: TreeFilter,
): TreeNode | null {
  const children =
    {
      left: node.left ? filterTree(node.left, filter) : null,
      right: node.right ? filterTree(node.right, filter) : null,
    };
  const matchesLevel = filter.level === "all" || String(node.level) === filter.level;
  const matchesStatus = !filter.activeOnly || node.active;
  const matchesQuery =
    !filter.query || node.name.toLowerCase().includes(filter.query.toLowerCase());
  const matchesSelf = matchesLevel && matchesStatus && matchesQuery;

  const hasMatchingDescendant = Boolean(children.left || children.right);
  if (!matchesSelf && !hasMatchingDescendant) return null;
  return { ...node, left: children.left, right: children.right };
}

function collectParentIds(node: TreeNode): string[] {
  return [
    ...(node.left || node.right ? [node.id] : []),
    ...(node.left ? collectParentIds(node.left) : []),
    ...(node.right ? collectParentIds(node.right) : []),
  ];
}

function countNodes(node: TreeNode): number {
  return (
    1 +
    (node.left ? countNodes(node.left) : 0) +
    (node.right ? countNodes(node.right) : 0)
  );
}

function countMatchingNodes(
  node: TreeNode | null,
  matches: (node: TreeNode) => boolean,
): number {
  if (!node) return 0;
  return (
    (matches(node) ? 1 : 0) +
    countMatchingNodes(node.left, matches) +
    countMatchingNodes(node.right, matches)
  );
}

function formatJoined(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("bn-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
}
