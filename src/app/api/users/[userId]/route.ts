// src/app/api/users/[userId]/route.ts
// UC-U05: GET  - 사용자 상세 조회
// UC-U03: PUT  - 사용자 정보 수정
// UC-U03: DELETE - 사용자 삭제

import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/userService";

const userService = new UserService();

// UC-U05: 사용자 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const result = await userService.findUserById(userId);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error("[GET /api/users/:userId]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// UC-U03: 사용자 정보 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const result = await userService.updateUser(userId, body);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("[PUT /api/users/:userId]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// UC-U03: 사용자 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const result = await userService.deleteUser(userId);
    return NextResponse.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    console.error("[DELETE /api/users/:userId]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
