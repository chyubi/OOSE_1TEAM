import { prisma } from "@/app/lib/prisma";
import {
  EducationCourseDTO,
  EducationCourseSearchCondition,
} from "@/types/education";

export class EducationCourseRepository {
  async existsByCourseName(courseName: string): Promise<boolean> {
    const count = await prisma.eDUCATION_COURSE.count({
      where: { courseName },
    });
    return count > 0;
  }

  async save(dto: EducationCourseDTO): Promise<string> {
    const courseId = `EDU-${Date.now()}`;
    await prisma.eDUCATION_COURSE.create({
      data: {
        courseId,
        courseName: dto.courseName,
        courseType: dto.courseType,
        targetRole: dto.targetRole,
        completionStandard: dto.completionStandard ?? null,
        educationPeriod: dto.educationPeriod ?? null,
        contentInfo: dto.contentInfo ?? null,
        status: dto.status || "ACTIVE",
      },
    });
    return courseId;
  }

  async findByCondition(
    condition: EducationCourseSearchCondition,
  ): Promise<EducationCourseDTO[]> {
    const where: Record<string, unknown> = {};

    if (condition.courseType) where.courseType = condition.courseType;
    if (condition.targetRole) where.targetRole = condition.targetRole;
    if (condition.status) where.status = condition.status;
    if (condition.searchKeyword) {
      where.courseName = {
        contains: condition.searchKeyword,
        mode: "insensitive",
      };
    }

    const rows = await prisma.eDUCATION_COURSE.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return rows.map((r) => ({
      courseId: r.courseId,
      courseName: r.courseName,
      courseType: r.courseType,
      targetRole: r.targetRole,
      completionStandard: r.completionStandard ?? undefined,
      educationPeriod: r.educationPeriod ?? undefined,
      contentInfo: r.contentInfo ?? undefined,
      status: r.status as EducationCourseDTO["status"],
    }));
  }

  async findById(courseId: string): Promise<EducationCourseDTO | null> {
    const r = await prisma.eDUCATION_COURSE.findUnique({
      where: { courseId },
    });
    if (!r) return null;

    return {
      courseId: r.courseId,
      courseName: r.courseName,
      courseType: r.courseType,
      targetRole: r.targetRole,
      completionStandard: r.completionStandard ?? undefined,
      educationPeriod: r.educationPeriod ?? undefined,
      contentInfo: r.contentInfo ?? undefined,
      status: r.status as EducationCourseDTO["status"],
    };
  }

  async updateStatus(courseId: string, status: string): Promise<void> {
    await prisma.eDUCATION_COURSE.update({
      where: { courseId },
      data: { status },
    });
  }
}
