"use client";

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { ChemicalDTO, SearchCondition } from '@/types/chemical';

export default function ChemicalListPage() {
  const [chemicals, setChemicals] = useState<ChemicalDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchCond, setSearchCond] = useState<SearchCondition>({
    productName: "",
    casNo: "",
    storageLocation: "",
  });

  // 목록 불러오기
  const fetchChemicals = async () => {
    setIsLoading(true);
    setError("");
    try {
      const query = new URLSearchParams(searchCond as any).toString();
      const res = await fetch(`/api/chemicals?${query}`);
      const result = await res.json();
      if (result.success) {
        setChemicals(result.data);
      } else {
        setError(result.error ?? "목록을 불러오는 중 오류가 발생했습니다.");
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChemicals();
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchChemicals();
  };

  const handleReset = () => {
    setSearchCond({ productName: "", casNo: "", storageLocation: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">
              화학물질관리 / UC-C02
            </p>
            <h1 className="text-2xl font-bold text-gray-900">화학물질 목록 조회</h1>
          </div>
          <Link
            href="/chemicals/register"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            + 신규 등록
          </Link>
        </div>

        {/* 검색 조건 */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl border border-gray-200 p-5 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={searchCond.productName}
              onChange={(e) => setSearchCond(p => ({ ...p, productName: e.target.value }))}
              placeholder="제품명"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={searchCond.casNo}
              onChange={(e) => setSearchCond(p => ({ ...p, casNo: e.target.value }))}
              placeholder="CAS 번호"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={searchCond.storageLocation}
              onChange={(e) => setSearchCond(p => ({ ...p, storageLocation: e.target.value }))}
              placeholder="보관 장소"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              🔍 조회
            </button>
            <button type="button" onClick={handleReset} className="px-5 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
              초기화
            </button>
          </div>
        </form>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>}

        {/* 테이블 영역 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">
              총 <span className="text-blue-600">{chemicals.length}</span>건
            </span>
          </div>
          {isLoading ? (
            <div className="py-16 text-center text-sm text-gray-400">조회 중...</div>
          ) : chemicals.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">조회된 화학물질이 없습니다.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["제품명", "제조사", "CAS No.", "보관장소", "상태"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chemicals.map((chem) => (
                  <tr key={chem.chemicalId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600 hover:underline">
                      <Link href={`/chemicals/${chem.chemicalId}`}>{chem.productName}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{chem.manufacturer}</td>
                    <td className="px-4 py-3 text-gray-600">{chem.casNo}</td>
                    <td className="px-4 py-3 text-gray-600">{chem.storageLocation}</td>
                    <td className="px-4 py-3 text-gray-600">{chem.status}</td>
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