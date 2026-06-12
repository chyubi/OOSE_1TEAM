import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "연구실안전관리시스템 | 한국해양대학교",
  description: "한국해양대학교 연구실 안전관리 웹 기반 업무지원 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
                // 화학물질 조회 추가
                { href: "/chemicals", label: "화학물질조회" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}