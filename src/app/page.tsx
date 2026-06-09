import Link from "next/link";

const MENU_CARDS = [
  {
    title: "사용자관리",
    description: "SS-U · 계정 신청·승인 및 사용자 목록을 관리합니다.",
    href: "/users",
    color: "bg-blue-50 border-blue-200",
    icon: "👤",
  },
  {
    title: "연구실관리",
    description: "SS-L · 연구실 기본정보를 등록·조회·관리합니다.",
    href: "/labs",
    color: "bg-green-50 border-green-200",
    icon: "🏫",
  },
  {
    title: "점검관리",
    description: "SS-I · 일상점검 수행 및 점검 이력을 관리합니다.",
    href: "/inspections/history",
    color: "bg-amber-50 border-amber-200",
    icon: "📋",
  },
  {
    title: "화학물질관리",
    description: "SS-C · 화학물질 정보를 등록·검색·조회합니다.",
    href: "/chemicals",
    color: "bg-rose-50 border-rose-200",
    icon: "⚗️",
  },
  {
    title: "안전교육관리",
    description: "SS-E · 안전교육 과정을 개설·관리합니다.",
    href: "/education/courses",
    color: "bg-violet-50 border-violet-200",
    icon: "🎓",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* 메인 타이틀 */}
        <div className="text-center mb-14">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            연구실안전관리시스템
          </h1>
          <p className="text-gray-500 text-sm">
            한국해양대학교 객체지향소프트웨어공학 1팀 | 통합 관리 시스템
          </p>
          <p className="text-gray-400 text-xs mt-1">
            5개 서브시스템 · 사용자 / 연구실 / 점검 / 화학물질 / 안전교육
          </p>
        </div>

        {/* 메뉴 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {MENU_CARDS.map((card) => (
            <Link key={card.href} href={card.href}>
              <div
                className={`rounded-xl border p-6 hover:shadow-md transition-all cursor-pointer ${card.color}`}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {card.title}
                </h2>
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* 시스템 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            서브시스템 개요
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {[
              { label: "사용자관리", value: "SS-U" },
              { label: "연구실관리", value: "SS-L" },
              { label: "점검관리", value: "SS-I" },
              { label: "화학물질관리", value: "SS-C" },
              { label: "안전교육관리", value: "SS-E" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
