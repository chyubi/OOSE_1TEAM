// src/app/api/users/route.ts
// UC-U01: POST /api/users  - 사용자 등록 신청
// UC-U04: GET  /api/users  - 사용자 목록 조회 (관리자)

import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/userService";
import { RegisterRequestDTO, SearchCondition } from "@/types/user";

const userService = new UserService();

// UC-U04: 사용자 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const condition: SearchCondition = {
      keyword: searchParams.get("keyword") ?? undefined,
      role: (searchParams.get("role") as SearchCondition["role"]) ?? undefined,
      department: searchParams.get("department") ?? undefined,
    };

    const result = await userService.findUsers(condition);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("[GET /api/users]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// UC-U01: 사용자 등록 신청
export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequestDTO = await request.json();
    const result = await userService.registerUser(body);
    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error) {
    console.error("[POST /api/users]", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
