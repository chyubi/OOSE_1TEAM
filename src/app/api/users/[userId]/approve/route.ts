// src/app/api/users/[userId]/approve/route.ts
// UC-U02: PATCH - 사용자 등록 신청 승인 또는 반려

import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/userService";

const userService = new UserService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    // action: 'APPROVE' | 'REJECT'
    // rejectReason: string (반려 시 사유)
    const { action, rejectReason } = body;

    if (!action || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: "action은 APPROVE 또는 REJECT 이어야 합니다.",
        },
        { status: 400 },
      );
    }
    if (action === "REJECT" && !rejectReason) {
      return NextResponse.json(
        { success: false, error: "반려 사유를 입력해 주세요." },
        { status: 400 },
      );
    }

    const result = await userService.processApproval(
      userId,
      action,
      rejectReason,
    );
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("[PATCH /api/users/:userId/approve]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
