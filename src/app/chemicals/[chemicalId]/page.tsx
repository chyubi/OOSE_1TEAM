"use client";

import { useEffect, useState, use } from "react";
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

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await fetch(`/api/chemicals/${chemicalId}`);
      const result = await res.json();
      if (result.success) setChemical(result.data);
      else alert("데이터를 찾을 수 없습니다.");
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

  if (!chemical) return <div className="p-8 text-center">로딩중...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">화학물질 상세 정보</h1>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col gap-4">
        <div>
          <label className="block text-sm text-gray-500">제품명</label>
          <input
            className="border p-2 w-full rounded"
            value={chemical.productName}
            onChange={(e) =>
              setChemical({ ...chemical, productName: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500">제조사</label>
          <input
            className="border p-2 w-full rounded"
            value={chemical.manufacturer}
            onChange={(e) =>
              setChemical({ ...chemical, manufacturer: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500">
            CAS 번호 (수정 불가)
          </label>
          <input
            className="border p-2 w-full bg-gray-100 rounded"
            value={chemical.casNo}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500">보관 장소</label>
          <input
            className="border p-2 w-full rounded"
            value={chemical.storageLocation}
            onChange={(e) =>
              setChemical({ ...chemical, storageLocation: e.target.value })
            }
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => router.push("/chemicals")}
            className="flex-1 bg-gray-500 text-white p-3 rounded"
          >
            목록으로
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white p-3 rounded"
          >
            삭제하기
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 bg-blue-600 text-white p-3 rounded"
          >
            저장(수정)하기
          </button>
        </div>
      </div>
    </div>
  );
}
