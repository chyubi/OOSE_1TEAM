import { NextResponse } from 'next/server';
import { processRegistration, getChemicalList } from '@/lib/chemicalService';

export async function POST(request: Request) {
  try { 
    const dto = await request.json();
    
    // 서비스 파일에 있는 함수 그대로 사용
    await processRegistration(dto);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'DUPLICATE_ERROR') {
      return NextResponse.json({ success: false, errorType: 'DUPLICATE' }, { status: 409 });
    }
    return NextResponse.json({ success: false, errorType: 'VALIDATION' }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const condition = {
    productName: searchParams.get('productName') || undefined,
    casNo: searchParams.get('casNo') || undefined,
    storageLocation: searchParams.get('storageLocation') || undefined,
  };

  try {
    // 서비스 파일에 있는 함수 그대로 사용
    const results = await getChemicalList(condition);
    
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ success: false, message: '조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}