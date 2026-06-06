"use client";

// UC-I01: 일상점검 수행 페이지
// SDD CLS-I-01: InspectionPerformBoundary
// 연구실안전관리담당자가 점검결과를 입력하고 제출하는 화면

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InspectionDTO, ChecklistItem } from "@/types/inspection";

// 연구실안전법 기반 일상점검 체크리스트
const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: "C01",
    category: "일반안전",
    item: "연구실 출입문 잠금장치 정상 작동",
    result: "",
  },
  {
    id: "C02",
    category: "일반안전",
    item: "소화기 비치 및 유효기간 확인",
    result: "",
  },
  {
    id: "C03",
    category: "일반안전",
    item: "비상구 및 통로 확보 상태",
    result: "",
  },
  {
    id: "C04",
    category: "전기안전",
    item: "전기 콘센트 및 배선 상태 이상 없음",
    result: "",
  },
  {
    id: "C05",
    category: "전기안전",
    item: "전열기구 미사용 시 전원 차단",
    result: "",
  },
  {
    id: "C06",
    category: "화학물질",
    item: "화학물질 용기 밀폐 및 라벨 부착",
    result: "",
  },
  {
    id: "C07",
    category: "화학물질",
    item: "화학물질 보관 위치 적정 여부",
    result: "",
  },
  {
    id: "C08",
    category: "폐기물",
    item: "폐기물 분리수거 및 보관 상태",
    result: "",
  },
  {
    id: "C09",
    category: "보호구",
    item: "개인보호구 비치 및 상태 양호",
    result: "",
  },
  {
    id: "C10",
    category: "보호구",
    item: "안전보호구 착용 의무 준수",
    result: "",
  },
];

const RESULT_OPTIONS = [
  {
    value: "PASS",
    label: "적합",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  {
    value: "FAIL",
    label: "부적합",
    color: "bg-red-100 text-red-800 border-red-300",
  },
  {
    value: "NA",
    label: "해당없음",
    color: "bg-gray-100 text-gray-600 border-gray-300",
  },
];

const LAB_OPTIONS = [
  "기계공학연구실-101",
  "전기공학연구실-201",
  "화학공학연구실-301",
  "환경공학연구실-401",
  "해양시스템연구실-501",
];

export default function InspectionPerformPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [checklist, setChecklist] =
    useState<ChecklistItem[]>(DEFAULT_CHECKLIST);

  const [form, setForm] = useState<InspectionDTO>({
    laboratoryId: "",
    inspectionDate: new Date().toISOString().split("T")[0],
    inspectionMethod: "육안점검",
    checklistResult: "",
    nonconformReason: "",
    specialNote: "",
    writerId: "",
  });

  const handleChecklistChange = (
    id: string,
    result: "PASS" | "FAIL" | "NA",
  ) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, result } : item)),
    );
  };

  const getChecklistSummary = () => {
    const pass = checklist.filter((c) => c.result === "PASS").length;
    const fail = checklist.filter((c) => c.result === "FAIL").length;
    const na = checklist.filter((c) => c.result === "NA").length;
    const unanswered = checklist.filter((c) => c.result === "").length;
    return { pass, fail, na, unanswered };
  };

  // SDD InspectionPerformBoundary: submitInspectionResult() → showSuccessMessage()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { unanswered } = getChecklistSummary();
    if (unanswered > 0) {
      setErrorMsg(`체크리스트 ${unanswered}개 항목이 미입력 상태입니다.`);
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    // 체크리스트 결과를 JSON 문자열로 변환
    const checklistResult = JSON.stringify(
      checklist.map((c) => ({ id: c.id, item: c.item, result: c.result })),
    );

    try {
      const res = await fetch("/api/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, checklistResult }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setChecklist(DEFAULT_CHECKLIST.map((c) => ({ ...c, result: "" })));
        setForm({ ...form, nonconformReason: "", specialNote: "" });
      } else {
        setErrorMsg(data.error ?? "제출 중 오류가 발생했습니다.");
      }
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const { pass, fail, na, unanswered } = getChecklistSummary();
  const categories = [...new Set(DEFAULT_CHECKLIST.map((c) => c.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <p className="text-sm text-blue-600 font-medium mb-1">
            점검관리 / UC-I01
          </p>
          <h1 className="text-2xl font-bold text-gray-900">일상점검 수행</h1>
          <p className="text-sm text-gray-500 mt-1">
            연구실 일상점검 결과를 입력하고 제출합니다.
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            ✅ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            ❌ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              기본 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연구실 <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.laboratoryId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, laboratoryId: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">연구실 선택</option>
                  {LAB_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  점검일자 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.inspectionDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, inspectionDate: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  점검방법
                </label>
                <select
                  value={form.inspectionMethod}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, inspectionMethod: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="육안점검">육안점검</option>
                  <option value="기기점검">기기점검</option>
                  <option value="서류점검">서류점검</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  점검자 ID
                </label>
                <input
                  type="text"
                  value={form.writerId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, writerId: e.target.value }))
                  }
                  placeholder="사용자 ID 입력"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 체크리스트 요약 */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "적합",
                value: pass,
                color: "bg-green-50 border-green-200 text-green-700",
              },
              {
                label: "부적합",
                value: fail,
                color: "bg-red-50 border-red-200 text-red-700",
              },
              {
                label: "해당없음",
                value: na,
                color: "bg-gray-50 border-gray-200 text-gray-600",
              },
              {
                label: "미입력",
                value: unanswered,
                color: "bg-amber-50 border-amber-200 text-amber-700",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className={`rounded-lg border p-3 text-center ${color}`}
              >
                <p className="text-xs mb-1">{label}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          {/* 체크리스트 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-800">
                점검 체크리스트 <span className="text-red-500">*</span>
              </h2>
            </div>
            {categories.map((category) => (
              <div key={category}>
                <div className="px-5 py-2 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    {category}
                  </span>
                </div>
                {checklist
                  .filter((c) => c.category === category)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="px-5 py-3 border-b border-gray-50 flex items-center justify-between gap-4"
                    >
                      <span className="text-sm text-gray-700 flex-1">
                        {item.item}
                      </span>
                      <div className="flex gap-2">
                        {RESULT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              handleChecklistChange(
                                item.id,
                                opt.value as "PASS" | "FAIL" | "NA",
                              )
                            }
                            className={`px-3 py-1 text-xs rounded-full border transition-all ${
                              item.result === opt.value
                                ? opt.color + " font-semibold"
                                : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* 부적합 사유 & 특이사항 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                부적합 사유{" "}
                {fail > 0 && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={form.nonconformReason}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nonconformReason: e.target.value }))
                }
                rows={2}
                placeholder={
                  fail > 0
                    ? "부적합 항목의 사유를 입력해 주세요."
                    : "부적합 항목이 없으면 생략 가능합니다."
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                특이사항
              </label>
              <textarea
                value={form.specialNote}
                onChange={(e) =>
                  setForm((p) => ({ ...p, specialNote: e.target.value }))
                }
                rows={2}
                placeholder="기타 특이사항을 입력해 주세요."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "제출 중..." : "점검 결과 제출"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
