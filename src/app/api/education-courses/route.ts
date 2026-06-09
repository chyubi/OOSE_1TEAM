import { NextRequest, NextResponse } from "next/server";
import { EducationCourseService } from "@/app/lib/educationCourseService";
import { EducationCourseSearchCondition } from "@/types/education";

const educationCourseService = new EducationCourseService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const condition: EducationCourseSearchCondition = {
      courseType: searchParams.get("courseType") ?? undefined,
      targetRole: searchParams.get("targetRole") ?? undefined,
      status:
        (searchParams.get(
          "status",
        ) as EducationCourseSearchCondition["status"]) ?? undefined,
      searchKeyword: searchParams.get("searchKeyword") ?? undefined,
    };
    const result = await educationCourseService.searchCourseList(condition);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[GET /api/education-courses]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await educationCourseService.registerCourse(body);
    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error) {
    console.error("[POST /api/education-courses]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
