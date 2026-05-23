import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Privacy Policy | GIOTO",
  description: "GIOTO demo platform privacy policy.",
};

const sections = [
  {
    title: "আমরা কী তথ্য দেখাই",
    text: "এই ওয়েবসাইটটি একটি frontend-only demo UI। এখানে দেখানো নাম, আয়, পণ্য, রেফারেল এবং ড্যাশবোর্ড ডেটা mock data হিসেবে ব্যবহার করা হয়েছে।",
  },
  {
    title: "ফর্ম ডেটা",
    text: "লগইন, রেজিস্ট্রেশন, checkout বা profile form-এ দেওয়া তথ্য কোনো backend server-এ সংরক্ষণ করা হয় না। এগুলো শুধু UI flow প্রদর্শনের জন্য ব্যবহৃত হয়।",
  },
  {
    title: "Clipboard ও sharing",
    text: "কপি বাটন ব্যবহার করলে browser clipboard API দিয়ে referral link copy করা হয়। WhatsApp বা Facebook share link external website-এ open হতে পারে।",
  },
  {
    title: "Cookies ও tracking",
    text: "এই demo version কোনো analytics, advertising tracker বা custom cookie ব্যবহার করে না। Browser বা hosting platform তাদের নিজস্ব technical data process করতে পারে।",
  },
  {
    title: "ডেটা নিরাপত্তা",
    text: "যেহেতু এটি real account system নয়, তাই sensitive personal information বা payment credential এই demo form-এ ব্যবহার না করাই ভালো।",
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
            GIOTO demo website ব্যবহার করলে আপনার তথ্য কীভাবে handle করা হয়, তার সহজ ব্যাখ্যা।
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
            Privacy নিয়ে প্রশ্ন থাকলে hello@gioto.demo ঠিকানায় যোগাযোগ করতে পারেন।
          </p>
        </div>
      </section>
    </main>
  );
}
