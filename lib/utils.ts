export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBn(value: string | number) {
  return String(value).replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}

export function taka(value: number) {
  return `৳${toBn(value.toLocaleString("en-IN"))}`;
}

export function referralLink(code = "NXG-RAFI-2048") {
  return `https://nexagrow.demo/register?ref=${code}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}
