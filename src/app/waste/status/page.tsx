"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  WasteRequestDTO,
  WasteRequestStatus,
  WasteSearchCondition,
} from "@/types/waste";

const STATUS_LABELS: Record<WasteRequestStatus, string> = {
  REQUESTED: "신청됨",
  RECEIVED: "접수됨",
  PROCESSING: "처리중",
  COMPLETED: "처리완료",
};

const STATUS_COLORS: Record<WasteRequestStatus, string> = {
  REQUESTED: "bg-blue-100 text-blue-800",
  RECEIVED: "bg-slate-100 text-slate-700",
  PROCESSING: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-green-100 text-green-800",
};

const WASTE_TYPES = [
  "폐유기용제",
  "폐산",
  "폐알칼리",
  "폐시약",
  "고상폐기물",
  "기타",
];

export default function WasteStatusPage() {
  const [requests, setRequests] = useState<WasteRequestDTO[]>([]);
  const [condition, setCondition] = useState<WasteSearchCondition>({
    laboratoryId: "",
    wasteType: "",
    requestStatus: "",
    searchFromDate: "",
    searchToDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (condition.laboratoryId)
        params.set("laboratoryId", condition.laboratoryId);
      if (condition.wasteType) params.set("wasteType", condition.wasteType);
      if (condition.requestStatus)
        params.set("requestStatus", condition.requestStatus);
      if (condition.searchFromDate)
        params.set("searchFromDate", condition.searchFromDate);
      if (condition.searchToDate)
        params.set("searchToDate", condition.searchToDate);

      const response = await fetch(`/api/waste-requests?${params.toString()}`);
      const result = await response.json();

      if (!result.success) {
        setError(result.error ?? "조회 중 오류가 발생했습니다.");
        return;
      }

      setRequests(result.data ?? []);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    fetchRequests();
  };

  const handleReset = () => {
    setCondition({
      laboratoryId: "",
      wasteType: "",
      requestStatus: "",
      searchFromDate: "",
      searchToDate: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-blue-600">
              폐기물관리 / UC-W05
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              폐기물 처리현황 조회
            </h1>
          </div>
          <Link
            href="/waste/request"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            배출 신청
          </Link>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-6 rounded-lg border border-slate-200 bg-white p-5"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                연구실 ID
              </label>
              <input
                value={condition.laboratoryId ?? ""}
                onChange={(event) =>
                  setCondition((prev) => ({
                    ...prev,
                    laboratoryId: event.target.value,
                  }))
                }
                placeholder="LAB-101"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                폐기물 종류
              </label>
              <select
                value={condition.wasteType ?? ""}
                onChange={(event) =>
                  setCondition((prev) => ({
                    ...prev,
                    wasteType: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                {WASTE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                처리상태
              </label>
              <select
                value={condition.requestStatus ?? ""}
                onChange={(event) =>
                  setCondition((prev) => ({
                    ...prev,
                    requestStatus: event.target.value as WasteRequestStatus | "",
                  }))
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="mb-1 block text-xs font-medium text-slate-500">
                시작일
              </label>
              <input
                type="date"
                value={condition.searchFromDate ?? ""}
                onChange={(event) =>
                  setCondition((prev) => ({
                    ...prev,
                    searchFromDate: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                종료일
              </label>
              <input
                type="date"
                value={condition.searchToDate ?? ""}
                onChange={(event) =>
                  setCondition((prev) => ({
                    ...prev,
                    searchToDate: event.target.value,
                  }))
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              조회
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border border-slate-300 px-5 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              초기화
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700">
            총 <span className="text-blue-600">{requests.length}</span>건
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-sm text-slate-400">
              조회 중...
            </div>
          ) : requests.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">
              조회된 신청 내역이 없습니다.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "접수번호",
                    "연구실",
                    "폐기물 종류",
                    "배출량",
                    "배출일자",
                    "보관 위치",
                    "처리상태",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <tr key={request.requestId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {request.requestId}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {request.laboratoryId}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {request.wasteType}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {request.emissionAmount}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {request.emissionDate}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {request.storageLocation}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[request.requestStatus ?? "REQUESTED"]
                        }`}
                      >
                        {STATUS_LABELS[request.requestStatus ?? "REQUESTED"]}
                      </span>
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
