import { NextRequest, NextResponse } from "next/server";
import { WasteService } from "@/lib/wasteService";
import { WasteRequestDTO, WasteSearchCondition } from "@/types/waste";

const wasteService = new WasteService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const condition: WasteSearchCondition = {
      labId: searchParams.get("labId") ?? undefined,
      wasteType: searchParams.get("wasteType") ?? undefined,
      status:
        (searchParams.get("status") as WasteSearchCondition["status"]) ??
        undefined,
    };

    const result = await wasteService.getWasteRequests(condition);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("[GET /api/waste-requests]", error);
    return NextResponse.json(
      { success: false, error: "폐기물 처리현황 조회 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: WasteRequestDTO = await request.json();
    const result = await wasteService.createWasteRequest(body);
    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error) {
    console.error("[POST /api/waste-requests]", error);
    return NextResponse.json(
      { success: false, error: "폐기물 배출 신청 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
