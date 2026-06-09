// CLS-L-05: Lab Entity 기반 타입 정의

export interface LabForm {
  labId: string;
  labName: string;
  location: string;
  labType: string;
  contact?: string;
  mgmtLevel: string;
  orgId: string;
  safetySign?: string;
  layoutImage?: string;
  photo?: string;
}

export interface LabSummary {
  labId: string;
  labName: string;
  location: string;
  labType: string;
  mgmtLevel: string;
}

export interface LabDetail extends LabSummary {
  contact?: string;
  orgId: string;
  safetySign?: string;
  layoutImage?: string;
  photo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface LabResult {
  success: boolean;
  data?: LabDetail;
  errors?: string[];
  message?: string;
}

export const LAB_TYPES = [
  "일반연구실",
  "화학연구실",
  "생물연구실",
  "물리연구실",
  "전기·전자연구실",
  "기계연구실",
  "복합연구실",
] as const;

export const MGMT_LEVELS = ["1등급", "2등급", "3등급"] as const;
