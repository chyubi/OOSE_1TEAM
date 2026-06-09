// GET /api/labs
// UC-L02 연구실 기본정보 조회 API
// CLS-L-04: LabQueryService 로직 포함

import { NextRequest, NextResponse } from "next/server";
import { LabRepository } from "@/lib/lab.repository";

const labRepository = new LabRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const cond = {
      labName: searchParams.get("labName") ?? undefined,
      labType: searchParams.get("labType") ?? undefined,
      mgmtLevel: searchParams.get("mgmtLevel") ?? undefined,
      location: searchParams.get("location") ?? undefined,
    };

    const list = await labRepository.findByCond(cond);

    return NextResponse.json({ success: true, data: list }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/labs] Error:", error);
    return NextResponse.json(
      { success: false, errors: ["서버 오류가 발생했습니다."] },
      { status: 500 }
    );
  }
}
