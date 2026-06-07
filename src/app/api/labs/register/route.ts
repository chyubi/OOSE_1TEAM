// POST /api/labs/register
// UC-L01 연구실 기본정보 등록 API

import { NextRequest, NextResponse } from "next/server";
import { LabRegisterService } from "@/lib/lab-register.service";
import { LabForm } from "@/types/lab";

const labRegisterService = new LabRegisterService();

export async function POST(request: NextRequest) {
  try {
    const body: LabForm = await request.json();

    const result = await labRegisterService.register(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data, message: result.message },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/labs/register] Error:", error);
    return NextResponse.json(
      { success: false, errors: ["서버 오류가 발생했습니다."] },
      { status: 500 }
    );
  }
}
