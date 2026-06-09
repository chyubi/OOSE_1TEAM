// 프론트엔드와 API 통신에서 사용할 화학물질 데이터 구조
export interface ChemicalDTO {
  chemicalId?: string; // 등록 시에는 없고, 조회 시에는 있음 (그래서 ? 처리)
  productName: string;
  manufacturer: string;
  casNo: string;
  storageLocation: string;
  status: string;
}

// 검색할 때 사용할 조건 구조
export interface SearchCondition {
  productName?: string;
  casNo?: string;
  storageLocation?: string;
}