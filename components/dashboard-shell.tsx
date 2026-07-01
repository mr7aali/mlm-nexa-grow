"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Banknote,
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
  Trash2,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";
import {
  useGetMeQuery,
  useGetNotificationsQuery,
  useLogoutMutation,
  useDeleteNotificationMutation,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/lib/api";
import { clearCredentials } from "@/lib/auth-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useI18n } from "@/lib/i18n";
import type { NotificationItem } from "@/lib/api-types";
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
    label: "টিম ইনফো",
    icon: Trophy,
  },
  {
    href: "/dashboard/purchased-products",
    label: "ক্রয়কৃত পণ্য",
    icon: ShoppingBag,
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
  {
    href: "/dashboard/super-admin/commission-expenses",
    label: "Commission Expenses",
    icon: Banknote,
  },
  {
    href: "/dashboard/super-admin/generation-coins",
    label: "Generation Coins",
    icon: Coins,
  },
];

const memberOnlyPaths = [
  "/dashboard/wings",
  "/dashboard/referrals",
  "/dashboard/commissions",
  "/dashboard/generation-income",
  "/dashboard/purchased-products",
  "/dashboard/products",
  "/dashboard/earnings",
  "/dashboard/payments",
];

function NotificationCenterPanel({
  notifications,
  loading,
  unreadCount,
  onClose,
  onMarkAllRead,
  onMarkRead,
  onDelete,
  contentClassName,
}: {
  notifications: NotificationItem[];
  loading: boolean;
  unreadCount: number;
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkRead: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
  contentClassName: string;
}) {
  const { language } = useI18n();
  const text =
    language === "bn"
      ? {
          title: "\u09a8\u09cb\u099f\u09bf\u09ab\u09bf\u0995\u09c7\u09b6\u09a8",
          noUnread: "\u0985\u09aa\u09a0\u09bf\u09a4 \u0986\u09aa\u09a1\u09c7\u099f \u09a8\u09c7\u0987",
          unread: (count: number) =>
            `${count} \u099f\u09bf \u0985\u09aa\u09a0\u09bf\u09a4 \u0986\u09aa\u09a1\u09c7\u099f`,
          markAllRead: "\u09b8\u09ac \u09aa\u09dc\u09be \u09b9\u09df\u09c7\u099b\u09c7",
          close: "\u09a8\u09cb\u099f\u09bf\u09ab\u09bf\u0995\u09c7\u09b6\u09a8 \u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09c1\u09a8",
          loading: "\u09a8\u09cb\u099f\u09bf\u09ab\u09bf\u0995\u09c7\u09b6\u09a8 \u09b2\u09cb\u09a1 \u09b9\u099a\u09cd\u099b\u09c7...",
          emptyTitle: "\u0995\u09cb\u09a8\u09cb \u09a8\u09cb\u099f\u09bf\u09ab\u09bf\u0995\u09c7\u09b6\u09a8 \u09a8\u09c7\u0987",
          emptyText:
            "\u099f\u09bf\u09ae, \u0995\u09ae\u09bf\u09b6\u09a8, \u098f\u09ac\u0982 \u09aa\u09c7\u09ae\u09c7\u09a8\u09cd\u099f \u0986\u09aa\u09a1\u09c7\u099f \u098f\u0996\u09be\u09a8\u09c7 \u09a6\u09c7\u0996\u09be \u09af\u09be\u09ac\u09c7\u0964",
          delete: "\u09a8\u09cb\u099f\u09bf\u09ab\u09bf\u0995\u09c7\u09b6\u09a8 \u09ae\u09c1\u099b\u09c1\u09a8",
        }
      : {
          title: "Notifications",
          noUnread: "No unread updates",
          unread: (count: number) =>
            `${count} unread update${count === 1 ? "" : "s"}`,
          markAllRead: "Mark all read",
          close: "Close notifications",
          loading: "Loading notifications...",
          emptyTitle: "No notifications",
          emptyText: "Team, commission, and payment updates will appear here.",
          delete: "Delete notification",
        };
  const hasNotifications = notifications.length > 0;

  function formatNotificationTime(value: string) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return value;

    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="text-sm font-black text-foreground">
            {text.title}
          </p>
          <p className="text-xs text-muted">
            {unreadCount ? text.unread(unreadCount) : text.noUnread}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {unreadCount ? (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="rounded-full px-2 py-1 text-xs font-semibold text-gold transition hover:bg-gold/10"
            >
              {text.markAllRead}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted transition hover:bg-gold/10 hover:text-gold"
            aria-label={text.close}
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className={contentClassName}>
        {loading ? (
          <p className="rounded-lg border border-line bg-elevated px-3 py-3 text-sm text-muted">
            {text.loading}
          </p>
        ) : hasNotifications ? (
          <div className="space-y-2">
            {notifications.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group rounded-lg border px-3 py-3 text-sm leading-6 transition",
                  item.unread
                    ? "border-gold/30 bg-gold/10 text-foreground"
                    : "border-line bg-elevated/70 text-muted",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => item.unread && onMarkRead(item.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="block font-semibold">{item.message}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {formatNotificationTime(item.createdAt)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted opacity-100 transition hover:bg-gold/10 hover:text-gold sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label={text.delete}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-line px-3 py-6 text-center">
            <Bell className="mx-auto text-muted" size={22} />
            <p className="mt-2 text-sm font-semibold text-foreground">
              {text.emptyTitle}
            </p>
            <p className="mt-1 text-xs text-muted">
              {text.emptyText}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsMounted, setNotificationsMounted] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const activeUser = currentUser ?? storedUser;
  const isAdminRole =
    activeUser?.role === "admin" || activeUser?.role === "super-admin";
  const { data: notificationData, isFetching: notificationsLoading } =
    useGetNotificationsQuery(undefined, {
      skip: !accessToken || !activeUser,
      pollingInterval: 30000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllNotificationsRead] = useMarkAllNotificationsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const notifications = notificationData?.items ?? [];
  const unreadCount = notificationData?.unreadCount ?? 0;
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

  useEffect(() => {
    setNotificationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (notificationsOpen) {
      setNotificationsMounted(true);
      const frame = window.requestAnimationFrame(() => {
        setNotificationsVisible(true);
      });

      return () => window.cancelAnimationFrame(frame);
    }

    setNotificationsVisible(false);
    const timeout = window.setTimeout(() => {
      setNotificationsMounted(false);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [notificationsOpen]);

  useEffect(() => {
    if (notificationsMounted) {
      return;
    }

    setNotificationsVisible(false);
  }, [notificationsMounted]);

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

  function handleMarkNotificationRead(notificationId: string) {
    markNotificationRead(notificationId).unwrap().catch(() => undefined);
  }

  function handleMarkAllNotificationsRead() {
    markAllNotificationsRead().unwrap().catch(() => undefined);
  }

  function handleDeleteNotification(notificationId: string) {
    deleteNotification(notificationId).unwrap().catch(() => undefined);
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((value) => !value)}
                className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-gold-light transition hover:border-gold hover:text-gold sm:h-11 sm:w-11"
                aria-label="নোটিফিকেশন"
                aria-expanded={notificationsOpen}
              >
                <Bell size={18} />
                {unreadCount ? (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-light px-1 text-[10px] font-black text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </button>
              {notificationsOpen ? (
                <div className="absolute right-0 top-12 z-50 hidden w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-lg border border-line bg-white shadow-2xl sm:block">
                  <NotificationCenterPanel
                    notifications={notifications}
                    loading={notificationsLoading}
                    unreadCount={unreadCount}
                    onClose={() => setNotificationsOpen(false)}
                    onMarkAllRead={handleMarkAllNotificationsRead}
                    onMarkRead={handleMarkNotificationRead}
                    onDelete={handleDeleteNotification}
                    contentClassName="max-h-80 overflow-y-auto p-3"
                  />
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-gold hover:text-gold sm:grid sm:h-11 sm:w-11"
              aria-label="লগআউট"
            >
              <LogOut size={18} />
            </button>
            <div
              className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-gold text-xs font-bold text-white sm:h-11 sm:w-11 sm:text-base"
              title={activeUser?.name ?? "সদস্য"}
              aria-label={activeUser?.name ?? "সদস্য"}
            >
              {activeUser?.profilePicture ? (
                <Image
                  src={activeUser.profilePicture}
                  alt={activeUser.name}
                  fill
                  sizes="44px"
                  unoptimized
                  className="object-cover"
                />
              ) : activeUser ? (
                initials(activeUser.name)
              ) : (
                "স"
              )}
            </div>
          </div>
        </header>
        <main className="min-w-0 px-3 py-5 sm:px-4 sm:py-6 md:px-8">
          {children}
        </main>
      </div>
      {notificationsMounted ? (
        <div
          className={cn(
            "fixed inset-0 z-[70] bg-foreground/50 transition-opacity duration-300 ease-out sm:hidden",
            notificationsVisible ? "opacity-100" : "opacity-0",
          )}
        >
          <button
            type="button"
            className="absolute inset-0"
            aria-label="নোটিফিকেশন বন্ধ করুন"
            onClick={() => setNotificationsOpen(false)}
          />
          <aside
            className={cn(
              "absolute right-0 top-0 flex h-dvh w-[min(22rem,88vw)] flex-col overflow-hidden border-l border-line bg-white shadow-2xl transition-transform duration-300 ease-out will-change-transform",
              notificationsVisible ? "translate-x-0" : "translate-x-full",
            )}
          >
            <NotificationCenterPanel
              notifications={notifications}
              loading={notificationsLoading}
              unreadCount={unreadCount}
              onClose={() => setNotificationsOpen(false)}
              onMarkAllRead={handleMarkAllNotificationsRead}
              onMarkRead={handleMarkNotificationRead}
              onDelete={handleDeleteNotification}
              contentClassName="flex-1 overflow-y-auto p-3"
            />
          </aside>
        </div>
      ) : null}
    </div>
  );
}
