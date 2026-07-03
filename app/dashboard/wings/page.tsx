"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  SlidersHorizontal,
  UserCheck,
  UserPlus,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Badge, Card, Input, Select } from "@/components/ui";
import {
  useAssignWingPlacementMutation,
  useGetWingMemberDetailsQuery,
  useGetWingsQuery,
} from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  TreeNode,
  WingMemberDetailsResponse,
  WingsResponse,
} from "@/lib/api-types";
import { useI18n } from "@/lib/i18n";
import { initials, taka, toBn } from "@/lib/utils";

type TreeFilter = {
  level: string;
  activeOnly: boolean;
  query: string;
};

export default function WingsPage() {
  const { language } = useI18n();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [level, setLevel] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedNodeUserId, setSelectedNodeUserId] = useState("");
  const [assigningMemberId, setAssigningMemberId] = useState("");
  const [placementMessage, setPlacementMessage] = useState("");
  const treeViewportRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useGetWingsQuery();
  const {
    data: selectedNodeDetails,
    isFetching: nodeDetailsLoading,
    error: nodeDetailsError,
  } = useGetWingMemberDetailsQuery(selectedNodeUserId, {
    skip: !selectedNodeUserId,
  });
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

  useEffect(() => {
    if (!filteredTree || window.innerWidth >= 768) return;

    const frame = window.requestAnimationFrame(() => {
      const viewport = treeViewportRef.current;
      if (!viewport) return;
      viewport.scrollLeft = Math.max(
        0,
        (viewport.scrollWidth - viewport.clientWidth) / 2,
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, [filteredTree, selectedMemberId]);

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

  async function placeMember(parentUserId: string, position: "Left" | "Right") {
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
    <div className="space-y-4 md:space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-gold">রেফারেল নেটওয়ার্ক</p>
          <h2 className="mt-1 text-2xl font-black text-foreground sm:text-3xl md:text-4xl">
            মাই উইংস
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted md:mt-2">
            আপনার অ্যাকাউন্ট থেকে শুরু করে সম্পূর্ণ ডাউনলাইন কাঠামো দেখুন।
          </p>
        </div>
        <div className="hidden items-center gap-2 md:flex">
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

      <section className="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-5">
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
        <div className="col-span-2 xl:col-span-1">
          <SummaryItem
            icon={UserPlus}
            label="প্লেসমেন্ট অপেক্ষমাণ"
            value={pendingPlacements.length}
          />
        </div>
      </section>

      <PendingPlacementQueue
        members={pendingPlacements}
        assigningMemberId={assigningMemberId}
        selectedMemberId={selectedMemberId}
        message={placementMessage}
        onSelect={selectMember}
      />

      <section className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-[1fr_1fr_1.2fr]">
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
        <div className="col-span-2 border border-line bg-white p-4 sm:p-5 lg:col-span-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">আজকের Pair Matching</p>
              <p className="mt-1 text-3xl font-black text-foreground">
                {toBn(data?.dailyPairs.pairCount ?? 0)}
                <span className="text-base font-semibold text-muted">
                  {" "}
                  / {toBn(data?.dailyPairs.pairLimit ?? 100)}
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
              প্রতিদিন রাত ১২টায় রিসেট (
              {data?.dailyPairs.resetsAtTimeZone ?? "Asia/Dhaka"})
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

      <MobileFilters
        query={query}
        level={level}
        activeOnly={activeOnly}
        disabled={Boolean(selectedMember)}
        shownCount={filteredTree ? countNodes(filteredTree) - 1 : 0}
        setQuery={setQuery}
        setLevel={setLevel}
        setActiveOnly={setActiveOnly}
      />

      <section className="hidden gap-3 border-y border-line py-4 md:grid md:grid-cols-[minmax(240px,1fr)_180px_180px_auto]">
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
          className="scroll-mt-20 overflow-hidden border border-line bg-white md:scroll-mt-5 md:rounded-lg"
        >
          {selectedMember ? (
            <PlacementBanner
              memberName={selectedMember.name}
              onCancel={() => setSelectedMemberId("")}
            />
          ) : null}
          <div className="flex items-center justify-between gap-3 border-b border-line bg-elevated/60 px-4 py-3 text-xs font-medium text-muted sm:px-5">
            <span className="md:hidden">
              সম্পূর্ণ ট্রি দেখতে বাম-ডানে সোয়াইপ করুন
            </span>
            <span className="hidden md:inline">
              বাম বা ডানে স্ক্রল করে সম্পূর্ণ নেটওয়ার্ক দেখুন
            </span>
            <span className="shrink-0 font-semibold text-gold">
              {toBn(Math.max(0, countNodes(filteredTree) - 1))} সদস্য
            </span>
          </div>
          <div
            ref={treeViewportRef}
            className="scrollbar-soft overflow-x-auto overscroll-x-contain px-2 py-6 touch-pan-x sm:px-4 md:px-5 md:py-8"
          >
            <div className="network-tree mx-auto w-max min-w-full">
              <ul>
                <TreeBranch
                  node={filteredTree}
                  collapsed={collapsed}
                  toggle={toggleNode}
                  selectedMemberName={selectedMember?.name}
                  assigning={Boolean(assigningMemberId)}
                  onPlace={placeMember}
                  onSelectNode={setSelectedNodeUserId}
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

      <MemberDetailsDrawer
        open={Boolean(selectedNodeUserId)}
        details={selectedNodeDetails}
        loading={nodeDetailsLoading}
        error={
          nodeDetailsError
            ? getApiErrorMessage(
                nodeDetailsError,
                language === "bn"
                  ? "সদস্যের তথ্য লোড করা যায়নি"
                  : "Member details could not be loaded",
              )
            : ""
        }
        onClose={() => setSelectedNodeUserId("")}
      />
    </div>
  );
}

function MobileFilters({
  query,
  level,
  activeOnly,
  disabled,
  shownCount,
  setQuery,
  setLevel,
  setActiveOnly,
}: {
  query: string;
  level: string;
  activeOnly: boolean;
  disabled: boolean;
  shownCount: number;
  setQuery: (value: string) => void;
  setLevel: (value: string) => void;
  setActiveOnly: (value: boolean) => void;
}) {
  return (
    <details className="group border border-line bg-white md:hidden">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
          <SlidersHorizontal size={17} className="text-gold" />
          নেটওয়ার্ক ফিল্টার
        </span>
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted">
          {toBn(shownCount)} জন
          <ChevronDown size={16} className="transition group-open:rotate-180" />
        </span>
      </summary>
      <div className="grid gap-3 border-t border-line p-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={16}
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            disabled={disabled}
            placeholder="সদস্যের নাম খুঁজুন"
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <Select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            disabled={disabled}
          >
            <option value="all">সব লেভেল</option>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <option key={item} value={item}>
                লেভেল {toBn(item)}
              </option>
            ))}
          </Select>
          <label className="flex h-12 items-center gap-2 border border-line bg-white px-3 text-sm font-medium text-muted">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(event) => setActiveOnly(event.target.checked)}
              disabled={disabled}
              className="h-4 w-4 accent-gold"
            />
            সক্রিয়
          </label>
        </div>
      </div>
    </details>
  );
}

