"use client";

// 교육과정 등록 페이지

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EducationCourseDTO, EducationCourseStatus } from "@/types/education";

const COURSE_TYPE_OPTIONS = ["정기교육", "신규교육", "특별교육", "보수교육"];
const TARGET_ROLE_OPTIONS = [
  "관리자",
  "연구실책임자",
  "연구활동종사자",
  "안전관리담당자",
];
const STATUS_OPTIONS: { value: EducationCourseStatus; label: string }[] = [
  { value: "ACTIVE", label: "운영중" },
  { value: "INACTIVE", label: "비활성" },
  { value: "CLOSED", label: "종료" },
];

export default function EducationCourseRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [form, setForm] = useState<EducationCourseDTO>({
    courseName: "",
    courseType: "정기교육",
    targetRole: "연구활동종사자",
    completionStandard: "",
    educationPeriod: "",
    contentInfo: "",
    status: "ACTIVE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!startDate || !endDate) {
      setErrorMsg("교육기간을 입력해 주세요.");
      return;
    }
    if (startDate > endDate) {
      setErrorMsg("교육 시작일은 종료일보다 늦을 수 없습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/education-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          educationPeriod: `${startDate} ~ ${endDate}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setForm({
          courseName: "",
          courseType: "정기교육",
          targetRole: "연구활동종사자",
          completionStandard: "",
          educationPeriod: "",
          contentInfo: "",
          status: "ACTIVE",
        });
        setStartDate("");
        setEndDate("");
      } else {
        setErrorMsg(data.error ?? "등록 중 오류가 발생했습니다.");
      }
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">
              안전교육관리
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              교육과정 등록
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              안전교육 과정과 이수기준을 등록합니다.
            </p>
          </div>
          <Link
            href="/education/courses"
            className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-white"
          >
            목록
          </Link>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              과정 기본 정보
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  교육과정명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.courseName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, courseName: e.target.value }))
                  }
                  required
                  placeholder="예: 2026년 상반기 연구실 정기 안전교육"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    교육유형 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.courseType}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, courseType: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {COURSE_TYPE_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    교육대상 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.targetRole}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, targetRole: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TARGET_ROLE_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    운영상태
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        status: e.target.value as EducationCourseStatus,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUS_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이수기준 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.completionStandard}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      completionStandard: e.target.value,
                    }))
                  }
                  required
                  placeholder="예: 2시간 이상 수강 및 평가 70점 이상"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    교육 시작일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    교육 종료일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  교육 콘텐츠 또는 자료 정보
                </label>
                <textarea
                  value={form.contentInfo}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contentInfo: e.target.value }))
                  }
                  rows={3}
                  placeholder="자료 URL, 파일 경로, 콘텐츠 설명 등을 입력해 주세요."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-white"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "등록 중..." : "교육과정 등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
