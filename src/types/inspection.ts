// UC-I01~I04 점검관리 타입 정의
// SDD v0.3 기준 - DailyInspectionEntity, InspectionDTO

export type InspectionStatus = "DRAFT" | "SUBMITTED" | "CONFIRMED";

export type InspectionMethod = "육안점검" | "기기점검" | "서류점검";

// SDD CLS-I-06: DailyInspectionEntity
export interface DailyInspectionEntity {
  inspectionId: number;
  laboratoryId: string;
  inspectionDate: Date;
  inspectionMethod: InspectionMethod;
  checklistResult: string;
  nonconformReason?: string;
  specialNote?: string;
  inspectionStatus: InspectionStatus;
  writerId: string;
  submitDateTime?: Date;
  confirmDateTime?: Date;
}

// SDD CLS-I-07: InspectionDTO (계층 간 데이터 전달)
export interface InspectionDTO {
  inspectionId?: number;
  laboratoryId: string;
  inspectionDate: string;
  inspectionMethod: string;
  checklistResult: string;
  nonconformReason?: string;
  specialNote?: string;
  inspectionStatus?: InspectionStatus;
  writerId?: string;
  searchFromDate?: string;
  searchToDate?: string;
}

// 점검 이력 조회 조건 (UC-I03)
export interface InspectionSearchCondition {
  laboratoryId?: string;
  searchFromDate?: string;
  searchToDate?: string;
  inspectionStatus?: InspectionStatus | "";
}

// 체크리스트 항목
export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  result: "PASS" | "FAIL" | "NA" | "";
}

// API 응답 공통
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
