// src/app/api/inspections/[inspectionId]/confirm/route.ts
// UC-I02: PATCH - 점검 결과 확인 처리 (SUBMITTED → CONFIRMED)

import { NextRequest, NextResponse } from "next/server";
import { InspectionService } from "@/app/lib/inspectionService";

const inspectionService = new InspectionService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ inspectionId: string }> },
) {
  try {
    const { inspectionId } = await params;
    const result = await inspectionService.confirmInspection(inspectionId);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("[PATCH /api/inspections/:id/confirm]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
