"use client";

import { useState } from "react";
import Link from "next/link";

const WASTE_TYPES = [
  "폐유기용제",
  "폐산",
  "폐알칼리",
  "폐시약",
  "고상폐기물",
  "기타",
];

const LAB_OPTIONS = ["LAB-101", "LAB-201", "LAB-301", "LAB-401", "LAB-501"];

const UNIT_OPTIONS = ["kg", "L", "개"];

interface WasteFormState {
  labId: string;
  requesterId: string;
  wasteType: string;
  quantity: string;
  unit: string;
}

const INITIAL_FORM: WasteFormState = {
  labId: "",
  requesterId: "",
  wasteType: "",
  quantity: "",
  unit: "kg",
};

export default function WasteRequestPage() {
  const [form, setForm] = useState<WasteFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/waste-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labId: form.labId,
          requesterId: form.requesterId,
          wasteType: form.wasteType,
          quantity: Number(form.quantity),
          unit: form.unit,
        }),
      });
      const result = await response.json();

      if (!result.success) {
        setError(result.error ?? "신청 등록에 실패했습니다.");
        return;
      }

      setMessage(`신청이 등록되었습니다. 접수번호: ${result.data.requestId}`);
      setForm(INITIAL_FORM);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-blue-600">
              폐기물관리 / UC-W01
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              폐기물 배출 신청
            </h1>
          </div>
          <Link
            href="/waste/status"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            처리현황 조회
          </Link>
        </div>

        {message && (
          <div className="mb-5 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-lg border border-slate-200 bg-white p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                연구실 ID
              </label>
              <select
                name="labId"
                value={form.labId}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택</option>
                {LAB_OPTIONS.map((lab) => (
                  <option key={lab} value={lab}>
                    {lab}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                신청자 ID
              </label>
              <input
                name="requesterId"
                value={form.requesterId}
                onChange={handleChange}
                required
                placeholder="예: U-2024-001"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                폐기물 종류
              </label>
              <select
                name="wasteType"
                value={form.wasteType}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택</option>
                {WASTE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                배출량 / 단위
              </label>
              <div className="flex gap-2">
                <input
                  name="quantity"
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  placeholder="예: 12.5"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  required
                  className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {UNIT_OPTIONS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setForm(INITIAL_FORM)}
              className="rounded-md border border-slate-300 px-5 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              초기화
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "등록 중" : "신청 등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
