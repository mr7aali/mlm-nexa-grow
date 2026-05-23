import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export default function PublicProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-40 border-b border-gold bg-gold text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo className="h-14 w-56" priority framed={false} variant="wide" />
          </Link>

          <div className="flex items-center gap-4 text-sm font-semibold text-white/85 md:gap-7">
            <Link href="/products" className="hover:text-white">
              পণ্য
            </Link>
            <Link href="/login" className="hover:text-white">
              লগইন
            </Link>
          </div>

          <Link href="/register" className="rounded-full bg-elevated px-5 py-2.5 text-sm font-bold text-gold transition hover:bg-elevated/90">
            যোগ দিন
          </Link>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
