"use client";

// UC-U05: 사용자 상세 조회 페이지
// 특정 userId의 사용자 정보 상세 화면

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { UserDTO, UserRole } from "@/types/user";

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "관리자",
  LAB_MANAGER: "연구실책임자",
  SAFETY_MANAGER: "안전관리담당자",
  RESEARCHER: "연구활동종사자",
};

const ROLE_BADGE_COLORS: Record<UserRole, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  LAB_MANAGER: "bg-blue-100 text-blue-800",
  SAFETY_MANAGER: "bg-amber-100 text-amber-800",
  RESEARCHER: "bg-green-100 text-green-800",
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setUser(data.data);
        else setError(data.error ?? "사용자를 찾을 수 없습니다.");
      })
      .catch(() => setError("네트워크 오류가 발생했습니다."))
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (error || !user) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/users"
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← 목록으로
          </Link>
        </div>

        <div className="mb-6">
          <p className="text-sm text-blue-600 font-medium mb-1">
            사용자관리 / UC-U05
          </p>
          <h1 className="text-2xl font-bold text-gray-900">사용자 상세 정보</h1>
        </div>

        {/* 사용자 정보 카드 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 프로필 헤더 */}
          <div className="px-6 py-5 bg-blue-50 border-b border-blue-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <span
                className={`inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE_COLORS[user.role]}`}
              >
                {ROLE_LABELS[user.role]}
              </span>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="divide-y divide-gray-100">
            {[
              { label: "사용자 ID", value: user.userId, mono: true },
              { label: "소속 학부/부서", value: user.department },
              { label: "이메일", value: user.email },
              { label: "전화번호", value: user.phone ?? "-" },
            ].map(({ label, value, mono }) => (
              <div
                key={label}
                className="px-6 py-4 flex justify-between items-center"
              >
                <span className="text-sm text-gray-500">{label}</span>
                <span
                  className={`text-sm font-medium text-gray-900 ${mono ? "font-mono" : ""}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* 액션 버튼 */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-100 transition-colors"
            >
              목록으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