function PlacementBanner({
  memberName,
  onCancel,
}: {
  memberName: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 border-b border-gold/25 bg-gold/10 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
      <div className="flex min-w-0 items-start gap-3">
        <MousePointerClick className="mt-0.5 shrink-0 text-gold" size={20} />
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">{memberName}</p>
          <p className="mt-1 text-xs leading-5 text-muted sm:text-sm">
            যেকোনো সদস্যের খালি লেফট বা রাইট স্লট বেছে নিন।
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="h-10 shrink-0 border border-line bg-white px-4 text-sm font-semibold text-muted transition hover:border-gold hover:text-gold"
      >
        নির্বাচন বাতিল
      </button>
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
      <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-4 sm:items-center sm:px-5">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-gold" />
            <h3 className="text-base font-bold text-foreground sm:text-lg">
              নতুন সদস্য প্লেসমেন্ট
            </h3>
          </div>
          <p className="mt-1 hidden text-sm text-muted sm:block">
            সদস্য নির্বাচন করুন, তারপর ট্রির যেকোনো খালি লেফট বা রাইট স্লটে
            ক্লিক করুন।
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
                className={`grid gap-3 px-4 py-4 sm:px-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center ${
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
                    <p className="mt-1 truncate text-xs text-muted sm:text-sm">
                      {member.phone} · {formatJoined(member.joined)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={Boolean(assigningMemberId)}
                  onClick={() => onSelect(member.id)}
                  className={`inline-flex h-11 w-full items-center justify-center gap-2 border px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:min-w-44 ${
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
    <div className="flex min-h-24 items-center gap-3 border border-line bg-white px-3 py-4 sm:min-h-0 sm:gap-4 sm:border-b-0 sm:border-l-4 sm:border-l-gold sm:px-4 sm:py-5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/10 text-gold sm:h-10 sm:w-10">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs leading-5 text-muted sm:text-sm">{label}</p>
        <p className="mt-0.5 text-xl font-black text-foreground sm:mt-1 sm:text-2xl">
          {toBn(value)}
        </p>
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
    <div className="flex min-h-28 items-center justify-between border border-line bg-white p-4 sm:p-5">
      <div>
        <p className="text-xs leading-5 text-muted sm:text-sm">{label}</p>
        <p className="mt-1 text-2xl font-black text-foreground sm:mt-2 sm:text-3xl">
          {toBn(value)}
        </p>
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
  onSelectNode,
}: {
  node: TreeNode;
  collapsed: Record<string, boolean>;
  toggle: (id: string) => void;
  selectedMemberName?: string;
  assigning: boolean;
  onPlace: (parentUserId: string, position: "Left" | "Right") => void;
  onSelectNode: (userId: string) => void;
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
        onSelect={() => onSelectNode(node.userId)}
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
            onSelectNode={onSelectNode}
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
            onSelectNode={onSelectNode}
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
  onSelectNode,
}: {
  node: TreeNode | null;
  parentUserId: string;
  position: "Left" | "Right";
  collapsed: Record<string, boolean>;
  toggle: (id: string) => void;
  selectedMemberName?: string;
  assigning: boolean;
  onPlace: (parentUserId: string, position: "Left" | "Right") => void;
  onSelectNode: (userId: string) => void;
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
        onSelectNode={onSelectNode}
      />
    );
  }

  return (
    <li className="network-tree-empty">
      <button
        type="button"
        disabled={!selectedMemberName || assigning}
        onClick={() => onPlace(parentUserId, position)}
        className={`mx-auto flex h-[118px] w-[158px] flex-col items-center justify-center gap-1.5 border border-dashed px-2 text-xs font-semibold transition sm:h-[132px] sm:w-[184px] md:h-[148px] md:w-[210px] md:gap-2 md:text-sm ${
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
        <span>খালি {position === "Left" ? "লেফট" : "রাইট"} স্লট</span>
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
  onSelect,
}: {
  node: TreeNode;
  hasChildren: boolean;
  collapsed: boolean;
  toggle: () => void;
  onSelect: () => void;
}) {
  const isRoot = node.id === "root";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={`relative mx-auto w-[158px] border bg-white text-left shadow-sm sm:w-[184px] md:w-[210px] ${
        isRoot
          ? "border-gold shadow-[0_10px_28px_rgba(232,82,10,0.14)]"
          : "border-line"
      } cursor-pointer outline-none transition hover:-translate-y-0.5 hover:border-gold hover:shadow-md focus-visible:ring-2 focus-visible:ring-gold/40`}
    >
      <div
        className={`h-1 ${isRoot ? "bg-gold" : node.active ? "bg-emerald-500" : "bg-zinc-300"}`}
      />
      <div className="p-3 md:p-4">
        <div className="flex items-start gap-2 md:gap-3">
          {node.profilePicture ? (
            <Image
              src={node.profilePicture}
              alt={node.name}
              width={40}
              height={40}
              unoptimized
              className={`h-8 w-8 shrink-0 rounded-full border object-cover md:h-10 md:w-10 ${
                isRoot ? "border-gold" : "border-line"
              }`}
            />
          ) : (
            <div
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold md:h-10 md:w-10 md:text-sm ${
                isRoot ? "bg-gold text-white" : "bg-elevated text-gold"
              }`}
            >
              {initials(node.name)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3
              className="truncate text-xs font-bold text-foreground md:text-sm"
              title={node.name}
            >
              {node.name}
            </h3>
            <p className="mt-1 truncate text-[10px] text-muted md:text-xs">
              {isRoot
                ? "রুট সদস্য"
                : `${node.position === "Left" ? "লেফট" : "রাইট"} · ${toBn(node.referrals)} রেফারেল`}{" "}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-1 border-t border-line pt-2 md:mt-4 md:pt-3">
          {/* <span
            className={`rounded-full border px-2 py-1 text-[9px] font-semibold md:text-xs ${
              node.active
                ? "border-gold bg-gold/10 text-gold"
                : "border-line bg-elevated text-muted"
            }`}
          >
            {node.active ? "সক্রিয়" : "নিষ্ক্রিয়"}
        
          </span>
          <span className="text-[9px] font-medium text-muted md:text-xs">
            {toBn(node.referrals)} রেফারেল
          </span> */}
        </div>
        <p
          className="mt-2 truncate text-[9px] text-muted md:mt-3 md:text-xs"
          title={node.joined}
        >
          যোগদান: {formatJoined(node.joined)}
        </p>
      </div>

      {hasChildren ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggle();
          }}
          onKeyDown={(event) => event.stopPropagation()}
          className="absolute -bottom-3 left-1/2 z-10 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full border border-gold bg-white text-gold shadow-sm transition hover:bg-gold hover:text-white md:-bottom-4 md:h-8 md:w-8"
          aria-label={collapsed ? "শাখা খুলুন" : "শাখা বন্ধ করুন"}
          title={collapsed ? "শাখা খুলুন" : "শাখা বন্ধ করুন"}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
        </button>
      ) : null}
    </article>
  );
}

