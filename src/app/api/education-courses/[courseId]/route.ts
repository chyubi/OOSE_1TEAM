import { NextRequest, NextResponse } from "next/server";
import { EducationCourseService } from "@/app/lib/educationCourseService";

const educationCourseService = new EducationCourseService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;
    const result = await educationCourseService.getCourseDetail(courseId);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error("[GET /api/education-courses/:id]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
