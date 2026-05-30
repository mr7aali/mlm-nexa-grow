"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className, tone = "gold" }: { className?: string; tone?: "gold" | "light" }) {
  const { language, setLanguage } = useLanguage();
  const isLight = tone === "light";

  return (
    <div
      data-no-translate
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border p-1 text-xs font-bold",
        isLight ? "border-line bg-surface text-gold" : "border-white/25 bg-white/10 text-white",
        className,
      )}
      aria-label="Language selector"
    >
      <Languages size={15} className="mx-1 text-current" />
      <button
        type="button"
        onClick={() => setLanguage("bn")}
        aria-pressed={language === "bn"}
        className={cn(
          "rounded-full px-3 py-1.5 transition",
          language === "bn"
            ? isLight ? "bg-gold text-white" : "bg-white text-gold"
            : isLight ? "text-muted hover:bg-gold/10 hover:text-gold" : "text-white/75 hover:bg-white/10 hover:text-white",
        )}
      >
        বাংলা
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={cn(
          "rounded-full px-3 py-1.5 transition",
          language === "en"
            ? isLight ? "bg-gold text-white" : "bg-white text-gold"
            : isLight ? "text-muted hover:bg-gold/10 hover:text-gold" : "text-white/75 hover:bg-white/10 hover:text-white",
        )}
      >
        English
      </button>
    </div>
  );
}
