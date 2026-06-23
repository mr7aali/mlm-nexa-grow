export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBn(value: string | number) {
  return String(value).replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}

export function taka(value: number) {
  return `৳${toBn(value.toLocaleString("en-IN"))}`;
}

export function referralLink(code: string) {
  return code;
}

export function isOutOfStock(stock?: number | string | null) {
  if (stock === undefined || stock === null || stock === "") return false;
  const value = Number(stock);
  return Number.isFinite(value) && value <= 0;
}

export function availableStock(stock?: number | string | null) {
  if (stock === undefined || stock === null || stock === "") return null;
  const value = Number(stock);
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : null;
}

export function stockLabel(
  stock?: number | string | null,
  fallback = "Available",
  unitLabel = "in stock",
  outLabel = "Out of stock",
) {
  const value = availableStock(stock);
  if (value === null) return fallback;
  return value > 0 ? `${toBn(value)} ${unitLabel}` : outLabel;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}
