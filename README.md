사용자관리 서브시스템 (SS-U)

브랜치: chayubi\_사용자관리
담당: 차유비 (구현팀장)
관련 UC: UC-U01 ~ UC-U05
DB 테이블: USER_INFO

📌 담당 기능 개요
Use Case기능명주요 액터구현 상태UC-U01사용자 등록 신청연구활동종사자✅ 완료UC-U02등록 신청 처리관리자🔲 예정UC-U03사용자 정보 수정관리자🔲 예정UC-U04사용자 목록 조회관리자✅ 완료UC-U05사용자 상세 조회관리자, 연구실책임자✅ 완료

🗂 구현 파일 구조
src/
├── types/
│ └── user.ts # UserEntity, UserDTO, SearchCondition 타입 정의
│
├── lib/
│ ├── prisma.ts # Prisma 클라이언트 싱글톤
│ ├── userRepository.ts # CLS-U-06: UserRepository (DB 접근)
│ └── userService.ts # CLS-U-04: UserService (업무 로직)
│
└── app/
├── layout.tsx # 공통 레이아웃 (헤더 네비게이션)
├── page.tsx # 대시보드 홈
│
├── api/users/
│ ├── route.ts # GET(UC-U04 목록조회) / POST(UC-U01 등록신청)
│ └── [userId]/route.ts # GET(UC-U05 상세조회)
│
└── users/
├── page.tsx # UC-U04: 사용자 목록 조회 화면
├── register/page.tsx # UC-U01: 사용자 등록 신청 화면
└── [userId]/page.tsx # UC-U05: 사용자 상세 조회 화면

🏗 설계 클래스 구조 (SDD v0.3 기준)
사용자관리 (userManagement 패키지)
│
├── [Boundary] UserRegisterBoundary → /users/register/page.tsx
├── [Boundary] UserSearchBoundary → /users/page.tsx
├── [Control] UserControl → /app/api/users/route.ts (Next.js Route Handler)
├── [Service] UserService → /lib/userService.ts
├── [Repository] UserRepository → /lib/userRepository.ts
├── [Entity] UserEntity → Prisma model USER_INFO
└── [DTO] UserDTO, SearchCondition → /types/user.ts

🔌 API 엔드포인트
MethodEndpointUC설명POST/api/usersUC-U01사용자 등록 신청GET/api/usersUC-U04사용자 목록 조회GET/api/users/:userIdUC-U05사용자 상세 조회
POST /api/users — 등록 신청
Request Body
json{
"name": "홍길동",
"department": "컴퓨터공학부",
"role": "RESEARCHER",
"email": "hong@kmou.ac.kr",
"phone": "010-1234-5678",
"reason": "연구실 안전교육 이수를 위한 계정 신청",
"studentId": "20210001",
"labName": "지능제어시스템 연구실"
}
Response
json{
"success": true,
"data": { "userId": "RS-1717600000000" },
"message": "등록 신청이 완료되었습니다."
}
GET /api/users — 목록 조회
Query Param타입설명keywordstring이름/이메일 검색roleUserRole역할 필터departmentstring학부 필터

🗄 DB 테이블 명세 (USER_INFO)
컬럼명타입설명user_idVARCHAR PK사용자 ID (자동생성: 역할코드-타임스탬프)nameVARCHAR이름departmentVARCHAR소속 학부/부서roleVARCHARADMIN / LAB_MANAGER / SAFETY_MANAGER / RESEARCHERemailVARCHAR UNIQUE이메일phoneVARCHAR NULL전화번호created_atTIMESTAMP생성일시updated_atTIMESTAMP수정일시

⚙️ 로컬 개발 세팅
bash# 1. 브랜치 체크아웃
git checkout chayubi\_사용자관리

# 2. 패키지 설치

npm install

# 3. .env 파일 생성 (.env.example 참고, 팀장에게 실제 값 받기)

cp .env.example .env

# 4. Prisma 클라이언트 생성

npm run db:generate

# 5. DB 스키마 동기화 (개발 환경)

npm run db:push

# 6. 개발 서버 실행

npm run dev

# → http://localhost:3000

🖥 화면 라우트
URL화면UC/대시보드 홈-/users사용자 목록 조회UC-U04/users/register사용자 등록 신청UC-U01/users/:userId사용자 상세 조회UC-U05

🌿 작업 규칙

chayubi\_사용자관리 브랜치에서만 작업
기능 완성 후 main 브랜치로 Pull Request 생성
커밋 메시지 형식: feat(users): UC-U01 등록 신청 폼 구현
.env 파일은 절대 커밋 금지

객체지향소프트웨어공학 1팀 | 한국해양대학교 | SDD v0.3 기준
