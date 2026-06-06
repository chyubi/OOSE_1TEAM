"use client";

// UC-I04: 점검 상세 조회 페이지

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { InspectionDTO, InspectionStatus } from "@/types/inspection";

const STATUS_LABELS: Record<InspectionStatus, string> = {
  DRAFT: "임시저장",
  SUBMITTED: "제출완료",
  CONFIRMED: "확인완료",
};

const STATUS_COLORS: Record<InspectionStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  SUBMITTED: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-green-100 text-green-800",
};

const RESULT_COLORS: Record<string, string> = {
  PASS: "bg-green-100 text-green-800",
  FAIL: "bg-red-100 text-red-800",
  NA: "bg-gray-100 text-gray-500",
};

const RESULT_LABELS: Record<string, string> = {
  PASS: "적합",
  FAIL: "부적합",
  NA: "해당없음",
};

export default function InspectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const inspectionId = params.inspectionId as string;

  const [inspection, setInspection] = useState<InspectionDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState<
    { id: string; item: string; result: string }[]
  >([]);

  useEffect(() => {
    if (!inspectionId) return;
    fetch(`/api/inspections/${inspectionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setInspection(data.data);
          try {
            setChecklist(JSON.parse(data.data.checklistResult));
          } catch {
            setChecklist([]);
          }
        } else {
          setError(data.error ?? "점검 결과를 찾을 수 없습니다.");
        }
      })
      .catch(() => setError("네트워크 오류가 발생했습니다."))
      .finally(() => setIsLoading(false));
  }, [inspectionId]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    );

  if (error || !inspection)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-600 text-sm underline"
          >
            돌아가기
          </button>
        </div>
      </div>
    );

  const passCount = checklist.filter((c) => c.result === "PASS").length;
  const failCount = checklist.filter((c) => c.result === "FAIL").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/inspections/history"
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← 이력 목록
          </Link>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">
              점검관리 / UC-I04
            </p>
            <h1 className="text-2xl font-bold text-gray-900">점검 결과 상세</h1>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[inspection.inspectionStatus ?? "SUBMITTED"]}`}
          >
            {STATUS_LABELS[inspection.inspectionStatus ?? "SUBMITTED"]}
          </span>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">기본 정보</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { label: "점검번호", value: `#${inspection.inspectionId}` },
              { label: "연구실", value: inspection.laboratoryId },
              { label: "점검일자", value: inspection.inspectionDate },
              { label: "점검방법", value: inspection.inspectionMethod },
              { label: "점검자 ID", value: inspection.writerId ?? "-" },
            ].map(({ label, value }) => (
              <div key={label} className="px-5 py-3 flex justify-between">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-900">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 체크리스트 결과 요약 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-xs text-green-600 mb-1">적합</p>
            <p className="text-2xl font-bold text-green-700">{passCount}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-xs text-red-600 mb-1">부적합</p>
            <p className="text-2xl font-bold text-red-700">{failCount}</p>
          </div>
        </div>

        {/* 체크리스트 상세 */}
        {checklist.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">
                체크리스트 결과
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <span className="text-sm text-gray-700">{item.item}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${RESULT_COLORS[item.result] ?? "bg-gray-100 text-gray-500"}`}
                  >
                    {RESULT_LABELS[item.result] ?? item.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 부적합 사유 & 특이사항 */}
        {(inspection.nonconformReason || inspection.specialNote) && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">비고</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {inspection.nonconformReason && (
                <div className="px-5 py-3">
                  <p className="text-xs text-gray-500 mb-1">부적합 사유</p>
                  <p className="text-sm text-gray-800">
                    {inspection.nonconformReason}
                  </p>
                </div>
              )}
              {inspection.specialNote && (
                <div className="px-5 py-3">
                  <p className="text-xs text-gray-500 mb-1">특이사항</p>
                  <p className="text-sm text-gray-800">
                    {inspection.specialNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="w-full py-2.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
        >
          목록으로
        </button>
      </div>
    </div>
  );
}
