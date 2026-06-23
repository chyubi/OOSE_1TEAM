import type { Metadata } from "next";
<<<<<<< HEAD
=======
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
>>>>>>> origin/ukdong_폐기물관리
import "./globals.css";

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "연구실안전관리시스템 | 한국해양대학교",
  description: "한국해양대학교 연구실 안전관리 웹 기반 업무지원 시스템",
=======
  title: "연구실안전관리시스템",
  description: "UC-W01 폐기물 배출 신청, UC-W05 폐기물 처리현황 조회",
>>>>>>> origin/ukdong_폐기물관리
};

const NAV_ITEMS = [
  { href: "/waste/request", label: "배출 신청" },
  { href: "/waste/status", label: "처리현황 조회" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="ko">
      <body className="font-sans antialiased">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-blue-700 font-bold text-lg tracking-tight">
                🔬 연구실안전관리시스템
              </span>
              <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">
                한국해양대학교
              </span>
            </div>
            <nav className="flex items-center gap-1">
              {[
                { href: "/users", label: "사용자관리" },
                { href: "/users/register", label: "등록 신청" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {label}
                </a>
=======
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-base font-bold text-blue-700">
                연구실안전관리시스템
              </Link>
              <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500">
                폐기물관리
              </span>
            </div>
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  {item.label}
                </Link>
>>>>>>> origin/ukdong_폐기물관리
              ))}
            </nav>
          </div>
        </header>
<<<<<<< HEAD
        <main>{children}</main>
=======
        {children}
>>>>>>> origin/ukdong_폐기물관리
      </body>
    </html>
  );
}
