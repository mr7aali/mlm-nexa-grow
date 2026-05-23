"use client";

import { Copy, X } from "lucide-react";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  asMotion?: boolean;
}) {
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
        variant === "ghost" && "rounded-full text-muted hover:bg-gold/10 hover:text-gold",
        variant === "danger" && "rounded-full border border-foreground bg-foreground text-white hover:bg-gold-dark/90",
        className,
      )}
      {...props}
    />
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border border-line bg-white px-4 text-foreground outline-none transition placeholder:text-muted focus:border-gold focus:ring-4 focus:ring-gold/10",
        className,
      )}
      {...props}
    />
  );
});

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }>(
  function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border border-line bg-white px-4 text-foreground outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(props, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={cn(
        "min-h-28 w-full rounded-2xl border border-line bg-white px-4 py-3 text-foreground outline-none transition placeholder:text-muted focus:border-gold focus:ring-4 focus:ring-gold/10",
        props.className,
      )}
    />
  );
});

export function Badge({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "green" | "blue" | "red" | "purple" | "muted" }) {
  const tones = {
    gold: "border-gold bg-gold/10 text-gold",
    green: "border-gold bg-gold/10 text-gold",
    blue: "border-gold-light bg-gold-light/10 text-gold",
    red: "border-foreground bg-foreground/10 text-foreground",
    purple: "border-gold-light bg-gold-light/20 text-gold",
    muted: "border-line bg-elevated text-muted",
  };

  return <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export function Progress({ value, color = "gold" }: { value: number; color?: "gold" | "green" | "blue" | "amber" | "red" | "purple" }) {
  const colors = {
    gold: "from-gold to-gold-light",
    green: "from-purple-light to-gold",
    blue: "from-gold-light to-gold",
    amber: "from-purple-light to-gold-light",
    red: "from-foreground to-gold",
    purple: "from-purple-light to-gold",
  };

  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-elevated">
      <div
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 p-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-[20px] border border-line bg-surface p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="heading-gradient text-2xl font-bold">{title}</h3>
          <button aria-label="বন্ধ করুন" onClick={onClose} className="rounded-full p-2 text-muted hover:bg-gold/10 hover:text-gold">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
