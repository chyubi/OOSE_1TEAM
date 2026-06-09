import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 상세 조회 (GET)
export async function GET(request: Request, { params }: { params: { chemicalId: string } }) {
  try {
    const chemical = await prisma.tB_CHEMICAL.findUnique({
      where: { CHEMICAL_ID: params.chemicalId },
    });
    
    if (!chemical) return NextResponse.json({ success: false, message: '데이터 없음' }, { status: 404 });
    
    // 프론트엔드가 쓰기 편하게 camelCase로 변환해서 전달
    const data = {
      chemicalId: chemical.CHEMICAL_ID,
      productName: chemical.PRODUCT_NAME,
      manufacturer: chemical.MANUFACTURER,
      casNo: chemical.CAS_NO,
      storageLocation: chemical.STORAGE_LOCATION,
      status: chemical.STATUS,
    };
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// 수정 (PUT)
export async function PUT(request: Request, { params }: { params: { chemicalId: string } }) {
  try {
    const body = await request.json();
    await prisma.tB_CHEMICAL.update({
      where: { CHEMICAL_ID: params.chemicalId },
      data: {
        PRODUCT_NAME: body.productName,
        MANUFACTURER: body.manufacturer,
        STORAGE_LOCATION: body.storageLocation,
        STATUS: body.status,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: '수정 실패' }, { status: 500 });
  }
}

// 삭제 (DELETE)
export async function DELETE(request: Request, { params }: { params: { chemicalId: string } }) {
  try {
    await prisma.tB_CHEMICAL.delete({
      where: { CHEMICAL_ID: params.chemicalId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: '삭제 실패' }, { status: 500 });
  }
}