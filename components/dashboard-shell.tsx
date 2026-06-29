"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  Boxes,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Coins,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  PackagePlus,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import { useGetMeQuery, useLogoutMutation } from "@/lib/api";
import { clearCredentials } from "@/lib/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn, initials } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/dashboard/wings", label: "মাই উইংস", icon: Network },
  { href: "/dashboard/referrals", label: "রেফারেল", icon: Users },
  {
    href: "/dashboard/commissions",
    label: "কমিশন",
    icon: ChartNoAxesCombined,
  },
  {
    href: "/dashboard/generation-income",
    label: "Team info",
    icon: Trophy,
  },
  { href: "/dashboard/products", label: "পণ্য", icon: Boxes },
  { href: "/dashboard/payments", label: "পেমেন্ট", icon: CreditCard },
  { href: "/dashboard/earnings", label: "আয়", icon: Coins },
  { href: "/dashboard/profile", label: "প্রোফাইল", icon: User },
];

const adminNavItems = [
  {
    href: "/dashboard/super-admin/users",
    label: "ইউজার ম্যানেজ",
    icon: ShieldCheck,
  },
  {
    href: "/dashboard/super-admin/products",
    label: "পণ্য যোগ",
    icon: PackagePlus,
  },
  {
    href: "/dashboard/super-admin/orders",
    label: "Checkout Orders",
    icon: ShoppingBag,
  },
  {
    href: "/dashboard/super-admin/payments",
    label: "পেমেন্ট",
    icon: ReceiptText,
  },
];

const memberOnlyPaths = [
  "/dashboard/wings",
  "/dashboard/referrals",
  "/dashboard/commissions",
  "/dashboard/generation-income",
  "/dashboard/products",
  "/dashboard/earnings",
  "/dashboard/payments",
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const storedUser = useAppSelector((state) => state.auth.user);
  const { data: currentUser } = useGetMeQuery(undefined, {
    skip: !accessToken,
  });
  const [logout] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const activeUser = currentUser ?? storedUser;
  const isAdminRole =
    activeUser?.role === "admin" || activeUser?.role === "super-admin";
  const visibleNavItems = isAdminRole
    ? [
        { href: "/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
        { href: "/dashboard/profile", label: "প্রোফাইল", icon: User },
        ...adminNavItems,
      ]
    : navItems;

  useEffect(() => {
    if (authHydrated && !accessToken) {
      router.replace("/login");
    }
  }, [accessToken, authHydrated, router]);

  useEffect(() => {
    const isMemberOnlyPath = memberOnlyPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    if (accessToken && activeUser && isAdminRole && isMemberOnlyPath) {
      router.replace("/dashboard/super-admin/payments");
    }
  }, [accessToken, activeUser, isAdminRole, pathname, router]);

  async function handleLogout() {
    await logout()
      .unwrap()
      .catch(() => undefined);
    dispatch(clearCredentials());
    router.replace("/login");
  }

  function openMobileMenu() {
    setCollapsed(false);
    setOpen(true);
  }

  if (!authHydrated || !accessToken) {
    return (
      <main className="grid min-h-screen place-items-center bg-background text-muted">
        লোড হচ্ছে...
      </main>
    );
  }

  if (
    activeUser &&
    isAdminRole &&
    memberOnlyPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    )
  ) {
    return (
      <main className="grid min-h-screen place-items-center bg-background text-muted">
        রিডাইরেক্ট হচ্ছে...
      </main>
    );
  }

  const sidebar = (
    <aside
      className={cn(
        "flex h-full w-[min(18rem,calc(100vw-2rem))] flex-col border-r border-gold bg-sidebar text-white transition-all",
        collapsed ? "lg:w-20" : "lg:w-72",
      )}
    >
      <div className="flex h-20 items-center justify-between gap-2 px-4 sm:px-5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <BrandLogo
            className="h-14 w-full max-w-56"
            priority
            framed={false}
            variant="wide"
          />
        </Link>
        <button
          onClick={() => setCollapsed((value) => !value)}
          className="hidden rounded-full p-2 text-white/80 hover:bg-gold-light/20 hover:text-white lg:block"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-full p-2 text-white/80 hover:bg-gold-light/20 hover:text-white lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {visibleNavItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-r-2xl border-l-4 px-4 py-3 text-sm font-semibold transition",
                active
                  ? "border-elevated bg-elevated text-gold"
                  : "border-transparent text-white/80 hover:bg-gold-light/20 hover:text-white",
              )}
            >
              <Icon size={19} />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="m-4 rounded-[18px] border border-line bg-gold-light/20 p-4 text-sm text-white">
        {!collapsed ? "রেফার লিংক শেয়ার করে পরবর্তী লেভেল আনলক করুন" : "৳"}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        {sidebar}
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-foreground/60 lg:hidden">
          <div className="h-full w-[min(18rem,calc(100vw-2rem))]">
            {sidebar}
          </div>
        </div>
      ) : null}

      <div
        className={cn("transition-all", collapsed ? "lg:pl-20" : "lg:pl-72")}
      >
        <header className="sticky top-0 z-30 flex h-16 min-w-0 items-center justify-between gap-2 border-b border-line bg-background/86 px-3 backdrop-blur-xl sm:h-20 sm:gap-3 sm:px-4 md:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-gold transition hover:bg-gold/10 lg:hidden"
              onClick={openMobileMenu}
              aria-label="মেনু খুলুন"
              title="মেনু খুলুন"
            >
              <Menu size={20} />
            </button>
            <div className="hidden min-w-0 flex-1 sm:block">
              <p className="truncate text-[11px] text-muted sm:text-xs">
                স্বাগতম
              </p>
              <h1
                className="truncate text-sm font-bold text-foreground sm:text-lg"
                title={activeUser?.name ?? "সদস্য"}
              >
                {activeUser?.name ?? "সদস্য"}
              </h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
            <LanguageToggle tone="light" />
            <button
              type="button"
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-gold-light sm:h-11 sm:w-11"
              aria-label="নোটিফিকেশন"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold-light" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-gold hover:text-gold sm:grid sm:h-11 sm:w-11"
              aria-label="লগআউট"
            >
              <LogOut size={18} />
            </button>
            <div
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-xs font-bold text-white sm:h-11 sm:w-11 sm:text-base"
              title={activeUser?.name ?? "সদস্য"}
              aria-label={activeUser?.name ?? "সদস্য"}
            >
              {activeUser ? initials(activeUser.name) : "স"}
            </div>
          </div>
        </header>
        <main className="min-w-0 px-3 py-5 sm:px-4 sm:py-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
