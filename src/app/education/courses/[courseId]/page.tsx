"use client";

// 교육과정 상세 조회 페이지

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { EducationCourseDTO, EducationCourseStatus } from "@/types/education";

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

export default function EducationCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<EducationCourseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;
    fetch(`/api/education-courses/${courseId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setCourse(data.data);
        } else {
          setError(data.error ?? "교육과정을 찾을 수 없습니다.");
        }
      })
      .catch(() => setError("네트워크 오류가 발생했습니다."))
      .finally(() => setIsLoading(false));
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (error || !course) {
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
  }

  const detailRows = [
    { label: "교육과정 ID", value: course.courseId ?? "-" },
    { label: "교육과정명", value: course.courseName },
    { label: "교육유형", value: course.courseType },
    { label: "교육대상", value: course.targetRole },
    { label: "이수기준", value: course.completionStandard ?? "-" },
    { label: "교육기간", value: course.educationPeriod ?? "-" },
    { label: "교육 콘텐츠 또는 자료 정보", value: course.contentInfo ?? "-" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/education/courses"
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← 교육과정 목록
          </Link>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">
              안전교육관리
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              교육과정 상세
            </h1>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[course.status ?? "ACTIVE"]}`}
          >
            {STATUS_LABELS[course.status ?? "ACTIVE"]}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">
              교육과정 정보
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {detailRows.map(({ label, value }) => (
              <div
                key={label}
                className="px-5 py-3 flex flex-col gap-1 sm:flex-row sm:justify-between"
              >
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-900 sm:text-right">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => router.back()}
            className="flex-1 py-2.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-white"
          >
            이전
          </button>
          <Link
            href="/education/courses/register"
            className="flex-1 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium text-center"
          >
            새 교육과정 등록
          </Link>
        </div>
      </div>
    </div>
  );
}
