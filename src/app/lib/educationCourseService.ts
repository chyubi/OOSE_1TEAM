import { EducationCourseRepository } from "@/app/lib/educationCourseRepository";
import {
  ApiResponse,
  EducationCourseDTO,
  EducationCourseSearchCondition,
} from "@/types/education";

export class EducationCourseService {
  private educationCourseRepository: EducationCourseRepository;

  constructor() {
    this.educationCourseRepository = new EducationCourseRepository();
  }

  validateCourseInfo(dto: EducationCourseDTO): boolean {
    if (!dto.courseName || dto.courseName.trim().length === 0) return false;
    if (!dto.courseType || dto.courseType.trim().length === 0) return false;
    if (!dto.targetRole || dto.targetRole.trim().length === 0) return false;
    if (
      !dto.completionStandard ||
      dto.completionStandard.trim().length === 0
    ) {
      return false;
    }
    if (!dto.educationPeriod || dto.educationPeriod.trim().length === 0) {
      return false;
    }
    return true;
  }

  async registerCourse(
    dto: EducationCourseDTO,
  ): Promise<ApiResponse<{ courseId: string }>> {
    const isValid = this.validateCourseInfo(dto);
    if (!isValid) {
      return { success: false, error: "필수 입력값이 누락되었습니다." };
    }

    const exists = await this.educationCourseRepository.existsByCourseName(
      dto.courseName.trim(),
    );
    if (exists) {
      return {
        success: false,
        error: "동일한 교육과정명이 이미 등록되어 있습니다.",
      };
    }

    const courseId = await this.educationCourseRepository.save({
      ...dto,
      courseName: dto.courseName.trim(),
    });
    return {
      success: true,
      data: { courseId },
      message: `교육과정이 등록되었습니다. 교육과정 ID: ${courseId}`,
    };
  }

  async searchCourseList(
    condition: EducationCourseSearchCondition,
  ): Promise<ApiResponse<EducationCourseDTO[]>> {
    const list = await this.educationCourseRepository.findByCondition(
      condition,
    );
    return { success: true, data: list };
  }

  async getCourseDetail(
    courseId: string,
  ): Promise<ApiResponse<EducationCourseDTO>> {
    const item = await this.educationCourseRepository.findById(courseId);
    if (!item) {
      return { success: false, error: "교육과정을 찾을 수 없습니다." };
    }
    return { success: true, data: item };
  }
}
