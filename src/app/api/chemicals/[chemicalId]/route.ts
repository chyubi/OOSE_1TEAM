import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 단건 조회 (GET)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ chemicalId: string }> },
) {
  try {
    const { chemicalId } = await params;
    const chemical = await prisma.tB_CHEMICAL.findUnique({
      where: { chemicalId },
    });

    if (!chemical) {
      return NextResponse.json(
        { success: false, message: "데이터 없음" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: chemical });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// 수정 (PUT)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ chemicalId: string }> },
) {
  try {
    const { chemicalId } = await params;
    const body = await request.json();

    await prisma.tB_CHEMICAL.update({
      where: { chemicalId },
      data: {
        productName: body.productName,
        manufacturer: body.manufacturer,
        storageLocation: body.storageLocation,
        status: body.status,
      },
    });

    return NextResponse.json({ success: true, message: "수정되었습니다." });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "수정 실패" },
      { status: 500 },
    );
  }
}

// 삭제 (DELETE)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ chemicalId: string }> },
) {
  try {
    const { chemicalId } = await params;

    await prisma.tB_CHEMICAL.delete({
      where: { chemicalId },
    });

    return NextResponse.json({ success: true, message: "삭제되었습니다." });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "삭제 실패" },
      { status: 500 },
    );
  }
}
