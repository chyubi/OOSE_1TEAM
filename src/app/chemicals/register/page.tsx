'use client';

import { useState, FormEvent } from 'react';

export default function ChemicalRegisterBoundary() {
  const [formData, setFormData] = useState({
    productName: '',
    manufacturer: '',
    casNo: '',
    storageLocation: '',
    status: '보관중'
  });

  const showSuccessMessage = () => alert('화학물질이 성공적으로 등록되었습니다.');
  const showValidationError = () => alert('필수값을 모두 입력해주세요.');
  const showDuplicateError = () => alert('이미 등록된 CAS 번호입니다.');

  // + inputChemicalData(dto: ChemicalDTO): void
  const inputChemicalData = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/chemicals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        showSuccessMessage();
      } else {
        if (data.errorType === 'DUPLICATE') showDuplicateError();
        else showValidationError();
      }
    } catch (error) {
      console.error("등록 중 오류 발생:", error);
    }
  };

  // + showRegisterForm(): void
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">화학물질 등록 (UC-C01)</h1>
      <form onSubmit={inputChemicalData} className="flex flex-col gap-4 max-w-md bg-white p-6 rounded shadow-sm border">
        <label className="flex flex-col text-sm font-semibold">
          제품명
          <input type="text" onChange={(e) => setFormData({...formData, productName: e.target.value})} className="border p-2 rounded mt-1 font-normal" required />
        </label>
        <label className="flex flex-col text-sm font-semibold">
          제조사
          <input type="text" onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} className="border p-2 rounded mt-1 font-normal" required />
        </label>
        <label className="flex flex-col text-sm font-semibold">
          CAS No
          <input type="text" onChange={(e) => setFormData({...formData, casNo: e.target.value})} className="border p-2 rounded mt-1 font-normal" required />
        </label>
        <label className="flex flex-col text-sm font-semibold">
          보관 위치
          <input type="text" onChange={(e) => setFormData({...formData, storageLocation: e.target.value})} className="border p-2 rounded mt-1 font-normal" required />
        </label>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4">
          등록하기
        </button>
      </form>
    </div>
  );
}