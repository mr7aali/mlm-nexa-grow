export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export function toBn(value: string | number) {
  return String(value);
}

export function taka(value: number) {
  return `BDT ${value.toLocaleString("en-IN")}`;
}

export function referralLink(code: string) {
  return `https://giotobangladesh.com/register?ref=${code}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}
