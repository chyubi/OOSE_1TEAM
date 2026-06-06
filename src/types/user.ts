// UC-U01~U05 사용자관리 타입 정의
// SDD v0.3 기준 - UserEntity, UserDTO, SearchCondition

export type UserRole =
  | "ADMIN" // 관리자
  | "LAB_MANAGER" // 연구실책임자
  | "SAFETY_MANAGER" // 연구실안전관리담당자
  | "RESEARCHER"; // 연구활동종사자

export type RegisterStatus = "PENDING" | "APPROVED" | "REJECTED";

// SDD CLS-U-05: UserEntity
export interface UserEntity {
  userId: string;
  name: string;
  department: string;
  role: UserRole;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// SDD CLS-U-07: UserDTO (계층 간 데이터 전달)
export interface UserDTO {
  userId: string;
  name: string;
  department: string;
  role: UserRole;
  email: string;
  phone?: string;
}

// UC-U01 사용자 등록 신청 폼 데이터
export interface RegisterRequestDTO {
  name: string;
  department: string;
  role: UserRole;
  email: string;
  phone: string;
  reason: string; // 등록 신청 사유
  studentId?: string; // 학번 (연구활동종사자)
  labName?: string; // 소속 연구실
}

// UC-U04 사용자 조회 조건
// SDD CLS-U-08: SearchCondition
export interface SearchCondition {
  keyword?: string;
  role?: UserRole | "";
  department?: string;
  status?: RegisterStatus | "";
}

// 사용자 등록 신청 정보 (관리자 검토용)
export interface RegisterRequest {
  requestId: string;
  requestData: RegisterRequestDTO;
  status: RegisterStatus;
  requestedAt: Date;
  reviewedAt?: Date;
  reviewComment?: string;
}

// API 응답 공통 형식
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
