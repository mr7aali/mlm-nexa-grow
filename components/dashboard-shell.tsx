"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Boxes,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Coins,
  LayoutDashboard,
  Menu,
  Network,
  User,
  Users,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/dashboard/wings", label: "মাই উইংস", icon: Network },
  { href: "/dashboard/referrals", label: "রেফারেল", icon: Users },
  { href: "/dashboard/commissions", label: "কমিশন", icon: ChartNoAxesCombined },
  { href: "/dashboard/products", label: "পণ্য", icon: Boxes },
  { href: "/dashboard/earnings", label: "আয়", icon: Coins },
  { href: "/dashboard/profile", label: "প্রোফাইল", icon: User },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sidebar = (
    <aside className={cn("flex h-full flex-col border-r border-gold bg-sidebar text-white transition-all", collapsed ? "w-20" : "w-72")}>
      <div className="flex h-20 items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo className="h-12 w-12" priority />
        </Link>
        <button onClick={() => setCollapsed((value) => !value)} className="hidden rounded-full p-2 text-white/80 hover:bg-gold-light/20 hover:text-white lg:block">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button onClick={() => setOpen(false)} className="rounded-full p-2 text-white/80 hover:bg-gold-light/20 hover:text-white lg:hidden">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-r-2xl border-l-4 px-4 py-3 text-sm font-semibold transition",
                active ? "border-elevated bg-elevated text-gold" : "border-transparent text-white/80 hover:bg-gold-light/20 hover:text-white",
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
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {open ? <div className="fixed inset-0 z-50 bg-foreground/60 lg:hidden"><div className="h-full w-72">{sidebar}</div></div> : null}

      <div className={cn("transition-all", collapsed ? "lg:pl-20" : "lg:pl-72")}>
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-line bg-background/86 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="px-3 lg:hidden" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </Button>
            <div>
              <p className="text-xs text-muted">স্বাগতম</p>
              <h1 className="text-lg font-bold text-foreground">রাফি হাসান</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full border border-line bg-surface p-3 text-gold-light">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold-light" />
            </button>
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gold font-bold text-white">রা</div>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
