"use client";

// UC-U01: 사용자 등록 신청 페이지
// SDD CLS-U-01: UserRegisterBoundary
// 연구활동종사자가 등록 신청 정보를 입력하는 화면

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterRequestDTO, UserRole } from "@/types/user";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "RESEARCHER", label: "연구활동종사자" },
  { value: "SAFETY_MANAGER", label: "연구실안전관리담당자" },
  { value: "LAB_MANAGER", label: "연구실책임자" },
];

const DEPARTMENTS = [
  "기계공학부",
  "전기공학부",
  "컴퓨터공학부",
  "해양시스템공학부",
  "조선해양공학부",
  "환경공학부",
  "에너지자원공학부",
  "물류시스템공학부",
];

export default function UserRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState<RegisterRequestDTO>({
    name: "",
    department: "",
    role: "RESEARCHER",
    email: "",
    phone: "",
    reason: "",
    studentId: "",
    labName: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // SDD UserRegisterBoundary: inputRegisterInfo() → submitRegisterForm() → showSuccessMessage()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(
          `등록 신청이 완료되었습니다. 사용자 ID: ${data.data.userId}`,
        );
        setForm({
          name: "",
          department: "",
          role: "RESEARCHER",
          email: "",
          phone: "",
          reason: "",
          studentId: "",
          labName: "",
        });
      } else {
        setErrorMsg(data.error ?? "등록 신청 중 오류가 발생했습니다.");
      }
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="mb-8">
          <p className="text-sm text-blue-600 font-medium mb-1">
            사용자관리 / UC-U01
          </p>
          <h1 className="text-2xl font-bold text-gray-900">사용자 등록 신청</h1>
          <p className="mt-1 text-sm text-gray-500">
            연구실 안전관리 시스템 계정을 신청합니다. 관리자 승인 후 이용
            가능합니다.
          </p>
        </div>

        {/* 성공/에러 메시지 */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            ✅ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            ❌ {errorMsg}
          </div>
        )}

        {/* 등록 신청 폼 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
        >
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="홍길동"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 소속 부서 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              소속 학부/부서 <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">학부/부서 선택</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 역할 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              역할 <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@kmou.ac.kr"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전화번호
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 소속 연구실 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              소속 연구실
            </label>
            <input
              type="text"
              name="labName"
              value={form.labName}
              onChange={handleChange}
              placeholder="예: 지능제어시스템 연구실"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 학번 (연구활동종사자) */}
          {form.role === "RESEARCHER" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                학번
              </label>
              <input
                type="text"
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                placeholder="예: 20210001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* 신청 사유 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              신청 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              rows={3}
              placeholder="시스템 등록 신청 사유를 입력해 주세요."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "처리 중..." : "등록 신청"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
