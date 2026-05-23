import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  priority = false,
  framed = true,
  variant = "mark",
}: {
  className?: string;
  priority?: boolean;
  framed?: boolean;
  variant?: "mark" | "wide";
}) {
  const isWide = variant === "wide";

  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden",
        isWide ? "h-12 w-32" : "h-12 w-12",
        framed && "rounded-2xl bg-gold p-1.5 ring-1 ring-white/20",
        className,
      )}
    >
      <Image
        src={isWide ? "/gioto-bangladesh-navbar.png" : "/logo-transparent.png"}
        alt={isWide ? "GIOTO Bangladesh logo" : "GIOTO logo"}
        width={isWide ? 795 : 96}
        height={isWide ? 314 : 96}
        sizes={isWide ? "224px" : "48px"}
        priority={priority}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
