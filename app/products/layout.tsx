import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export default function PublicProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-40 border-b border-gold bg-gold text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:py-4">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo className="h-11 w-36 sm:h-12 sm:w-44 md:h-14 md:w-56" priority framed={false} variant="wide" />
          </Link>

          <div className="hidden items-center gap-4 text-sm font-semibold text-white/85 sm:flex md:gap-7">
            <Link href="/products" className="hover:text-white">
              পণ্য
            </Link>
            <Link href="/login" className="hover:text-white">
              লগইন
            </Link>
          </div>

          <Link href="/products" className="shrink-0 rounded-full bg-elevated px-4 py-2 text-sm font-bold text-gold transition hover:bg-elevated/90 sm:px-5 sm:py-2.5">
            পণ্য কিনুন
          </Link>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
