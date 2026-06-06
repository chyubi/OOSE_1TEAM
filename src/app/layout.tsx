import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "폐기물관리 시스템",
  description: "UC-W01 폐기물 배출 신청, UC-W05 폐기물 처리현황 조회",
};

const NAV_ITEMS = [
  { href: "/waste/request", label: "배출 신청" },
  { href: "/waste/status", label: "처리현황 조회" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="text-base font-bold text-blue-700">
              폐기물관리
            </Link>
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
