"use client";

// 교육과정 조회 페이지

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  EducationCourseDTO,
  EducationCourseSearchCondition,
  EducationCourseStatus,
} from "@/types/education";

const COURSE_TYPE_OPTIONS = ["정기교육", "신규교육", "특별교육", "보수교육"];
const TARGET_ROLE_OPTIONS = [
  "관리자",
  "연구실책임자",
  "연구활동종사자",
  "안전관리담당자",
];

const STATUS_LABELS: Record<EducationCourseStatus, string> = {
  ACTIVE: "운영중",
  INACTIVE: "비활성",
  CLOSED: "종료",
};

const STATUS_COLORS: Record<EducationCourseStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-600",
  CLOSED: "bg-red-100 text-red-700",
};

export default function EducationCourseListPage() {
  const [list, setList] = useState<EducationCourseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [condition, setCondition] = useState<EducationCourseSearchCondition>({
    courseType: "",
    targetRole: "",
    status: "",
    searchKeyword: "",
  });

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (condition.courseType) params.set("courseType", condition.courseType);
      if (condition.targetRole) params.set("targetRole", condition.targetRole);
      if (condition.status) params.set("status", condition.status);
      if (condition.searchKeyword) {
        params.set("searchKeyword", condition.searchKeyword);
      }

      const res = await fetch(`/api/education-courses?${params.toString()}`);
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
      courseType: "",
      targetRole: "",
      status: "",
      searchKeyword: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">
              안전교육관리
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              교육과정 조회
            </h1>
          </div>
          <Link
            href="/education/courses/register"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            + 교육과정 등록
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl border border-gray-200 p-5 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                교육유형
              </label>
              <select
                value={condition.courseType ?? ""}
                onChange={(e) =>
                  setCondition((p) => ({ ...p, courseType: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                {COURSE_TYPE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                교육대상
              </label>
              <select
                value={condition.targetRole ?? ""}
                onChange={(e) =>
                  setCondition((p) => ({ ...p, targetRole: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                {TARGET_ROLE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                운영상태
              </label>
              <select
                value={condition.status ?? ""}
                onChange={(e) =>
                  setCondition((p) => ({
                    ...p,
                    status: e.target.value as EducationCourseStatus | "",
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                검색어
              </label>
              <input
                type="text"
                value={condition.searchKeyword ?? ""}
                onChange={(e) =>
                  setCondition((p) => ({
                    ...p,
                    searchKeyword: e.target.value,
                  }))
                }
                placeholder="교육과정명"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              조회
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
              조회된 교육과정이 없습니다.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "교육과정 ID",
                    "교육과정명",
                    "교육유형",
                    "교육대상",
                    "교육기간",
                    "운영상태",
                    "상세",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((item) => (
                  <tr key={item.courseId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {item.courseId}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {item.courseName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.courseType}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.targetRole}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.educationPeriod ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status ?? "ACTIVE"]}`}
                      >
                        {STATUS_LABELS[item.status ?? "ACTIVE"]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/education/courses/${item.courseId}`}
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
