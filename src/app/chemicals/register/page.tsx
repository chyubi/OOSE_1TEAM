'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function ChemicalRegisterBoundary() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    productName: '',
    manufacturer: '',
    casNo: '',
    storageLocation: '',
    status: 'ACTIVE'
  });

  const inputChemicalData = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch('/api/chemicals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(`'${formData.productName}'이(가) 성공적으로 등록되었습니다.`);
        setFormData({ productName: '', manufacturer: '', casNo: '', storageLocation: '', status: 'ACTIVE' });
      } else {
        setErrorMsg(data.error ?? '등록 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setErrorMsg("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-sm text-blue-600 font-medium mb-1">
            화학물질관리 / UC-C01
          </p>
          <h1 className="text-2xl font-bold text-gray-900">화학물질 신규 등록</h1>
        </div>

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

        <form onSubmit={inputChemicalData} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {[
            { name: 'productName', label: '제품명', placeholder: '예) 아세톤' },
            { name: 'manufacturer', label: '제조사', placeholder: '예) 대정화금' },
            { name: 'casNo', label: 'CAS 번호', placeholder: '예) 67-64-1' },
            { name: 'storageLocation', label: '보관 위치', placeholder: '예) 시약장 A-1' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                placeholder={field.placeholder}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              취소
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? "등록 중..." : "등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}