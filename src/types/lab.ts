// CLS-L-05: Lab Entity 기반 타입 정의

export interface LabForm {
  labId: string;
  labName: string;
  location: string;
  labType: string;
  contactPerson?: string;
  mgmtLevel: string;
  floorPlan?: string;
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
  contactPerson?: string;
  floorPlan?: string;
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

export const labTypeS = [
  "일반연구실",
  "화학연구실",
  "생물연구실",
  "물리연구실",
  "전기·전자연구실",
  "기계연구실",
  "복합연구실",
] as const;

export const safetyLevelS = ["1등급", "2등급", "3등급"] as const;
