// GET /api/labs/[labId]
// UC-L02 연구실 상세조회 API

import { NextRequest, NextResponse } from "next/server";
import { LabRepository } from "@/lib/lab.repository";

const labRepository = new LabRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ labId: string }> }
) {
  try {
    const { labId } = await params;

    const lab = await labRepository.findById(labId);

    if (!lab) {
      return NextResponse.json(
        { success: false, errors: ["해당 연구실을 찾을 수 없습니다."] },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: lab }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/labs/[labId]] Error:", error);
    return NextResponse.json(
      { success: false, errors: ["서버 오류가 발생했습니다."] },
      { status: 500 }
    );
  }
}
