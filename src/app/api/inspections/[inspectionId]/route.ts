import { NextRequest, NextResponse } from "next/server";
import { InspectionService } from "@/app/lib/inspectionService";

const inspectionService = new InspectionService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ inspectionId: string }> },
) {
  try {
    const { inspectionId } = await params;
    const result = await inspectionService.getInspectionById(inspectionId);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error("[GET /api/inspections/:id]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
