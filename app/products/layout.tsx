import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageToggle } from "@/components/language-toggle";

export default function PublicProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-40 border-b border-gold bg-gold text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:h-20 sm:gap-3 sm:px-4">
          <Link href="/" className="flex min-w-0 shrink items-center">
            <BrandLogo
              className="h-9 w-24 max-w-[30vw] sm:h-12 sm:w-44 md:h-14 md:w-56"
              priority
              framed={false}
              variant="wide"
            />
          </Link>

          <div className="hidden min-w-0 items-center gap-4 text-sm font-semibold text-white/85 sm:flex md:gap-7">
            <Link href="/products" className="whitespace-nowrap hover:text-white">
              পণ্য
            </Link>
            <Link href="/login" className="whitespace-nowrap hover:text-white">
              লগইন
            </Link>
          </div>

          <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageToggle />
            <Link
              href="/products"
              className="shrink-0 whitespace-nowrap rounded-full bg-elevated px-3 py-2 text-xs font-bold leading-none text-gold transition hover:bg-elevated/90 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <span className="sm:hidden">কিনুন</span>
              <span className="hidden sm:inline">পণ্য কিনুন</span>
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
