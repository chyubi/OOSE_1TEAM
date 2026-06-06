// UC-U01~U05 사용자관리 타입 정의
// SDD v0.3 기준 - UserEntity, UserDTO, SearchCondition

export type UserRole =
  | "ADMIN"
  | "LAB_MANAGER"
  | "SAFETY_MANAGER"
  | "RESEARCHER";

export type UserStatus = "PENDING" | "APPROVED" | "REJECTED";

// SDD CLS-U-05: UserEntity
export interface UserEntity {
  userId: string;
  name: string;
  department: string;
  role: UserRole;
  email: string;
  phone?: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

// SDD CLS-U-07: UserDTO
export interface UserDTO {
  userId: string;
  name: string;
  department: string;
  role: UserRole;
  email: string;
  phone?: string;
  status?: UserStatus;
}

// UC-U01 등록 신청 폼
export interface RegisterRequestDTO {
  name: string;
  department: string;
  role: UserRole;
  email: string;
  phone: string;
  reason: string;
  studentId?: string;
  labName?: string;
}

// UC-U04 조회 조건
export interface SearchCondition {
  keyword?: string;
  role?: UserRole | "";
  department?: string;
  status?: UserStatus | "";
}

// API 응답 공통
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
