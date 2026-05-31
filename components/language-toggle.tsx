"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({
  className,
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "light";
}) {
  const { language, setLanguage } = useI18n();
  const isLight = tone === "light";

  return (
    <div
      data-no-translate
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border p-1 text-xs font-bold",
        isLight
          ? "border-line bg-surface text-gold"
          : "border-white/25 bg-white/10 text-white",
        className,
      )}
      aria-label="Language selector"
    >
      <Languages
        size={15}
        className="mx-0.5 hidden text-current min-[380px]:block sm:mx-1"
      />
      <button
        type="button"
        onClick={() => setLanguage("bn")}
        aria-pressed={language === "bn"}
        className={cn(
          "rounded-full px-2 py-1.5 transition sm:px-3",
          language === "bn"
            ? isLight
              ? "bg-gold text-white"
              : "bg-white text-gold"
            : isLight
              ? "text-muted hover:bg-gold/10 hover:text-gold"
              : "text-white/75 hover:bg-white/10 hover:text-white",
        )}
      >
        <span className="sm:hidden">BN</span>
        <span className="hidden sm:inline">বাংলা</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={cn(
          "rounded-full px-2 py-1.5 transition sm:px-3",
          language === "en"
            ? isLight
              ? "bg-gold text-white"
              : "bg-white text-gold"
            : isLight
              ? "text-muted hover:bg-gold/10 hover:text-gold"
              : "text-white/75 hover:bg-white/10 hover:text-white",
        )}
      >
        <span className="sm:hidden">EN</span>
        <span className="hidden sm:inline">English</span>
      </button>
    </div>
  );
}
