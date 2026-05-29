import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Privacy Policy | GIOTO",
  description: "GIOTO Bangladesh privacy and data security policy.",
};

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
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">Privacy and Data Security Policy</h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            Your privacy is highly important to us. Gioto Bangladesh is committed to protecting the personal data you share with us.
          </p>
        </div>

        <div className="mt-10 grid gap-5">
          <article className="rounded-[18px] border border-line bg-surface p-5 md:p-6">
            <p className="text-sm font-bold text-gold-light">English Version</p>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-8 text-muted">
              <li><strong className="text-foreground">Information We Collect:</strong> We collect necessary information to process your orders smoothly, including your Name, mobile number, email address, and shipping/billing addresses. <strong className="text-foreground">We do not store your confidential pins, passwords, or card credentials.</strong></li>
              <li><strong className="text-foreground">How We Use Your Information:</strong> The collected data is used exclusively to process, fulfill, and deliver your orders, improve our customer service, and send you promotional updates or special offers (you may opt-out/unsubscribe at any time).</li>
              <li><strong className="text-foreground">Data Protection & Security:</strong> We implement advanced security measures, including SSL (Secure Sockets Layer) encryption, to safeguard your data against unauthorized access. We <strong className="text-foreground">do not</strong> sell, rent, or lease your personal data to third parties. Your delivery details are only shared with our trusted courier partners solely for product delivery purposes.</li>
              <li><strong className="text-foreground">Cookies:</strong> Our website uses "cookies" to enhance your browsing experience. You can choose to disable cookies through your browser settings, though some features of the website may not function properly as a result.</li>
            </ul>
          </article>

          <article className="rounded-[18px] border border-line bg-surface p-5 md:p-6">
            <p className="text-sm font-bold text-gold-light">বাংলা সংস্করণ</p>
            <p className="mt-3 leading-8 text-muted">
              Gioto Bangladesh-এ আপনার ব্যক্তিগত তথ্যের নিরাপত্তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। আমরা আপনার ডেটা কীভাবে সংগ্রহ এবং সুরক্ষিত রাখি তা নিচে দেওয়া হলো:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-8 text-muted">
              <li><strong className="text-foreground">তথ্য সংগ্রহ:</strong> আমরা মূলত আপনার অর্ডার সফলভাবে সম্পন্ন করার জন্য প্রয়োজনীয় তথ্য সংগ্রহ করি, যেমন: নাম, মোবাইল নম্বর, ইমেইল অ্যাড্রেস এবং পণ্য ডেলিভারির ঠিকানা। <strong className="text-foreground">আমরা আপনার কোনো গোপন পিন, পাসওয়ার্ড বা কার্ডের তথ্য সংরক্ষণ করি না।</strong></li>
              <li><strong className="text-foreground">তথ্য ব্যবহার:</strong> আপনার সংগৃহীত তথ্য আমরা শুধুমাত্র আপনার অর্ডার প্রসেস ও সফলভাবে ডেলিভারি নিশ্চিত করতে, কাস্টমার সার্ভিসের উন্নয়ন করতে এবং আমাদের নতুন পণ্যের অফার বা প্রমোশনাল ক্যাম্পেইন সম্পর্কে আপনাকে অবহিত করতে ব্যবহার করি (আপনি চাইলে যেকোনো সময় অফার নোটিফিকেশন বন্ধ করতে পারেন)।</li>
              <li><strong className="text-foreground">ডেটা নিরাপত্তা:</strong> আপনার তথ্য সুরক্ষিত রাখতে আমরা উন্নত এনক্রিপশন প্রযুক্তি (SSL Security) ব্যবহার করি। আমরা আপনার অনুমতি ছাড়া কোনো তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রি বা শেয়ার করি না। তবে ডেলিভারি পার্টনারদের (কুরিয়ার সার্ভিস) পণ্য পৌঁছানোর স্বার্থে প্রয়োজনীয় তথ্য (নাম, ঠিকানা, ফোন নম্বর) দেওয়া হয়ে থাকে।</li>
              <li><strong className="text-foreground">কুকিজ (Cookies):</strong> আমাদের ওয়েবসাইট আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে 'কুকিজ' ব্যবহার করতে পারে। আপনি চাইলে আপনার ব্রাউজার সেটিং থেকে কুকিজ বন্ধ করে রাখতে পারেন, তবে এতে ওয়েবসাইটের কিছু ফিচার কাজ নাও করতে পারে।</li>
            </ul>
          </article>
        </div>

        <div className="mt-10 rounded-[18px] border border-gold/20 bg-gold/10 p-5">
          <p className="flex items-center gap-3 font-semibold text-gold-light">
            <Mail size={18} />
            Contact
          </p>
          <p className="mt-2 leading-8 text-muted">
            Privacy or data security নিয়ে কোনো প্রশ্ন থাকলে support@giotobangladesh.com ঠিকানায় যোগাযোগ করতে পারেন।
          </p>
        </div>
      </section>
    </main>
  );
}
