# 🔬 연구실안전관리시스템 (Lab Safety Management System)

한국해양대학교 객체지향소프트웨어공학 1팀 구현 프로젝트입니다.

---

## 👥 팀 구성 및 담당

| 이름   | 역할     | 담당 서브시스템                                    | 브랜치                  |
| ------ | -------- | -------------------------------------------------- | ----------------------- |
| 정서인 | 팀장     | 연구실관리 (UC-L01~L17)                            | `seoin_연구실관리`      |
| 차유비 | 구현팀장 | 사용자관리 (UC-U01~U05)                            | `chayubi_사용자관리`    |
| 김민제 | 팀원     | 점검관리 (UC-I01~I04)                              | `minje_점검관리`        |
| 김욱동 | 팀원     | 폐기물관리 (UC-W01~W06)                            | `wookdong_폐기물관리`         |
| 류아연 | 팀원     | 안전교육관리 (UC-E01~E19)                          | `ayeon_안전교육관리`    |
| 김도흠 | 팀원     | 화학물질관리 (UC-C01~C05)                           | `doheum_화학물질관리` |

---

## 🛠 기술 스택

### Frontend

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**

### Backend

- **Next.js API Routes** (서버리스 백엔드)
- **Prisma ORM v5.22.0**

### Database

- **PostgreSQL** (Supabase 클라우드 호스팅)
- **Supabase** - `aws-1-ap-southeast-1` 리전

### 개발 도구

- **VSCode**
- **Git / GitHub**
- **Node.js v20**

---

## 🗄 데이터베이스 구조

SDD(소프트웨어 설계 명세서) v0.3 기준으로 설계된 테이블 6개입니다.

| 테이블명           | 한글명           | 담당자 | 연관 UC    |
| ------------------ | ---------------- | ------ | ---------- |
| `USER_INFO`        | 사용자 정보      | 차유비 | UC-U01~U05 |
| `LAB_INFO`         | 연구실 기준정보  | 정서인 | UC-L01~L17 |
| `TB_CHEMICAL`      | 화학물질 정보    | 김도흠 | UC-C01~C05 |
| `WASTE_REQUEST`    | 폐기물 배출 신청 | 김도흠 | UC-W01~W06 |
| `DAILY_INSPECTION` | 일상점검 결과    | 김민제 | UC-I01~I04 |
| `EDUCATION_COURSE` | 교육과정 정보    | 류아연 | UC-E01~E19 |

---

## 📁 프로젝트 구조

oose_1team/
├── prisma/
│ └── schema.prisma # DB 스키마 (테이블 6개 정의)
├── src/
│ ├── app/
│ │ ├── api/ # Next.js API Routes (백엔드)
│ │ │ └── users/ # 사용자관리 API
│ │ ├── users/ # 사용자 관련 페이지
│ │ └── admin/ # 관리자 페이지
│ ├── lib/
│ │ └── prisma.ts # Prisma 클라이언트 설정
│ └── components/ # 공통 컴포넌트
├── .env # 환경변수 (DB 연결 정보, git 제외)
├── .gitignore
├── package.json
└── README.md

---

## ⚙️ 로컬 개발 환경 세팅

### 1. 레포 클론

```bash
git clone https://github.com/chyubi/OOSE_1TEAM.git
cd OOSE_1TEAM
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경변수 설정

프로젝트 루트에 `.env` 파일 생성 후 DB 연결 정보 입력

```env
DATABASE_URL="postgresql://postgres.[프로젝트ID]:[비밀번호]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

> `.env` 파일은 팀장(차유비)에게 직접 받으세요.

### 4. Prisma 클라이언트 생성

```bash
npx prisma generate
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

---

## 🌿 브랜치 전략

main ← 최종 통합본 (직접 push 금지)
├── chayubi*사용자관리 ← 차유비 작업 브랜치
├── seoin*연구실관리 ← 정서인 작업 브랜치
├── doheum*화학물질관리 ← 김도흠 작업 브랜치
├── ukdong*폐기물관리 ← 김욱동 작업 브랜치
├── minje*점검관리 ← 김민제 작업 브랜치
└── ayeon\_안전교육관리 ← 류아연 작업 브랜치

작업 완료 후 `main` 브랜치로 **Pull Request** 생성 → 팀장 검토 후 merge

---

## 📋 시스템 개요

**한국해양대학교 연구실안전관리시스템** 은 연구실 안전관리 관련 법적 의무사항을 전산화하는 웹 기반 업무지원 시스템입니다.

### 주요 액터

- **관리자** : 사용자 등록 처리, 전반적인 시스템 관리
- **연구실책임자** : 점검결과 확인, 교육이수현황 조회
- **연구실안전관리담당자** : 점검 수행, 폐기물 신청
- **연구활동종사자** : 사용자 등록 신청, 온라인 교육 수강

### 관련 산출물

- PMP (프로젝트관리계획서) v1.1
- SRS (소프트웨어요구사항명세서) v1.0
- SDD (소프트웨어설계명세서) v0.3
- STP (소프트웨어시험계획서) v0.1
- STD (소프트웨어시험설계기술서) v0.1

git add README.md
git commit -m "docs: README 프로젝트 구조 및 세팅 설명 추가"
git push origin 사용자명\_담당구현파트명
