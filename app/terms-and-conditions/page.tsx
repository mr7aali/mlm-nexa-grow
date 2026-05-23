import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, ShieldAlert } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Terms and Conditions | GIOTO",
  description: "GIOTO demo platform terms and conditions.",
};

const terms = [
  {
    title: "Demo purpose",
    text: "GIOTO একটি frontend-only mock MLM referral UI। এখানে দেখানো income, commission, user, product এবং admin data বাস্তব financial promise নয়।",
  },
  {
    title: "Account ও access",
    text: "Login, registration এবং admin panel demo flow দেখানোর জন্য রাখা হয়েছে। এগুলো real authentication বা protected account system হিসেবে ব্যবহারযোগ্য নয়।",
  },
  {
    title: "Product ও checkout",
    text: "Product catalog, checkout form, order ID এবং payment method শুধু UI preview। কোনো real order, delivery বা payment processing সম্পন্ন হয় না।",
  },
  {
    title: "Referral ও commission",
    text: "Referral link, level progress এবং commission calculation mock data থেকে তৈরি। এগুলো কোনো guaranteed earning বা legal MLM plan হিসেবে বিবেচ্য নয়।",
  },
  {
    title: "ব্যবহারের দায়িত্ব",
    text: "এই demo UI testing, presentation বা learning purpose-এ ব্যবহার করা যেতে পারে। বাস্তব ব্যবসায়িক ব্যবহারের আগে authentication, backend validation, compliance এবং legal review দরকার।",
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
            এই demo website ব্যবহার করার আগে নিচের শর্তগুলো জেনে নিন।
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
