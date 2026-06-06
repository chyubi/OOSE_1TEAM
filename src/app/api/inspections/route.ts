import { NextRequest, NextResponse } from "next/server";
import { InspectionService } from "@/app/lib/inspectionService";
import { InspectionSearchCondition } from "@/types/inspection";

const inspectionService = new InspectionService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const condition: InspectionSearchCondition = {
      laboratoryId: searchParams.get("laboratoryId") ?? undefined,
      searchFromDate: searchParams.get("searchFromDate") ?? undefined,
      searchToDate: searchParams.get("searchToDate") ?? undefined,
      inspectionStatus:
        (searchParams.get(
          "inspectionStatus",
        ) as InspectionSearchCondition["inspectionStatus"]) ?? undefined,
    };
    const result = await inspectionService.getInspectionHistoryList(condition);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[GET /api/inspections]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await inspectionService.submitInspectionResult(body);
    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error) {
    console.error("[POST /api/inspections]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
