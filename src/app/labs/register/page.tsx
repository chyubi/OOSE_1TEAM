"use client";

// CLS-L-01: LabRegisterView (Boundary)
// UC-L01 연구실 기본정보 등록
// 연구실 등록/수정 화면을 표시하고 관리자의 입력값을 수집해 제어 계층에 전달하며,
// 저장 결과와 오류 메시지를 표시한다.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LabForm, labTypeS, safetyLevelS } from "@/types/lab";

const INITIAL_FORM: LabForm = {
  labId: "",
  labName: "",
  location: "",
  labType: "",
  contactPerson: "",
  mgmtLevel: "",
  floorPlan: "",
  photo: "",
};

export default function LabRegisterView() {
  // CLS-L-01 속성
  const [labForm, setLabForm] = useState<LabForm>(INITIAL_FORM);
  const [validationMsg, setValidationMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // displayForm(): 등록/수정 입력 항목을 표시한다.
  const displayForm = () => {
    setLabForm(INITIAL_FORM);
    setValidationMsg("");
    setSuccessMsg("");
  };

  // submit(): 입력값을 제어 계층으로 전달한다.
  const submit = async (form: LabForm) => {
    setIsLoading(true);
    setValidationMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/labs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        showError(data.errors ?? ["등록 중 오류가 발생했습니다."]);
      } else {
        showResult(data);
      }
    } catch {
      showError(["서버와 통신 중 오류가 발생했습니다."]);
    } finally {
      setIsLoading(false);
    }
  };

  // showResult(): 저장 결과 및 상세정보를 표시한다.
  const showResult = (result: { message?: string }) => {
    setSuccessMsg(result.message ?? "등록이 완료되었습니다.");
    setLabForm(INITIAL_FORM);
  };

  // showError(): 검증/예외 오류를 표시한다.
  const showError = (errors: string[]) => {
    setValidationMsg(errors.join(" | "));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setLabForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(labForm);
  };

  const handleReset = () => {
    displayForm();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-blue-800 text-white px-6 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push("/labs")}
            className="text-blue-200 hover:text-white text-sm mr-2"
          >
            ← 목록
          </button>
          <div>
            <h1 className="text-lg font-bold">연구실 기본정보 등록</h1>
            <p className="text-blue-200 text-xs mt-0.5">UC-L01 · 연구실관리</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* 성공 메시지 */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <span className="text-green-600 text-lg">✓</span>
            <div>
              <p className="text-green-800 font-medium">{successMsg}</p>
              <button
                onClick={() => router.push("/labs")}
                className="text-green-600 underline text-sm mt-1"
              >
                목록으로 이동
              </button>
            </div>
          </div>
        )}

        {/* 오류 메시지 */}
        {validationMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <span className="text-red-500 text-lg">✕</span>
            <p className="text-red-700 text-sm">{validationMsg}</p>
          </div>
        )}

        {/* 등록 폼 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* 폼 제목 */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              기본 정보 <span className="text-red-500 ml-1">* 필수</span>
            </h2>
          </div>

          <div className="p-6 space-y-5">
            {/* 연구실 ID / 연구실명 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="연구실 ID" required>
                <input
                  type="text"
                  name="labId"
                  value={labForm.labId}
                  onChange={handleChange}
                  placeholder="예) LAB-001"
                  maxLength={20}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">최대 20자</p>
              </FormField>

              <FormField label="연구실명" required>
                <input
                  type="text"
                  name="labName"
                  value={labForm.labName}
                  onChange={handleChange}
                  placeholder="예) 해양공학 실험실"
                  maxLength={100}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">최대 100자</p>
              </FormField>
            </div>

            {/* 위치 */}
            <FormField label="위치" required>
              <input
                type="text"
                name="location"
                value={labForm.location}
                onChange={handleChange}
                placeholder="예) 공학관 3층 301호"
                maxLength={200}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            {/* 연구실 유형 / 관리 등급 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="연구실 유형" required>
                <select
                  name="labType"
                  value={labForm.labType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">선택하세요</option>
                  {labTypeS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="관리 등급" required>
                <select
                  name="mgmtLevel"
                  value={labForm.mgmtLevel}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">선택하세요</option>
                  {safetyLevelS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* 연락처 */}
            <FormField label="연락처">
              <input
                type="text"
                name="contactPerson"
                value={labForm.contactPerson}
                onChange={handleChange}
                placeholder="예) 051-410-1234"
                maxLength={50}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>
          </div>

          {/* 부가 정보 섹션 */}
          <div className="px-6 py-4 bg-gray-50 border-t border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              부가 정보{" "}
              <span className="text-gray-400 font-normal">(선택)</span>
            </h2>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="배치도 경로">
                <input
                  type="text"
                  name="floorPlan"
                  value={labForm.floorPlan}
                  onChange={handleChange}
                  placeholder="예) /uploads/layout/lab001.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormField>

              <FormField label="사진 경로">
                <input
                  type="text"
                  name="photo"
                  value={labForm.photo}
                  onChange={handleChange}
                  placeholder="예) /uploads/photo/lab001.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormField>
            </div>
          </div>

          {/* 버튼 */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={() => router.push("/labs")}
              className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-sm text-white bg-blue-700 rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? "등록 중..." : "등록"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// 폼 필드 래퍼 컴포넌트
function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
