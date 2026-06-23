"use client";

// UC-U04: 사용자 목록 조회 페이지 (관리자)
// SDD CLS-U-02: UserSearchBoundary
// 관리자가 조건을 입력하고 사용자 목록을 조회하는 화면

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserDTO, UserRole, SearchCondition } from "@/types/user";

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

export default function UserListPage() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [condition, setCondition] = useState<SearchCondition>({
    keyword: "",
    role: "",
    department: "",
  });

  // SDD UserSearchBoundary: inputSearchCondition() → requestHistorySearch()
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (condition.keyword) params.set("keyword", condition.keyword);
      if (condition.role) params.set("role", condition.role);
      if (condition.department) params.set("department", condition.department);

      const res = await fetch(`/api/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleReset = () => {
    setCondition({ keyword: "", role: "", department: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">
              사용자관리 / UC-U04
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              사용자 목록 조회
            </h1>
          </div>
          <Link
            href="/users/register"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 등록 신청
          </Link>
        </div>

        {/* 검색 조건 */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl border border-gray-200 p-5 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                검색어 (이름/이메일)
              </label>
              <input
                type="text"
                value={condition.keyword ?? ""}
                onChange={(e) =>
                  setCondition((p) => ({ ...p, keyword: e.target.value }))
                }
                placeholder="이름 또는 이메일"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                역할
              </label>
              <select
                value={condition.role ?? ""}
                onChange={(e) =>
                  setCondition((p) => ({
                    ...p,
                    role: e.target.value as UserRole | "",
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                {Object.entries(ROLE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                소속 학부
              </label>
              <input
                type="text"
                value={condition.department ?? ""}
                onChange={(e) =>
                  setCondition((p) => ({ ...p, department: e.target.value }))
                }
                placeholder="학부명 입력"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔍 조회
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              초기화
            </button>
          </div>
        </form>

        {/* 결과 테이블 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              총 <span className="text-blue-600">{users.length}</span>명
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-sm text-gray-400">
              조회 중...
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              조회된 사용자가 없습니다.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "사용자 ID",
                    "이름",
                    "소속 학부",
                    "역할",
                    "이메일",
                    "상세",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {user.userId}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {user.department}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE_COLORS[user.role]}`}
                      >
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/users/${user.userId}`}
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
