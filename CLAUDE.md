# HCR (HireCareRay) — Frontend

채용공고·기업사이트·DART 기반 기업 분석 + AI 모의 면접을 제공하는 원스톱 취업 준비 서비스.

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: lucide-react
- **Utility**: clsx, tailwind-merge (`cn()` in `src/lib/utils.ts`)
- **HTTP**: axios (`src/lib/axiosInstance.ts`)
- **서버 상태**: @tanstack/react-query (`src/lib/queryClient.ts`)
- **폼 + 검증**: react-hook-form + zod + @hookform/resolvers
- **전역 상태**: zustand (각 feature의 `store/` 폴더)
- **Backend**: Flask + SQLite (별도 레포)
- **AI**: LangChain, OpenAI API (GPT-4o mini), Whisper (STT)

## 주요 명령어

```bash
npm run dev          # 개발 서버 (turbopack)
npm run build        # 프로덕션 빌드
npm run type-check   # TypeScript 검사
npm run lint         # ESLint
npm run format       # Prettier 포맷
```

## 코드 컨벤션 (Front-end)

글로벌 룰 대신 아래를 따름:

| 대상 | 규칙 |
|------|------|
| 클래스 | `PascalCase` |
| 변수 | `camelCase` |
| 함수 | `camelCase` |
| 상수 | `camelCase` |
| 파일명 | `camelCase` |

```typescript
// 상수도 camelCase
const maxRetryCount = 3
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

// 컴포넌트는 PascalCase
export function InterviewCard() { ... }

// 파일명: interviewCard.tsx, useCompanySearch.ts, companyService.ts
```

## Git 컨벤션

글로벌 룰 대신 아래를 따름.

**커밋 타입:**
- `feat` : 새로운 기능 추가
- `fix` : 버그 수정
- `docs` : 문서 추가 및 수정
- `style` : 코드 포맷팅, 세미콜론 누락, 오타 수정 등
- `test` : 테스트코드
- `refactor` : 코드 리팩토링
- `chore` : 기타 수정

**커밋 메시지 규칙:**
- 한국어로 작성
- 마침표 붙이지 않음
- 50자를 넘기지 않음
- 명령문으로 작성

```
feat: 회사 검색 페이지 추가

- 회사명 입력 시 자동완성 목록 노출
- 검색 결과 클릭 시 기업 분석 페이지로 이동
```

**브랜치 전략:**
```
main        ← 배포
develop     ← 통합
  feat/front/[feature-name]   ← 기능 개발 (develop에서 분기 → develop에 병합), 영어 kebab-case
  issue/[feature-name]        ← 버그 수정 (develop에서 분기 → develop에 병합), 영어 kebab-case
  hotfix/[feature-name]       ← 배포 후 긴급 수정 (main에서 분기 → main에 병합), 영어 kebab-case
```

**git push 전 반드시 먼저 말할 것.**

## 프로젝트 구조

```
src/
├── app/
│   ├── company/[companyId]/page.tsx    # 기업 분석 리포트
│   ├── interview/[companyId]/page.tsx  # 모의 면접
│   ├── layout.tsx
│   ├── page.tsx                        # 홈 (회사 검색)
│   └── globals.css
├── features/                           # 기능별 모듈
│   ├── auth/
│   │   ├── components/                 # loginForm.tsx
│   │   ├── hooks/                      # useLogin.ts
│   │   ├── services/                   # authService.ts
│   │   ├── store/                      # authStore.ts (zustand)
│   │   └── types/                      # auth.ts (loginSchema + 타입)
│   ├── company/
│   │   ├── components/                 # companyReport.tsx, financialChart.tsx
│   │   ├── hooks/                      # useCompanySearch.ts, useCompanyReport.ts
│   │   ├── services/                   # companyService.ts
│   │   └── types/                      # company.ts
│   └── interview/
│       ├── components/                 # interviewChat.tsx, evaluationCard.tsx
│       ├── hooks/                      # useInterview.ts, useStt.ts
│       ├── services/                   # interviewService.ts
│       └── types/                      # interview.ts
├── components/
│   ├── ui/                             # 범용 UI 부품 (로직 없음)
│   └── layout/
│       └── header.tsx
├── constants/
│   ├── routes.ts
│   └── api.ts
├── types/
│   └── api.ts                          # 공용 타입 (ApiResponse<T>)
└── lib/
    └── utils.ts
```

## 레이어 원칙

```
components/ui/          ← 생김새만 (props만 받음, 어디서나 재사용)
        ↓ 조합
features/*/components/  ← 같은 feature의 hook 사용
        ↓ 배치
app/page.tsx            ← import + return만 (코드 작성 금지)
```

**`app/` 규칙 — 반드시 준수:**
- `app/` 안 파일에는 로직, 상태, API 호출 작성 금지
- `features/`에서 만든 컴포넌트를 import해서 return만 할 것

```tsx
// ✅ 올바른 app/company/[companyId]/page.tsx
import { CompanyReport } from "@/features/company/components/companyReport"

export default function CompanyPage({ params }: { params: { companyId: string } }) {
  return <CompanyReport companyId={params.companyId} />
}

// ❌ 금지 — app/ 안에서 직접 로직 작성
export default function CompanyPage({ params }) {
  const [data, setData] = useState(...)  // 금지
  useEffect(() => { fetch(...) }, [])    // 금지
  return <div>{data.name}</div>
}
```

새 기능 추가 시: `features/[기능명]/{components,hooks,services,types}` 4개 폴더로 구성.

## 핵심 기능 흐름

```
회사명 입력 → AI 기업 분석 리포트 (재무·문화·성장·예상질문)
                    ↓ 분석 데이터가 면접관 컨텍스트로 주입
            AI 모의 면접 (음성 STT 또는 텍스트 → 실시간 평가 SSE)
```

## 백엔드 연동

- Flask API (별도 레포)
- 실시간 평가는 SSE(Server-Sent Events) 스트리밍
- STT: 브라우저 MediaRecorder → 오디오 파일 → Flask → Whisper API
