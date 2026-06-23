"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ChemicalDTO {
  chemicalId?: string;
  productName: string;
  manufacturer: string;
  casNo: string;
  storageLocation: string;
  status: string;
}

export default function ChemicalDetailPage({
  params,
}: {
  params: Promise<{ chemicalId: string }>;
}) {
  const { chemicalId } = use(params);
  const router = useRouter();
  const [chemical, setChemical] = useState<ChemicalDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await fetch(`/api/chemicals/${chemicalId}`);
      const result = await res.json();
      if (result.success) {
        setChemical(result.data);
      } else {
        setError(result.error ?? "데이터를 찾을 수 없습니다.");
      }
      setIsLoading(false);
    };
    fetchDetail();
  }, [chemicalId]);

  const handleUpdate = async () => {
    const res = await fetch(`/api/chemicals/${chemicalId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chemical),
    });
    if ((await res.json()).success) {
      alert("수정되었습니다!");
      router.push("/chemicals");
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/chemicals/${chemicalId}`, {
      method: "DELETE",
    });
    if ((await res.json()).success) {
      alert("삭제되었습니다.");
      router.push("/chemicals");
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">로딩중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!chemical) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <Link href="/chemicals" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; 목록으로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">화학물질 상세 정보</h1>
          <p className="text-sm text-gray-500">UC-C03, UC-C04, UC-C05</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제품명</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={chemical.productName}
              onChange={(e) =>
                setChemical({ ...chemical, productName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제조사</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={chemical.manufacturer}
              onChange={(e) =>
                setChemical({ ...chemical, manufacturer: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CAS 번호 (수정 불가)
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-900"
              value={chemical.casNo}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">보관 장소</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={chemical.storageLocation}
              onChange={(e) =>
                setChemical({ ...chemical, storageLocation: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDelete}
              className="w-1/3 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
            >
              삭제
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              수정사항 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
