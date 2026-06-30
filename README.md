# HCR (HireCareRay)

채용공고·기업사이트·DART 기반 기업 분석 + AI 모의 면접을 제공하는 원스톱 취업 준비 서비스.

## 기술 스택

| 패키지                                      | 버전   | 용도                                |
| ------------------------------------------- | ------ | ----------------------------------- |
| Next.js                                     | 15     | 프레임워크 (App Router + Turbopack) |
| React                                       | 19     | UI 라이브러리                       |
| TypeScript                                  | 5      | 타입 안전성                         |
| Tailwind CSS                                | 4      | 스타일링                            |
| axios                                       | latest | HTTP 통신                           |
| @tanstack/react-query                       | latest | 서버 상태 관리                      |
| react-hook-form + zod + @hookform/resolvers | latest | 폼 + 검증                           |
| zustand                                     | latest | 전역 상태 (로그인 등)               |
| clsx + tailwind-merge                       | latest | 조건부 클래스 유틸리티 (`cn()`)     |
| lucide-react                                | latest | 아이콘                              |
| Prettier                                    | 3      | 코드 포맷팅                         |

## 개발 명령어

```bash
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run type-check   # TypeScript 타입 검사
npm run lint         # ESLint 검사
npm run format       # Prettier 포맷팅
```

## 폴더 구조

```
src/
├── app/                              # 라우트 (Next.js App Router)
│   ├── login/page.tsx                # 로그인 페이지
│   ├── company/[companyId]/page.tsx  # 기업 분석 리포트 페이지
│   ├── interview/[companyId]/page.tsx# 모의 면접 페이지
│   ├── providers.tsx                 # QueryClientProvider 등 전역 Provider
│   ├── layout.tsx
│   ├── page.tsx                      # 홈 (회사 검색)
│   └── globals.css
│
├── features/                         # 기능별 모듈 (하이브리드 feature-based)
│   ├── auth/
│   │   ├── components/               # loginForm.tsx
│   │   ├── hooks/                    # useLogin.ts
│   │   ├── services/                 # authService.ts
│   │   ├── store/                    # authStore.ts (zustand)
│   │   └── types/                    # auth.ts (schema + 타입)
│   ├── company/
│   │   ├── components/               # companyReport.tsx, financialChart.tsx
│   │   ├── hooks/                    # useCompanySearch.ts, useCompanyReport.ts
│   │   ├── services/                 # companyService.ts
│   │   └── types/                    # company.ts
│   └── interview/
│       ├── components/               # interviewChat.tsx, evaluationCard.tsx
│       ├── hooks/                    # useInterview.ts, useStt.ts
│       ├── services/                 # interviewService.ts
│       └── types/                    # interview.ts
│
├── components/
│   ├── ui/                           # 범용 UI 부품 (Button, Input, Card 등)
│   └── layout/
│       └── header.tsx
│
├── constants/                        # routes.ts, api.ts
├── types/
│   └── api.ts                        # 공용 타입 (ApiResponse<T>)
└── lib/
    └── utils.ts                      # cn() 유틸리티
```

## 레이어 원칙

```
components/ui/          ← 생김새만 (props만 받음, 어디서나 재사용)
        ↓ 조합
features/*/components/  ← 기능 컴포넌트 (같은 feature의 hook 사용)
        ↓ 배치
app/page.tsx            ← import + return만 (코드 작성 금지)
```

**`app/` 규칙:**

- `app/**/page.tsx`: 로직, 상태, API 호출 작성 금지 — `features/`에서 만든 컴포넌트를 import해서 return만 할 것
- `app/api/**/route.ts`: BFF 라우트는 예외로 허용. 단 요청을 FastAPI로 넘기는 **얇은 proxy**만 두고, 데이터 가공·비즈니스 로직은 두지 않는다

```tsx
// ✅ 올바른 예
import { CompanyReport } from "@/features/company/components/companyReport"

export default function CompanyPage({ params }: { params: { companyId: string } }) {
  return <CompanyReport companyId={params.companyId} />
}

// ❌ 금지
export default function CompanyPage({ params }) {
  const [data, setData] = useState(...)  // 금지
  useEffect(() => { fetch(...) }, [])    // 금지
  return <div>{data.name}</div>
}
```

새 기능 추가 시 `features/[기능명]/{components,hooks,services,types}` 4개 폴더로 구성.

## 코드 컨벤션

| 대상               | 규칙         |
| ------------------ | ------------ |
| 컴포넌트 / 클래스  | `PascalCase` |
| 변수 / 함수 / 상수 | `camelCase`  |
| 파일명             | `camelCase`  |

## Git 컨벤션

**브랜치:**

```
feat/front/[feature-name]   # 기능 개발 (develop → develop), 영어 kebab-case
issue/[feature-name]        # 버그 수정 (develop → develop), 영어 kebab-case
hotfix/[feature-name]       # 배포 후 긴급 수정 (main → main), 영어 kebab-case
```

**커밋:** 한국어, 명령문, 50자 이내, 마침표 없음

```
feat: 회사 검색 페이지 추가

- 회사명 입력 시 자동완성 목록 노출
- 검색 결과 클릭 시 기업 분석 페이지로 이동
```
