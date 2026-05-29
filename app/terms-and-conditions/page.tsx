import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, RotateCcw } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = {
  title: "Terms and Conditions | GIOTO",
  description: "GIOTO Bangladesh terms, return and refund policy.",
};

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
            Please read these terms carefully before using Gioto Bangladesh or placing an order.
          </p>
        </div>

        <div className="mt-10 grid gap-5">
          <article className="rounded-[18px] border border-line bg-surface p-5 md:p-6">
            <p className="text-sm font-bold text-gold-light">English Version</p>
            <h2 className="mt-2 text-2xl font-bold">Welcome to Gioto Bangladesh!</h2>
            <p className="mt-3 leading-8 text-muted">
              These Terms and Conditions govern your use of Gioto Bangladesh (www.giotobangladesh.com). By accessing our website and purchasing our products, you agree to comply with and be bound by the following terms.
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-8 text-muted">
              <li><strong className="text-foreground">General Conditions:</strong> Gioto Bangladesh is an online product-based e-commerce platform operating in Bangladesh. We offer high-quality products for retail and wholesale purchase. To use this website, you must be at least 18 years of age.</li>
              <li><strong className="text-foreground">Account & Security:</strong> To place an order, you may be required to create an account. You are responsible for maintaining the confidentiality of your account password and agree to accept responsibility for all activities that occur under your account.</li>
              <li><strong className="text-foreground">Product Information & Pricing:</strong> We strive to provide accurate descriptions and pricing. However, typographical or technical errors may occur. Gioto Bangladesh reserves the right to correct any inaccuracies at any time without prior notice. Product availability is subject to stock.</li>
              <li><strong className="text-foreground">Orders and Advanced Payment:</strong> We operate strictly on an advanced payment model. <strong className="text-foreground">We do not offer Cash on Delivery (COD).</strong> All orders must be fully paid online via our authorized digital payment gateways (bKash, Nagad, Rocket, or Bank Cards) before the order is processed and shipped. Gioto Bangladesh reserves the right to refuse or cancel any order due to stock unavailability or logistical limitations.</li>
              <li><strong className="text-foreground">Intellectual Property:</strong> All content, logos, graphics, text, and images on this website are the sole property of Gioto Bangladesh. Unauthorized use of this material is strictly prohibited.</li>
            </ul>
          </article>

          <article className="rounded-[18px] border border-line bg-surface p-5 md:p-6">
            <p className="text-sm font-bold text-gold-light">বাংলা সংস্করণ</p>
            <h2 className="mt-2 text-2xl font-bold">Gioto Bangladesh-এ আপনাকে স্বাগতম!</h2>
            <p className="mt-3 leading-8 text-muted">
              Gioto Bangladesh (www.giotobangladesh.com) ওয়েবসাইটটি ব্যবহার করার আগে দয়া করে নিচের শর্তাবলী মনোযোগ দিয়ে পড়ুন। আমাদের ওয়েবসাইট ব্যবহার করা বা এখান থেকে পণ্য কেনা মানে আপনি এই শর্তাবলী মেনে নিয়েছেন বলে গণ্য হবে।
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-8 text-muted">
              <li><strong className="text-foreground">সাধারণ শর্তাবলী:</strong> Gioto Bangladesh একটি অনলাইন প্রোডাক্ট সেলিং ই-কমার্স প্ল্যাটফর্ম। আমরা বাংলাদেশে বিভিন্ন ধরনের মানসম্মত পণ্য বিক্রি করে থাকি। এই ওয়েবসাইট ব্যবহার করার জন্য আপনাকে অবশ্যই প্রাপ্তবয়স্ক (১৮ বছর বা তার বেশি) হতে হবে।</li>
              <li><strong className="text-foreground">অ্যাকাউন্ট ও নিরাপত্তা:</strong> ওয়েবসাইটে পণ্য অর্ডার করার জন্য আপনাকে একটি অ্যাকাউন্ট তৈরি করতে হতে পারে। আপনার অ্যাকাউন্টের পাসওয়ার্ডের গোপনীয়তা রক্ষার দায়িত্ব সম্পূর্ণ আপনার এবং অ্যাকাউন্টের মাধ্যমে হওয়া যেকোনো কার্যক্রমের জন্য আপনি নিজেই দায়ী থাকবেন।</li>
              <li><strong className="text-foreground">পণ্য এবং মূল্য নির্ধারণ:</strong> আমরা ওয়েবসাইটে পণ্যের সঠিক বিবরণ এবং মূল্য প্রদর্শন করার সর্বোচ্চ চেষ্টা করি। তবে কারিগরি ত্রুটির কারণে কোনো তথ্যে ভুল থাকলে, Gioto Bangladesh যেকোনো সময় তা সংশোধন করার অধিকার রাখে। পণ্যের স্টক সীমিত হতে পারে এবং মূল্য যেকোনো সময় পরিবর্তিত হতে পারে।</li>
              <li><strong className="text-foreground">অর্ডার এবং অগ্রিম পেমেন্ট:</strong> আমাদের সমস্ত অর্ডার সম্পূর্ণ অগ্রিম পেমেন্ট পদ্ধতিতে সম্পন্ন হয়। <strong className="text-foreground">আমরা কোনো ক্যাশ অন ডেলিভারি (COD) সুবিধা প্রদান করি না।</strong> অর্ডারটি সফলভাবে প্রসেস এবং শিপিং করার জন্য আমাদের অনুমোদিত ডিজিটাল পেমেন্ট গেটওয়ে (বিকাশ, নগদ, রকেট বা ব্যাংক কার্ড)-এর মাধ্যমে সম্পূর্ণ মূল্য অনলাইনে পরিশোধ করতে হবে। স্টক না থাকা বা ডেলিভারি সমস্যার কারণে Gioto Bangladesh যেকোনো অর্ডার বাতিল করার পূর্ণ ক্ষমতা রাখে।</li>
              <li><strong className="text-foreground">মেধা সম্পত্তি:</strong> এই ওয়েবসাইটের সমস্ত কনটেন্ট, লোগো, টেক্সট, গ্রাফিক্স এবং ইমেজ Gioto Bangladesh-এর নিজস্ব সম্পত্তি। অনুমতি ছাড়া এগুলো বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা সম্পূর্ণ নিষিদ্ধ।</li>
            </ul>
          </article>
        </div>

        <div className="mt-12 max-w-3xl">
          <div className="mb-5 inline-grid h-14 w-14 place-items-center rounded-full bg-gold/10 text-gold-light">
            <RotateCcw size={28} />
          </div>
          <p className="text-sm font-semibold text-gold-light">GIOTO return policy</p>
          <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">Return and Refund Policy</h2>
        </div>

        <div className="mt-10 grid gap-5">
          <article className="rounded-[18px] border border-line bg-surface p-5 md:p-6">
            <p className="text-sm font-bold text-gold-light">English Version</p>
            <p className="mt-3 leading-8 text-muted">
              At Gioto Bangladesh, we ensure a seamless shopping experience. If you are not satisfied with your purchase, you can request a return or refund based on the following conditions:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-8 text-muted">
              <li><strong className="text-foreground">Eligibility for Returns:</strong> Customers can request a return within <strong className="text-foreground">3 working days</strong> of receiving the product if the product is damaged, broken, or defective upon delivery; the product delivered is incorrect in terms of size, color, or model; and the product is completely unused, unwashed, and in its original packaging with all tags intact.</li>
              <li><strong className="text-foreground">Return Process:</strong> If you detect any defect or error upon receiving the product, contact our Customer Support immediately via our hotline or email. The original purchase invoice or digital payment receipt must be enclosed with the returned product.</li>
              <li><strong className="text-foreground">Refund Policy:</strong> Once the returned item is received and inspected by our quality control team, we will notify you of the approval or rejection of your refund. Refunds will only be issued if the product is out of stock or a replacement cannot be provided. Approved refunds will be processed and credited to your original online payment method (Mobile Banking/Bank Account) within <strong className="text-foreground">7 to 10 working days</strong>.</li>
            </ul>
          </article>

          <article className="rounded-[18px] border border-line bg-surface p-5 md:p-6">
            <p className="text-sm font-bold text-gold-light">বাংলা সংস্করণ</p>
            <p className="mt-3 leading-8 text-muted">
              Gioto Bangladesh-এ আমরা গ্রাহকের সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। পণ্য গ্রহণের পর কোনো সমস্যা দেখা দিলে নিচের নিয়ম অনুযায়ী রিটার্ন বা রিফান্ড দাবি করা যাবে।
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5 leading-8 text-muted">
              <li><strong className="text-foreground">রিটার্ন বা পণ্য ফেরতের শর্তাবলী:</strong> গ্রাহক পণ্য পাওয়ার <strong className="text-foreground">৩ কার্যদিবসের মধ্যে</strong> রিটার্ন রিকোয়েস্ট করতে পারবেন, যদি ডেলিভারির সময় পণ্যটি ভাঙা, ছেঁড়া বা ক্ষতিগ্রস্ত অবস্থায় থাকে; অর্ডার করা পণ্যের সাইজ, রঙ বা মডেল ভুল আসে; এবং পণ্যটি সম্পূর্ণ অব্যবহৃত, অক্ষত এবং আসল প্যাকেজিং বা ট্যাগসহ থাকে।</li>
              <li><strong className="text-foreground">রিটার্ন প্রক্রিয়া:</strong> পণ্য হাতে পাওয়ার পর কোনো সমস্যা থাকলে অবিলম্বে আমাদের কাস্টমার কেয়ার নম্বরে অথবা ইমেইলের মাধ্যমে যোগাযোগ করুন। পণ্যটি ফেরত পাঠানোর সময় ডেলিভারি ইনভয়েস বা ডিজিটাল পেমেন্টের রসিদ সাথে দিতে হবে।</li>
              <li><strong className="text-foreground">রিফান্ড নীতি:</strong> ফেরত আসা পণ্যটি আমাদের কোয়ালিটি কন্ট্রোল টিম দ্বারা যাচাই করার পর যদি অভিযোগ সঠিক প্রমাণিত হয়, তবে রিফান্ড প্রক্রিয়া শুরু হবে। যদি পণ্যটি স্টকে না থাকে বা পরিবর্তন করে দেওয়া সম্ভব না হয়, তবেই কেবল রিফান্ড দেওয়া হবে। অনুমোদিত রিফান্ডের টাকা নিশ্চিত হওয়ার পর <strong className="text-foreground">৭ থেকে ১০ কার্যদিবসের মধ্যে</strong> গ্রাহকের মূল পেমেন্ট মেথডে (মোবাইল ব্যাংকিং/ব্যাংক অ্যাকাউন্টে) ফেরত পাঠানো হবে।</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
