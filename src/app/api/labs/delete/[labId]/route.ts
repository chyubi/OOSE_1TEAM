// DELETE /api/labs/delete/[labId]
// UC-L01 연구실 기본정보 삭제 API

import { NextRequest, NextResponse } from "next/server";
import { LabRegisterService } from "@/lib/lab-register.service";

const labRegisterService = new LabRegisterService();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ labId: string }> }
) {
  try {
    const { labId } = await params;

    if (!labId) {
      return NextResponse.json(
        { success: false, errors: ["연구실 ID가 필요합니다."] },
        { status: 400 }
      );
    }

    const result = await labRegisterService.deleteById(labId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.errors },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: result.message },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE /api/labs/delete] Error:", error);
    return NextResponse.json(
      { success: false, errors: ["서버 오류가 발생했습니다."] },
      { status: 500 }
    );
  }
}
