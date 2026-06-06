import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/userService";

const userService = new UserService();

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
