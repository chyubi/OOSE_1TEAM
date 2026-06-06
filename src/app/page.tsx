import Link from "next/link";

const FEATURES = [
  {
    uc: "UC-W01",
    title: "폐기물 배출 신청",
    description: "연구실에서 발생한 폐기물 배출 신청을 등록합니다.",
    href: "/waste/request",
  },
  {
    uc: "UC-W05",
    title: "폐기물 처리현황 조회",
    description: "폐기물 배출 신청의 처리 상태를 조건별로 조회합니다.",
    href: "/waste/status",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-4 py-16">
        <section className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-600">
            폐기물관리 서브시스템
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            폐기물 배출 신청 및 처리현황 조회
          </h1>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <Link
              key={feature.uc}
              href={feature.href}
              className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-9 min-w-16 items-center justify-center rounded-md bg-blue-50 px-3 text-sm font-semibold text-blue-700">
                {feature.uc}
              </div>
              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                {feature.title}
              </h2>
              <p className="text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
