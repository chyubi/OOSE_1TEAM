"use client";

// UC-U05: 사용자 상세 조회
// UC-U03: 사용자 정보 수정 / 삭제

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { UserDTO, UserRole, UserStatus } from "@/types/user";

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "관리자",
  LAB_MANAGER: "연구실책임자",
  SAFETY_MANAGER: "안전관리담당자",
  RESEARCHER: "연구활동종사자",
};

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "RESEARCHER", label: "연구활동종사자" },
  { value: "SAFETY_MANAGER", label: "안전관리담당자" },
  { value: "LAB_MANAGER", label: "연구실책임자" },
  { value: "ADMIN", label: "관리자" },
];

const STATUS_COLORS: Record<UserStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<UserStatus, string> = {
  PENDING: "대기중",
  APPROVED: "승인",
  REJECTED: "반려",
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserDTO>>({});
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
          setEditForm(data.data);
        } else setError(data.error ?? "사용자를 찾을 수 없습니다.");
      })
      .catch(() => setError("네트워크 오류가 발생했습니다."))
      .finally(() => setIsLoading(false));
  }, [userId]);

  // UC-U03: 수정 저장
  const handleUpdate = async () => {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    if (data.success) {
      setUser((prev) => (prev ? { ...prev, ...editForm } : prev));
      setIsEditing(false);
      setMsg("수정되었습니다.");
    } else {
      setMsg(data.error ?? "수정 실패");
    }
  };

  // UC-U03: 삭제
  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) router.push("/users");
    else setMsg(data.error ?? "삭제 실패");
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    );

  if (error || !user)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
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
            사용자관리 / UC-U05 · UC-U03
          </p>
          <h1 className="text-2xl font-bold text-gray-900">사용자 상세 정보</h1>
        </div>

        {msg && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            {msg}
            <button onClick={() => setMsg("")} className="ml-2 text-blue-400">
              ✕
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 프로필 헤더 */}
          <div className="px-6 py-5 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 bg-blue-100 px-2 py-0.5 rounded-full">
                    {ROLE_LABELS[user.role]}
                  </span>
                  {user.status && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[user.status]}`}
                    >
                      {STATUS_LABELS[user.status]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="divide-y divide-gray-100">
            {/* 이름 */}
            <div className="px-6 py-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">이름</span>
              {isEditing ? (
                <input
                  value={editForm.name ?? ""}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-sm font-medium text-gray-900">
                  {user.name}
                </span>
              )}
            </div>

            {/* 학부 */}
            <div className="px-6 py-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">소속 학부</span>
              {isEditing ? (
                <input
                  value={editForm.department ?? ""}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, department: e.target.value }))
                  }
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-sm font-medium text-gray-900">
                  {user.department}
                </span>
              )}
            </div>

            {/* 역할 */}
            <div className="px-6 py-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">역할</span>
              {isEditing ? (
                <select
                  value={editForm.role ?? user.role}
                  onChange={(e) =>
                    setEditForm((p) => ({
                      ...p,
                      role: e.target.value as UserRole,
                    }))
                  }
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-sm font-medium text-gray-900">
                  {ROLE_LABELS[user.role]}
                </span>
              )}
            </div>

            {/* 이메일 */}
            <div className="px-6 py-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">이메일</span>
              <span className="text-sm font-medium text-gray-900">
                {user.email}
              </span>
            </div>

            {/* 전화번호 */}
            <div className="px-6 py-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">전화번호</span>
              {isEditing ? (
                <input
                  value={editForm.phone ?? ""}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-sm font-medium text-gray-900">
                  {user.phone ?? "-"}
                </span>
              )}
            </div>

            {/* 사용자 ID */}
            <div className="px-6 py-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">사용자 ID</span>
              <span className="text-sm font-mono text-gray-500">
                {user.userId}
              </span>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-100"
                >
                  취소
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  저장
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.back()}
                  className="flex-1 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-100"
                >
                  목록으로
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  수정 (UC-U03)
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
