/**
 * home.ts
 *
 * 홈(메인) 피드의 응답 계약입니다.
 * BFF(`/api/home/feed`)가 내려주는 전체 형태를 정의합니다.
 *
 * 데이터 출처 (실연결 시 BFF 내부만 교체):
 * - trending   : 채용/분석 파이프라인 집계 — 현재 잠정. CJ ENM 1건만 실데이터, 나머지는 더미.
 * - jobsByRole : 백엔드 `GET /home/jobs-by-role` — 직군별 실채용공고. 현재 더미.
 * - issues     : 백엔드 `GET /home/news` — 뉴스 파이프라인. 현재 더미(cjEnmNewsFixtures).
 *
 * 외부 산출물이 snake_case면 BFF에서 camelCase로 변환한 형태로 둡니다.
 */

/** 오늘 많이 분석된 채용공고 카드 (랭킹) */
export type TrendingCompany = {
  rank: number
  /** 리포트 이동 대상 — /company/[companyId] */
  companyId: string
  /** 표시명 (예: 카카오페이) */
  name: string
  /** 부제 / 모회사 (예: 카카오) */
  parentName: string
  /** 로고 원에 들어갈 이니셜 (예: CJ) */
  logoText: string
  /** 로고 원 배경색 (hex) */
  logoColor: string
  /** 회사 로고 URL. 없거나 로드 실패 시 logoText+logoColor 이니셜 원으로 폴백 */
  logoUrl: string | null
}

/**
 * 홈 직군 탭 코드.
 * 백엔드 `jobRole` enum 과 1:1 (백엔드는 `etc`도 반환하지만 홈 카드에는 노출하지 않음).
 */
export type JobRole = "backend" | "frontend" | "ai"

/** 홈 "직군별 채용공고" 카드에 노출하는 공고 1건 (회사 무관 전역 목록) */
export type HomeJobPosting = {
  id: string
  /** 리포트 이동 대상 회사 — /company/[companyId] */
  companyId: string
  companyName: string
  /** 공고 제목 */
  title: string
  jobRole: JobRole
  /** 직군 한글 라벨 (예: 백엔드) */
  jobRoleLabel: string
  /** 근무지 (없으면 "") */
  location: string
  /** 고용형태 (없으면 "") */
  employmentType: string
  /** 마감일 YYYY-MM-DD, 상시채용이면 null */
  deadline: string | null
  /** "fixed_date" | "rolling" */
  deadlineType: string
  /** 원본 공고 링크 (없으면 "") */
  url: string
  /** 기술/키워드 태그 */
  tags: string[]
}

/** 직군별 채용공고 그룹 (홈 탭 1개 = 그룹 1개) */
export type JobRoleGroup = {
  role: JobRole
  /** 탭 라벨 (예: 백엔드) */
  label: string
  jobs: HomeJobPosting[]
}

/** 기업 이슈 브리핑 항목 */
export type IssueBriefingItem = {
  id: string
  /** 기업 태그 (예: 네이버) */
  companyTag: string
  /** 헤드라인 (예: AI 조직 확대 · 클로바 X 고도화 발표) */
  headline: string
  /** 원문 기사 URL (클릭 시 새 탭으로 이동) */
  url: string
  /** 발행일 (ISO 8601, 예: 2026-06-22) */
  publishedAt: string
}

/** 홈 피드 전체 */
export type HomeFeed = {
  trending: TrendingCompany[]
  jobsByRole: JobRoleGroup[]
  issues: IssueBriefingItem[]
  /** 생성 시각 (ISO 8601) */
  generatedAt: string
}
