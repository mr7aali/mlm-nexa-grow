import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative block h-12 w-12 shrink-0 overflow-hidden rounded-full bg-elevated ring-1 ring-line",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt="GIOTO লোগো"
        fill
        sizes="48px"
        priority={priority}
        className="object-contain"
      />
    </span>
  );
}