function MemberDetailsDrawer({
  open,
  details,
  loading,
  error,
  onClose,
}: {
  open: boolean;
  details?: WingMemberDetailsResponse;
  loading: boolean;
  error: string;
  onClose: () => void;
}) {
  const { language } = useI18n();
  const text = {
    eyebrow: language === "bn" ? "উইং সদস্য" : "Wing member",
    title: language === "bn" ? "সদস্যের বিস্তারিত" : "Member details",
    closeDetails:
      language === "bn" ? "বিস্তারিত বন্ধ করুন" : "Close member details",
    close: language === "bn" ? "বন্ধ করুন" : "Close",
    empty: language === "bn" ? "তথ্য নেই" : "No information",
    loading:
      language === "bn"
        ? "সদস্যের তথ্য লোড হচ্ছে..."
        : "Loading member details...",
    active: language === "bn" ? "সক্রিয়" : "Active",
    level: language === "bn" ? "লেভেল" : "Level",
    root: language === "bn" ? "রুট" : "Root",
    available: language === "bn" ? "খালি আছে" : "Available",
    account: language === "bn" ? "অ্যাকাউন্ট" : "Account",
    binaryPlacement:
      language === "bn" ? "বাইনারি প্লেসমেন্ট" : "Binary Placement",
    childSlots: language === "bn" ? "চাইল্ড স্লট" : "Child Slots",
    commission: language === "bn" ? "কমিশন" : "Commission",
    contactProfile:
      language === "bn" ? "যোগাযোগ ও প্রোফাইল" : "Contact & Profile",
    nominee: language === "bn" ? "নমিনি" : "Nominee",
    userId: language === "bn" ? "ইউজার আইডি" : "User ID",
    referralCode: language === "bn" ? "রেফার কোড" : "Referral Code",
    joined: language === "bn" ? "যোগদান" : "Joined",
    referredBy: language === "bn" ? "রেফার করেছে" : "Referred by",
    position: language === "bn" ? "পজিশন" : "Position",
    parent: language === "bn" ? "প্যারেন্ট" : "Parent",
    sponsor: language === "bn" ? "স্পন্সর" : "Sponsor",
    sponsorWing: language === "bn" ? "স্পন্সর উইং" : "Sponsor wing",
    placedAt: language === "bn" ? "প্লেসড তারিখ" : "Placed at",
    directReferrals: language === "bn" ? "সরাসরি রেফারেল" : "Direct referrals",
    totalTeamMembers:
      language === "bn" ? "মোট টিম সদস্য" : "Total team members",
    leftWingNodes: language === "bn" ? "লেফট উইং নোড" : "Left wing nodes",
    rightWingNodes: language === "bn" ? "রাইট উইং নোড" : "Right wing nodes",
    paidOrders: language === "bn" ? "পেইড অর্ডার" : "Paid orders",
    totalPaid: language === "bn" ? "মোট পেমেন্ট" : "Total paid",
    left: language === "bn" ? "লেফট" : "Left",
    right: language === "bn" ? "রাইট" : "Right",
    totalEarned: language === "bn" ? "মোট আয়" : "Total earned",
    paid: language === "bn" ? "পেইড" : "Paid",
    phone: language === "bn" ? "মোবাইল" : "Phone",
    email: language === "bn" ? "ই-মেইল" : "Email",
    address: language === "bn" ? "ঠিকানা" : "Address",
    father: language === "bn" ? "পিতা" : "Father",
    mother: language === "bn" ? "মাতা" : "Mother",
    dateOfBirth: language === "bn" ? "জন্ম তারিখ" : "Date of birth",
    religion: language === "bn" ? "ধর্ম" : "Religion",
    gender: language === "bn" ? "লিঙ্গ" : "Gender",
    bloodGroup: language === "bn" ? "রক্তের গ্রুপ" : "Blood group",
    nidBc: language === "bn" ? "এনআইডি/জন্ম সনদ" : "NID/BC",
    mission: language === "bn" ? "মিশন" : "Mission",
    name: language === "bn" ? "নাম" : "Name",
    relation: language === "bn" ? "সম্পর্ক" : "Relation",
    village: language === "bn" ? "গ্রাম" : "Village",
    postOffice: language === "bn" ? "পোস্ট অফিস" : "Post office",
    district: language === "bn" ? "জেলা" : "District",
  };
  const user = details?.user;
  const empty = text.empty;
  const positionLabel = (value?: string | null) =>
    value === "Left"
      ? text.left
      : value === "Right"
        ? text.right
        : value === "Root"
          ? text.root
          : value || "";
  const statusLabel = (value?: string | null) =>
    value === "Active"
      ? text.active
      : value === "Paid"
        ? text.paid
        : value || "";

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
      data-no-translate
    >
      <button
        type="button"
        aria-label={text.closeDetails}
        onClick={onClose}
        className={`absolute inset-0 bg-foreground/45 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col overflow-hidden border-l border-line bg-white shadow-2xl transition-transform duration-300 sm:max-w-[480px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={text.title}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">
              {text.eyebrow}
            </p>
            <h3 className="text-xl font-black text-foreground">{text.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition hover:border-gold hover:text-gold"
            aria-label={text.close}
          >
            <X size={18} />
          </button>
        </div>

        <div className="scrollbar-soft flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="grid min-h-80 place-items-center text-center">
              <div>
                <LoaderCircle
                  className="mx-auto animate-spin text-gold"
                  size={30}
                />
                <p className="mt-3 text-sm font-semibold text-muted">
                  {text.loading}
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-line bg-elevated p-5 text-center">
              <p className="font-semibold text-foreground">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 h-10 rounded-full border border-line px-5 text-sm font-bold text-muted transition hover:border-gold hover:text-gold"
              >
                {text.close}
              </button>
            </div>
          ) : user ? (
            <div className="space-y-5">
              <section className="rounded-lg border border-line bg-elevated p-4">
                <div className="flex items-center gap-3">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt={user.name}
                      width={64}
                      height={64}
                      unoptimized
                      className="h-16 w-16 rounded-full border border-gold/30 object-cover"
                    />
                  ) : (
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-gold text-xl font-black text-white">
                      {initials(user.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="truncate text-xl font-black text-foreground">
                      {user.name}
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge
                        tone={user.status === "Active" ? "green" : "muted"}
                      >
                        {statusLabel(user.status)}
                      </Badge>
                      <Badge tone="muted">
                        {text.level}{" "}
                        {language === "bn" ? toBn(user.level) : user.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              </section>

              <DrawerSection title={text.account}>
                <InfoRow label={text.userId} value={user.id} empty={empty} />
                <InfoRow
                  label={text.referralCode}
                  value={user.referralCode}
                  empty={empty}
                />
                <InfoRow
                  label={text.joined}
                  value={formatJoined(user.joined, language)}
                  empty={empty}
                />
                <InfoRow
                  label={text.referredBy}
                  value={user.referredByCode}
                  empty={empty}
                />
              </DrawerSection>

              <DrawerSection title={text.binaryPlacement}>
                <InfoRow
                  label={text.position}
                  value={positionLabel(details.placement?.position ?? "Root")}
                  empty={empty}
                />
                <InfoRow
                  label={text.parent}
                  value={details.placement?.parentName}
                  empty={empty}
                />
                <InfoRow
                  label={text.sponsor}
                  value={details.placement?.sponsorName}
                  empty={empty}
                />
                <InfoRow
                  label={text.sponsorWing}
                  value={positionLabel(details.placement?.sponsorWing)}
                  empty={empty}
                />
                <InfoRow
                  label={text.placedAt}
                  value={
                    details.placement?.placedAt
                      ? formatJoined(details.placement.placedAt, language)
                      : ""
                  }
                  empty={empty}
                />
              </DrawerSection>

              <section className="grid grid-cols-2 gap-3">
                <MiniStat
                  label={text.directReferrals}
                  value={
                    language === "bn"
                      ? toBn(details.network.directReferrals)
                      : String(details.network.directReferrals)
                  }
                />
                <MiniStat
                  label={text.totalTeamMembers}
                  value={
                    language === "bn"
                      ? toBn(details.network.binaryDownline)
                      : String(details.network.binaryDownline)
                  }
                />
                <MiniStat
                  label={text.leftWingNodes}
                  value={
                    language === "bn"
                      ? toBn(details.network.leftNodeCount)
                      : String(details.network.leftNodeCount)
                  }
                />
                <MiniStat
                  label={text.rightWingNodes}
                  value={
                    language === "bn"
                      ? toBn(details.network.rightNodeCount)
                      : String(details.network.rightNodeCount)
                  }
                />
                <MiniStat
                  label={text.paidOrders}
                  value={
                    language === "bn"
                      ? toBn(details.purchases.confirmedOrders)
                      : String(details.purchases.confirmedOrders)
                  }
                />
                <MiniStat
                  label={text.totalPaid}
                  value={taka(details.purchases.totalPaid)}
                />
              </section>

              <DrawerSection title={text.childSlots}>
                <InfoRow
                  label={text.left}
                  value={details.network.left?.name ?? text.available}
                  empty={empty}
                />
                <InfoRow
                  label={text.right}
                  value={details.network.right?.name ?? text.available}
                  empty={empty}
                />
              </DrawerSection>

              <DrawerSection title={text.commission}>
                <InfoRow
                  label={text.totalEarned}
                  value={taka(details.commissions.totalEarned)}
                  empty={empty}
                />
                <InfoRow
                  label={text.paid}
                  value={taka(details.commissions.paid)}
                  empty={empty}
                />
                {details.commissions.latest.length ? (
                  <div className="mt-3 space-y-2">
                    {details.commissions.latest.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-md border border-line bg-white px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-bold text-foreground">
                            {item.level}
                          </p>
                          <p className="text-xs font-black text-gold">
                            {taka(item.amount)}
                          </p>
                        </div>
                        <p className="mt-1 text-[11px] text-muted">
                          {formatJoined(item.date, language)} ·{" "}
                          {statusLabel(item.status)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </DrawerSection>

              <DrawerSection title={text.contactProfile}>
                <InfoRow label={text.phone} value={user.phone} empty={empty} />
                <InfoRow label={text.email} value={user.email} empty={empty} />
                <InfoRow
                  label={text.address}
                  value={user.address}
                  empty={empty}
                />
                <InfoRow
                  label={text.father}
                  value={user.fatherName}
                  empty={empty}
                />
                <InfoRow
                  label={text.mother}
                  value={user.motherName}
                  empty={empty}
                />
                <InfoRow
                  label={text.dateOfBirth}
                  value={user.dateOfBirth}
                  empty={empty}
                />
                <InfoRow
                  label={text.religion}
                  value={user.religion}
                  empty={empty}
                />
                <InfoRow
                  label={text.gender}
                  value={user.gender}
                  empty={empty}
                />
                <InfoRow
                  label={text.bloodGroup}
                  value={user.bloodGroup}
                  empty={empty}
                />
                <InfoRow
                  label={text.nidBc}
                  value={user.nidOrBirthCertificate}
                  empty={empty}
                />
                <InfoRow
                  label={text.mission}
                  value={user.mission}
                  empty={empty}
                />
              </DrawerSection>

              <DrawerSection title={text.nominee}>
                <InfoRow
                  label={text.name}
                  value={user.nomineeName}
                  empty={empty}
                />
                <InfoRow
                  label={text.relation}
                  value={user.nomineeRelation}
                  empty={empty}
                />
                <InfoRow
                  label={text.address}
                  value={user.nomineeAddress}
                  empty={empty}
                />
                <InfoRow
                  label={text.village}
                  value={user.nomineeVillage}
                  empty={empty}
                />
                <InfoRow
                  label={text.postOffice}
                  value={user.nomineePostOffice}
                  empty={empty}
                />
                <InfoRow
                  label={text.district}
                  value={user.nomineeDistrict}
                  empty={empty}
                />
              </DrawerSection>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function DrawerSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-elevated p-4">
      <h4 className="mb-3 text-sm font-black uppercase tracking-wide text-foreground">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function InfoRow({
  label,
  value,
  empty,
}: {
  label: string;
  value?: string | number | null;
  empty: string;
}) {
  return (
    <div className="grid gap-1 rounded-md border border-line bg-white px-3 py-2 sm:grid-cols-[120px_1fr]">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="break-words text-sm font-bold text-foreground">
        {value || <span className="text-muted">{empty}</span>}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-black text-gold">{value}</p>
    </div>
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

function filterTree(node: TreeNode, filter: TreeFilter): TreeNode | null {
  const children = {
    left: node.left ? filterTree(node.left, filter) : null,
    right: node.right ? filterTree(node.right, filter) : null,
  };
  const matchesLevel =
    filter.level === "all" || String(node.level) === filter.level;
  const matchesStatus = !filter.activeOnly || node.active;
  const matchesQuery =
    !filter.query ||
    node.name.toLowerCase().includes(filter.query.toLowerCase());
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

function formatJoined(value: string, language: "bn" | "en" = "bn") {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
}
