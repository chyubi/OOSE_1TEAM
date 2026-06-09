// 안전교육관리 타입 정의

export type EducationCourseStatus = "ACTIVE" | "INACTIVE" | "CLOSED";

export interface EducationCourseEntity {
  courseId: string;
  courseName: string;
  courseType: string;
  targetRole: string;
  completionStandard?: string;
  educationPeriod?: string;
  contentInfo?: string;
  status: EducationCourseStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationCourseDTO {
  courseId?: string;
  courseName: string;
  courseType: string;
  targetRole: string;
  completionStandard?: string;
  educationPeriod?: string;
  contentInfo?: string;
  status?: EducationCourseStatus;
  searchKeyword?: string;
}

export interface EducationCourseSearchCondition {
  courseType?: string;
  targetRole?: string;
  status?: EducationCourseStatus | "";
  searchKeyword?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
