// 호환용 re-export.
// prisma 싱글톤은 src/lib/prisma.ts(@/lib/prisma)로 이동했으나,
// 일부 레포가 옛 경로(@/app/lib/prisma)를 import하고 있어 모듈 해석 실패가 발생한다.
// 임포트 경로를 통일하기 전까지의 호환 shim.
export { prisma } from "@/lib/prisma";
