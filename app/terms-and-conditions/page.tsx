import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, ShieldAlert } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Terms and Conditions | GIOTO",
  description: "GIOTO Bangladesh terms and conditions.",
};

const terms = [
  {
    title: "Platform purpose",
    text: "GIOTO Bangladesh পণ্য বিক্রয়, রেফারেল ব্যবস্থাপনা, কমিশন ট্র্যাকিং এবং সদস্য ড্যাশবোর্ড পরিচালনার জন্য তৈরি একটি digital commerce platform।",
  },
  {
    title: "Account ও access",
    text: "Login, registration এবং admin panel নির্ধারিত সদস্য ও পরিচালনা টিমের ব্যবহারের জন্য। আপনার account credential নিরাপদ রাখা আপনার দায়িত্ব।",
  },
  {
    title: "Product ও checkout",
    text: "Product catalog, checkout form, order ID এবং payment method অর্ডার গ্রহণ, যাচাই এবং ডেলিভারি সহায়তার জন্য ব্যবহৃত হয়।",
  },
  {
    title: "Referral ও commission",
    text: "Referral link, level progress এবং commission calculation নির্ধারিত plan, active referral এবং approved order activity-এর ভিত্তিতে বিবেচিত হবে।",
  },
  {
    title: "ব্যবহারের দায়িত্ব",
    text: "Platform ব্যবহারের সময় প্রযোজ্য আইন, company policy, payment rule এবং fair usage guideline অনুসরণ করতে হবে।",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo className="h-11 w-11" />
            <span className="font-black text-gold">GIOTO</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted transition hover:border-gold hover:text-gold">
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="max-w-3xl">
          <div className="mb-5 inline-grid h-14 w-14 place-items-center rounded-full bg-gold/10 text-gold-light">
            <FileText size={28} />
          </div>
          <p className="text-sm font-semibold text-gold-light">GIOTO terms</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">Terms and Conditions</h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            GIOTO Bangladesh ব্যবহার করার আগে নিচের শর্তগুলো জেনে নিন।
          </p>
        </div>

        <div className="mt-10 grid gap-5">
          {terms.map((term, index) => (
            <article key={term.title} className="rounded-[18px] border border-line bg-surface p-5 md:p-6">
              <p className="text-sm font-bold text-gold-light">Section {index + 1}</p>
              <h2 className="mt-2 text-2xl font-bold">{term.title}</h2>
              <p className="mt-3 leading-8 text-muted">{term.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[18px] border border-foreground/15 bg-surface p-5">
          <p className="flex items-center gap-3 font-semibold">
            <ShieldAlert size={18} className="text-gold-light" />
            Important note
          </p>
          <p className="mt-2 leading-8 text-muted">
            Production launch-er আগে policy, payout, data protection এবং payment rules নিয়ে professional legal review নেওয়া উচিত।
          </p>
        </div>
      </section>
    </main>
  );
}
