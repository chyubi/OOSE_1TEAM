"use client";

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { ChemicalDTO } from '@/types/chemical';

export default function ChemicalListPage() {
  const [chemicals, setChemicals] = useState<ChemicalDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({ productName: '', casNo: '', storageLocation: '' });
  const [formData, setFormData] = useState<ChemicalDTO>({
    productName: '', manufacturer: '', casNo: '', storageLocation: '', status: 'ACTIVE'
  });

  // 목록 불러오기
  const fetchChemicals = async () => {
    const query = new URLSearchParams(searchParams as any).toString();
    const res = await fetch(`/api/chemicals?${query}`);
    const result = await res.json();
    if (result.success) setChemicals(result.data);
  };

  useEffect(() => { fetchChemicals(); }, []);

  // 등록 처리
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/chemicals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    
    if (result.success) {
      alert('등록 완료!');
      setIsModalOpen(false);
      fetchChemicals(); // 등록 후 목록 새로고침
    } else {
      alert(result.errorType === 'DUPLICATE' ? '이미 등록된 CAS 번호입니다.' : '등록 실패');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">화학물질 목록</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          + 신규 등록
        </button>
      </div>

      {/* 테이블 영역 */}
      <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">제품명</th><th className="p-3">제조사</th><th className="p-3">CAS No.</th><th className="p-3">보관장소</th>
          </tr>
        </thead>
        <tbody>
          {chemicals.map((chem) => (
            <tr key={chem.chemicalId} className="border-t hover:bg-gray-50 cursor-pointer">
              {/* 상세 페이지로 이동하는 링크 */}
              <td className="p-3 text-blue-600 underline">
                <Link href={`/chemicals/${chem.chemicalId}`}>{chem.productName}</Link>
              </td>
              <td className="p-3">{chem.manufacturer}</td>
              <td className="p-3">{chem.casNo}</td>
              <td className="p-3">{chem.storageLocation}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg w-96 flex flex-col gap-3">
            <h2 className="text-xl font-bold mb-2">신규 등록</h2>
            <input required placeholder="제품명" className="border p-2" onChange={(e) => setFormData({...formData, productName: e.target.value})} />
            <input required placeholder="제조사" className="border p-2" onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} />
            <input required placeholder="CAS 번호" className="border p-2" onChange={(e) => setFormData({...formData, casNo: e.target.value})} />
            <input required placeholder="보관 장소" className="border p-2" onChange={(e) => setFormData({...formData, storageLocation: e.target.value})} />
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 p-2 rounded">취소</button>
              <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">저장</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}