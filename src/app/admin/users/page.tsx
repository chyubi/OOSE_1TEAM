"use client";

// UC-U02: 관리자 등록 신청 처리 페이지
// 관리자가 PENDING 상태 사용자를 승인 또는 반려하는 화면

import { useState, useEffect } from "react";
import { UserDTO, UserStatus } from "@/types/user";

const STATUS_LABELS: Record<UserStatus, string> = {
  PENDING: "대기중",
  APPROVED: "승인",
  REJECTED: "반려",
};

const STATUS_COLORS: Record<UserStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<UserStatus | "">("PENDING");
  const [rejectModal, setRejectModal] = useState<{
    userId: string;
    name: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      const res = await fetch(`/api/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterStatus]);

  // 승인 처리
  const handleApprove = async (userId: string, name: string) => {
    if (!confirm(`${name} 님의 등록 신청을 승인하시겠습니까?`)) return;
    const res = await fetch(`/api/users/${userId}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "APPROVE" }),
    });
    const data = await res.json();
    setActionMsg(data.message ?? data.error);
    fetchUsers();
  };

  // 반려 처리
  const handleReject = async () => {
    if (!rejectModal) return;
    if (!rejectReason.trim()) {
      alert("반려 사유를 입력해 주세요.");
      return;
    }
    const res = await fetch(`/api/users/${rejectModal.userId}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "REJECT", rejectReason }),
    });
    const data = await res.json();
    setActionMsg(data.message ?? data.error);
    setRejectModal(null);
    setRejectReason("");
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <p className="text-sm text-blue-600 font-medium mb-1">
            관리자 / UC-U02
          </p>
          <h1 className="text-2xl font-bold text-gray-900">등록 신청 처리</h1>
          <p className="text-sm text-gray-500 mt-1">
            사용자 등록 신청을 승인 또는 반려합니다.
          </p>
        </div>

        {/* 액션 메시지 */}
        {actionMsg && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            {actionMsg}
            <button
              onClick={() => setActionMsg("")}
              className="ml-2 text-blue-400 hover:text-blue-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* 상태 필터 */}
        <div className="flex gap-2 mb-6">
          {(["", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                filterStatus === s
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {s === "" ? "전체" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* 목록 테이블 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">
              총 <span className="text-blue-600">{users.length}</span>명
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-sm text-gray-400">
              불러오는 중...
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              해당 신청이 없습니다.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["이름", "학부", "역할", "이메일", "상태", "처리"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {user.department}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.role}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[user.status ?? "PENDING"]}`}
                      >
                        {STATUS_LABELS[user.status ?? "PENDING"]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleApprove(user.userId, user.name)
                            }
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                          >
                            승인
                          </button>
                          <button
                            onClick={() =>
                              setRejectModal({
                                userId: user.userId,
                                name: user.name,
                              })
                            }
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
                          >
                            반려
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 반려 사유 모달 */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              반려 사유 입력
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {rejectModal.name} 님의 신청을 반려합니다.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="반려 사유를 입력해 주세요."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason("");
                }}
                className="flex-1 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
              >
                반려 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
