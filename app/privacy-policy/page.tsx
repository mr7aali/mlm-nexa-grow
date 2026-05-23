import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Privacy Policy | GIOTO",
  description: "GIOTO Bangladesh privacy policy.",
};

const sections = [
  {
    title: "আমরা কী তথ্য ব্যবহার করি",
    text: "GIOTO Bangladesh সদস্য নিবন্ধন, রেফারেল, অর্ডার এবং ড্যাশবোর্ড ব্যবস্থাপনার জন্য প্রয়োজনীয় প্রোফাইল ও কার্যক্রম সম্পর্কিত তথ্য ব্যবহার করে।",
  },
  {
    title: "ফর্ম ডেটা",
    text: "লগইন, রেজিস্ট্রেশন, checkout বা profile form-এ দেওয়া তথ্য সদস্য সেবা, অর্ডার সহায়তা এবং যোগাযোগের উদ্দেশ্যে ব্যবহার করা হতে পারে।",
  },
  {
    title: "Clipboard ও sharing",
    text: "কপি বাটন ব্যবহার করলে browser clipboard API দিয়ে referral link copy করা হয়। WhatsApp বা Facebook share link external website-এ open হতে পারে।",
  },
  {
    title: "Cookies ও tracking",
    text: "সাইটের নিরাপত্তা, পারফরম্যান্স এবং ব্যবহারযোগ্যতা উন্নত করতে প্রয়োজনীয় technical data ও cookie ব্যবহার করা হতে পারে।",
  },
  {
    title: "ডেটা নিরাপত্তা",
    text: "ব্যবহারকারীর তথ্য সুরক্ষিত রাখতে access control, validation এবং নিরাপদ data handling practice অনুসরণ করা হয়।",
  },
];

export default function PrivacyPolicyPage() {
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
            <ShieldCheck size={28} />
          </div>
          <p className="text-sm font-semibold text-gold-light">GIOTO policy</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">Privacy Policy</h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            GIOTO Bangladesh ব্যবহার করলে আপনার তথ্য কীভাবে handle করা হয়, তার সহজ ব্যাখ্যা।
          </p>
        </div>

        <div className="mt-10 grid gap-5">
          {sections.map((section) => (
            <article key={section.title} className="rounded-[18px] border border-line bg-surface p-5 md:p-6">
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <p className="mt-3 leading-8 text-muted">{section.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[18px] border border-gold/20 bg-gold/10 p-5">
          <p className="flex items-center gap-3 font-semibold text-gold-light">
            <Mail size={18} />
            Contact
          </p>
          <p className="mt-2 leading-8 text-muted">
            Privacy নিয়ে প্রশ্ন থাকলে support@giotobangladesh.com ঠিকানায় যোগাযোগ করতে পারেন।
          </p>
        </div>
      </section>
    </main>
  );
}
