import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Tiro_Bangla } from "next/font/google";
import { ReduxProvider } from "@/components/redux-provider";
import { LanguageProvider } from "@/lib/language";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const tiroBangla = Tiro_Bangla({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GIOTO | নেটওয়ার্ক আয়ের ড্যাশবোর্ড",
  description: "ফ্রন্টএন্ড-অনলি MLM রেফারেল নেটওয়ার্ক UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${jakarta.variable} ${tiroBangla.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <LanguageProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
