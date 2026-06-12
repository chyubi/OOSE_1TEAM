import Link from "next/link";

const MENU_CARDS = [
  {
    title: "사용자 등록 신청",
    description: "UC-U01 · 연구활동종사자가 시스템 계정을 신청합니다.",
    href: "/users/register",
    color: "bg-blue-50 border-blue-200",
    icon: "👤",
  },
  {
    title: "사용자 목록 조회",
    description: "UC-U04 · 관리자가 등록된 사용자를 조건 검색합니다.",
    href: "/users",
    color: "bg-green-50 border-green-200",
    icon: "📋",
  },
  // 화학물질관리 조회/등록 카드를 대시보드 메뉴에 통합
  {
    title: "화학물질 목록 및 등록",
    description: "UC-C01 · 연구실 내 사용되는 화학물질을 조회하고 신규 등록합니다.",
    href: "/chemicals",
    color: "bg-purple-50 border-purple-200 hover:border-purple-300",
    icon: "🧪",
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
            한국해양대학교 객체지향소프트웨어공학 1팀 | 통합 시연 대시보드
          </p>
          <p className="text-gray-400 text-xs mt-1">
            담당: 차유비(SS-U) · 김도흠(SS-C)
          </p>
        </div>

        {/* 메뉴 카드 그리드 (3열로 자동 확장되도록 최적화) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {MENU_CARDS.map((card) => (
            <Link key={card.href} href={card.href}>
              <div
                className={`rounded-xl border p-6 h-full hover:shadow-md transition-all cursor-pointer flex flex-col justify-between bg-white ${card.color}`}
              >
                <div>
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 시스템 하단 서브시스템 정보 섹션 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            서브시스템 연동 정보
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "사용자관리 (SS-U)", value: "차유비 (USER_INFO)" },
              { label: "화학물질관리 (SS-C)", value: "김도흠 (TB_CHEMICAL)" },
              { label: "개발 프레임워크", value: "Next.js 15 (Turbopack)" },
              { label: "OR 매퍼 / DB", value: "Prisma / Supabase" },
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