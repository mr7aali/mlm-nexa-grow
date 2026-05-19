"use client";

import { motion } from "framer-motion";
import { Copy, X } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  asMotion = false,
}: {
  children: ReactNode;
  className?: string;
  asMotion?: boolean;
}) {
  if (asMotion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45 }}
        className={cn("nexa-card p-5", className)}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={cn("nexa-card p-5", className)}>{children}</div>;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" | "danger" }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "gold-button",
        variant === "outline" && "outline-gold hover:bg-gold/10",
        variant === "ghost" && "rounded-full text-muted hover:bg-white/5 hover:text-foreground",
        variant === "danger" && "rounded-full border border-red-400/40 bg-red-500/10 text-red-200 hover:bg-red-500/20",
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-white/10 bg-elevated/70 px-4 text-foreground outline-none transition placeholder:text-muted focus:border-gold/70 focus:ring-4 focus:ring-gold/10",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-2xl border border-white/10 bg-elevated/70 px-4 text-foreground outline-none transition focus:border-gold/70 focus:ring-4 focus:ring-gold/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-2xl border border-white/10 bg-elevated/70 px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-gold/70 focus:ring-4 focus:ring-gold/10",
        props.className,
      )}
    />
  );
}

export function Badge({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "green" | "blue" | "red" | "purple" | "muted" }) {
  const tones = {
    gold: "border-gold/35 bg-gold/10 text-gold-light",
    green: "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
    blue: "border-sky-400/35 bg-sky-400/10 text-sky-200",
    red: "border-red-400/35 bg-red-400/10 text-red-200",
    purple: "border-purple-light/35 bg-purple-light/10 text-purple-100",
    muted: "border-white/10 bg-white/5 text-muted",
  };

  return <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export function Progress({ value, color = "gold" }: { value: number; color?: "gold" | "green" | "blue" | "amber" | "red" | "purple" }) {
  const colors = {
    gold: "from-gold-light to-gold-dark",
    green: "from-emerald-300 to-emerald-600",
    blue: "from-sky-300 to-sky-600",
    amber: "from-amber-200 to-amber-600",
    red: "from-red-300 to-red-600",
    purple: "from-purple-light to-purple-accent",
  };

  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn("h-full rounded-full bg-gradient-to-r", colors[color])}
      />
    </div>
  );
}

export function SectionHeading({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {eyebrow ? <p className="mb-3 text-sm font-semibold text-gold-light">{eyebrow}</p> : null}
      <h2 className="heading-gradient text-3xl font-bold leading-tight md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-8 text-muted md:text-lg">{text}</p> : null}
    </div>
  );
}

export function CopyButton({ value, label = "কপি" }: { value: string; label?: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => navigator.clipboard?.writeText(value)}
      className="shrink-0"
    >
      <Copy size={16} />
      {label}
    </Button>
  );
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-[20px] border border-white/10 bg-surface p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="heading-gradient text-2xl font-bold">{title}</h3>
          <button aria-label="বন্ধ করুন" onClick={onClose} className="rounded-full p-2 text-muted hover:bg-white/5 hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
