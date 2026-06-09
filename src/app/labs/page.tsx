"use client";

// CLS-L-02: LabQueryView (Boundary)
// UC-L02 연구실 기본정보 조회
// 연구실 목록/상세 조회 화면을 표시하고 검색 조건을 수집해 제어 계층으로 전달하며,
// 조회 결과를 표시한다.

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LabSummary } from "@/types/lab";

interface SearchCond {
  labName: string;
  labType: string;
  mgmtLevel: string;
  location: string;
}

const INITIAL_COND: SearchCond = {
  labName: "",
  labType: "",
  mgmtLevel: "",
  location: "",
};

const LAB_TYPES = [
  "일반연구실",
  "화학연구실",
  "생물연구실",
  "물리연구실",
  "전기·전자연구실",
  "기계연구실",
  "복합연구실",
];

const MGMT_LEVELS = ["1등급", "2등급", "3등급"];

export default function LabQueryView() {
  // CLS-L-02 속성
  const [searchCond, setSearchCond] = useState<SearchCond>(INITIAL_COND);
  const [labList, setLabList] = useState<LabSummary[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<LabSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  // displaySearch(): 검색/필터 조건을 표시한다.
  const displaySearch = () => {
    setSearchCond(INITIAL_COND);
    setLabList([]);
    setHasSearched(false);
    setErrorMsg("");
  };

  // search(): 검색 조건을 제어 계층으로 전달한다.
  const search = useCallback(async (cond: SearchCond) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const params = new URLSearchParams();
      if (cond.labName) params.set("labName", cond.labName);
      if (cond.labType) params.set("labType", cond.labType);
      if (cond.mgmtLevel) params.set("mgmtLevel", cond.mgmtLevel);
      if (cond.location) params.set("location", cond.location);

      const res = await fetch(`/api/labs?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        showList(data.data ?? []);
      } else {
        setErrorMsg("조회 중 오류가 발생했습니다.");
      }
    } catch {
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  }, []);

  // showList(): 연구실 목록을 표시한다.
  const showList = (list: LabSummary[]) => {
    setLabList(list);
  };

  // showDetail(): 선택 연구실 상세정보를 표시한다.
  const showDetail = (labId: string) => {
    router.push(`/labs/${labId}`);
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchCond((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(searchCond);
  };

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/labs/delete/${deleteTarget.labId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setLabList((prev) => prev.filter((l) => l.labId !== deleteTarget.labId));
        setDeleteTarget(null);
      } else {
        setErrorMsg(data.errors?.join(", ") ?? "삭제 중 오류가 발생했습니다.");
        setDeleteTarget(null);
      }
    } catch {
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const mgmtLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      "1등급": "bg-red-100 text-red-700",
      "2등급": "bg-yellow-100 text-yellow-700",
      "3등급": "bg-green-100 text-green-700",
    };
    return colors[level] ?? "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-blue-800 text-white px-6 py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">연구실 기본정보 조회</h1>
            <p className="text-blue-200 text-xs mt-0.5">UC-L02 · 연구실관리</p>
          </div>
          <button
            onClick={() => router.push("/labs/register")}
            className="px-4 py-2 text-sm bg-white text-blue-800 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            + 연구실 등록
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* 검색 조건 */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            검색 조건
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                연구실명
              </label>
              <input
                type="text"
                name="labName"
                value={searchCond.labName}
                onChange={handleSearchChange}
                placeholder="연구실명 검색"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                위치
              </label>
              <input
                type="text"
                name="location"
                value={searchCond.location}
                onChange={handleSearchChange}
                placeholder="위치 검색"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                연구실 유형
              </label>
              <select
                name="labType"
                value={searchCond.labType}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">전체</option>
                {LAB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                관리 등급
              </label>
              <select
                name="mgmtLevel"
                value={searchCond.mgmtLevel}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">전체</option>
                {MGMT_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={displaySearch}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              초기화
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-sm text-white bg-blue-700 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors font-medium"
            >
              {isLoading ? "조회 중..." : "조회"}
            </button>
          </div>
        </form>

        {/* 오류 메시지 */}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        {/* 결과 테이블 */}
        {hasSearched && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">
                조회 결과{" "}
                <span className="text-blue-600 font-bold">{labList.length}</span>건
              </h2>
            </div>

            {labList.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                조회된 연구실이 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        연구실 ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        연구실명
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        위치
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        유형
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        관리등급
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {labList.map((lab) => (
                      <tr key={lab.labId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                          {lab.labId}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => showDetail(lab.labId)}
                            className="text-blue-700 hover:underline font-medium"
                          >
                            {lab.labName}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{lab.location}</td>
                        <td className="px-4 py-3 text-gray-600">{lab.labType}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${mgmtLevelBadge(
                              lab.mgmtLevel
                            )}`}
                          >
                            {lab.mgmtLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => showDetail(lab.labId)}
                              className="px-3 py-1 text-xs text-blue-700 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                            >
                              상세
                            </button>
                            <button
                              onClick={() => setDeleteTarget(lab)}
                              className="px-3 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-lg">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">연구실 삭제</h3>
                <p className="text-xs text-gray-500">{deleteTarget.labId}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-1">
              <strong>"{deleteTarget.labName}"</strong>을(를) 삭제하시겠습니까?
            </p>
            <p className="text-xs text-gray-500 mb-5">
              삭제된 데이터는 복구할 수 없습니다.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
