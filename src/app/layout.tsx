import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "연구실안전관리시스템",
  description: "연구실 안전관리 웹 기반 업무지원 시스템",
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
              <a
                href="/"
                className="text-blue-700 font-bold text-lg tracking-tight hover:text-blue-800 transition-colors"
              >
                연구실안전관리시스템
              </a>
            </div>
            <nav className="flex items-center gap-1">
              {[
                { href: "/users", label: "사용자관리" },
                { href: "/labs", label: "연구실관리" },
                { href: "/inspections/history", label: "점검관리" },
                { href: "/chemicals", label: "화학물질관리" },
                { href: "/education/courses", label: "안전교육관리" },
                { href: "/waste/status", label: "폐기물관리" },
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
