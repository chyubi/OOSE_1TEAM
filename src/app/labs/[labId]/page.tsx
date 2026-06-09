"use client";

// 연구실 상세 조회 페이지
// LabQueryView::showDetail() 에 대응하는 상세 화면

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LabDetail } from "@/types/lab";

export default function LabDetailPage() {
  const router = useRouter();
  const params = useParams();
  const labId = params.labId as string;

  const [lab, setLab] = useState<LabDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/labs/${labId}`);
        const data = await res.json();
        if (data.success) {
          setLab(data.data);
        } else {
          setErrorMsg("연구실 정보를 불러올 수 없습니다.");
        }
      } catch {
        setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [labId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/labs/delete/${labId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        router.push("/labs");
      } else {
        setErrorMsg(data.errors?.join(", ") ?? "삭제 중 오류가 발생했습니다.");
        setShowDeleteModal(false);
      }
    } catch {
      setErrorMsg("서버와 통신 중 오류가 발생했습니다.");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const mgmtLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      "1등급": "bg-red-100 text-red-700 border-red-200",
      "2등급": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "3등급": "bg-green-100 text-green-700 border-green-200",
    };
    return colors[level] ?? "bg-gray-100 text-gray-600 border-gray-200";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">불러오는 중...</div>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-4">{errorMsg || "연구실을 찾을 수 없습니다."}</p>
          <button
            onClick={() => router.push("/labs")}
            className="px-4 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-blue-800 text-white px-6 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/labs")}
              className="text-blue-200 hover:text-white text-sm"
            >
              ← 목록
            </button>
            <div>
              <h1 className="text-lg font-bold">{lab.labName}</h1>
              <p className="text-blue-200 text-xs mt-0.5">{lab.labId} · 연구실 상세</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/labs/register?edit=${lab.labId}`)}
              className="px-4 py-2 text-sm border border-blue-400 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              수정
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* 기본 정보 */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              기본 정보
            </h2>
          </div>

          <div className="p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <DetailRow label="연구실 ID">
                <span className="font-mono text-sm">{lab.labId}</span>
              </DetailRow>
              <DetailRow label="연구실명">
                <span className="font-medium">{lab.labName}</span>
              </DetailRow>
              <DetailRow label="위치">{lab.location}</DetailRow>
              <DetailRow label="연구실 유형">{lab.labType}</DetailRow>
              <DetailRow label="관리 등급">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${mgmtLevelBadge(
                    lab.mgmtLevel
                  )}`}
                >
                  {lab.mgmtLevel}
                </span>
              </DetailRow>
              <DetailRow label="기관 ID">
                <span className="font-mono text-sm">{lab.orgId}</span>
              </DetailRow>
              <DetailRow label="연락처">
                {lab.contact ?? <span className="text-gray-400">-</span>}
              </DetailRow>
              <DetailRow label="등록일시">
                <span className="text-sm text-gray-600">
                  {new Date(lab.createdAt).toLocaleString("ko-KR")}
                </span>
              </DetailRow>
            </dl>
          </div>

          {/* 부가 정보 */}
          <div className="px-6 py-4 bg-gray-50 border-t border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              부가 정보
            </h2>
          </div>

          <div className="p-6">
            <dl className="space-y-4">
              <DetailRow label="안전표지">
                {lab.safetySign ? (
                  <span className="text-sm text-gray-600 break-all">{lab.safetySign}</span>
                ) : (
                  <span className="text-gray-400 text-sm">미등록</span>
                )}
              </DetailRow>
              <DetailRow label="배치도">
                {lab.layoutImage ? (
                  <span className="text-sm text-gray-600 break-all">{lab.layoutImage}</span>
                ) : (
                  <span className="text-gray-400 text-sm">미등록</span>
                )}
              </DetailRow>
              <DetailRow label="사진">
                {lab.photo ? (
                  <span className="text-sm text-gray-600 break-all">{lab.photo}</span>
                ) : (
                  <span className="text-gray-400 text-sm">미등록</span>
                )}
              </DetailRow>
            </dl>
          </div>
        </div>
      </main>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-lg">!</span>
              </div>
              <h3 className="font-semibold text-gray-900">연구실 삭제</h3>
            </div>
            <p className="text-sm text-gray-700 mb-1">
              <strong>"{lab.labName}"</strong>을(를) 삭제하시겠습니까?
            </p>
            <p className="text-xs text-gray-500 mb-5">
              삭제된 데이터는 복구할 수 없습니다.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
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

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="text-gray-900">{children}</dd>
    </div>
  );
}
