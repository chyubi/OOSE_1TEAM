"use client";

// UC-I03: 점검 이력 조회 페이지
// SDD CLS-I-02: InspectionHistoryBoundary
// 연구실책임자·관리자가 점검 이력을 조건 검색하는 화면

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  InspectionDTO,
  InspectionStatus,
  InspectionSearchCondition,
} from "@/types/inspection";

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

const LAB_OPTIONS = [
  "기계공학연구실-101",
  "전기공학연구실-201",
  "화학공학연구실-301",
  "환경공학연구실-401",
  "해양시스템연구실-501",
];

export default function InspectionHistoryPage() {
  const [list, setList] = useState<InspectionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [condition, setCondition] = useState<InspectionSearchCondition>({
    laboratoryId: "",
    searchFromDate: "",
    searchToDate: "",
    inspectionStatus: "",
  });

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (condition.laboratoryId)
        params.set("laboratoryId", condition.laboratoryId);
      if (condition.searchFromDate)
        params.set("searchFromDate", condition.searchFromDate);
      if (condition.searchToDate)
        params.set("searchToDate", condition.searchToDate);
      if (condition.inspectionStatus)
        params.set("inspectionStatus", condition.inspectionStatus);

      const res = await fetch(`/api/inspections?${params.toString()}`);
      const data = await res.json();
      if (data.success) setList(data.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchList();
  };

  const handleReset = () => {
    setCondition({
      laboratoryId: "",
      searchFromDate: "",
      searchToDate: "",
      inspectionStatus: "",
    });
  };

  // 체크리스트 요약 파싱
  const parseChecklistSummary = (checklistResult: string) => {
    try {
      const items = JSON.parse(checklistResult);
      const pass = items.filter(
        (i: { result: string }) => i.result === "PASS",
      ).length;
      const fail = items.filter(
        (i: { result: string }) => i.result === "FAIL",
      ).length;
      return `적합 ${pass} / 부적합 ${fail}`;
    } catch {
      return checklistResult.slice(0, 20);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">
              점검관리 / UC-I03
            </p>
            <h1 className="text-2xl font-bold text-gray-900">점검 이력 조회</h1>
          </div>
          <Link
            href="/inspections/perform"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            + 점검 수행
          </Link>
        </div>

        {/* 검색 조건 */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl border border-gray-200 p-5 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                연구실
              </label>
              <select
                value={condition.laboratoryId ?? ""}
                onChange={(e) =>
                  setCondition((p) => ({ ...p, laboratoryId: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                {LAB_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                점검일 시작
              </label>
              <input
                type="date"
                value={condition.searchFromDate ?? ""}
                onChange={(e) =>
                  setCondition((p) => ({
                    ...p,
                    searchFromDate: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                점검일 종료
              </label>
              <input
                type="date"
                value={condition.searchToDate ?? ""}
                onChange={(e) =>
                  setCondition((p) => ({ ...p, searchToDate: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                상태
              </label>
              <select
                value={condition.inspectionStatus ?? ""}
                onChange={(e) =>
                  setCondition((p) => ({
                    ...p,
                    inspectionStatus: e.target.value as InspectionStatus | "",
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              🔍 조회
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
            >
              초기화
            </button>
          </div>
        </form>

        {/* 결과 테이블 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">
              총 <span className="text-blue-600">{list.length}</span>건
            </span>
          </div>
          {isLoading ? (
            <div className="py-16 text-center text-sm text-gray-400">
              조회 중...
            </div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              조회된 점검 이력이 없습니다.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "점검번호",
                    "연구실",
                    "점검일자",
                    "점검방법",
                    "결과요약",
                    "상태",
                    "상세",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((item) => (
                  <tr key={item.inspectionId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      #{item.inspectionId}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {item.laboratoryId}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.inspectionDate}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.inspectionMethod}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {parseChecklistSummary(item.checklistResult)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.inspectionStatus ?? "SUBMITTED"]}`}
                      >
                        {STATUS_LABELS[item.inspectionStatus ?? "SUBMITTED"]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/inspections/${item.inspectionId}`}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
