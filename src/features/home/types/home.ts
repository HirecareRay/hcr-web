/**
 * home.ts
 *
 * 홈(메인) 피드의 응답 계약입니다.
 * BFF(`/api/home/feed`)가 내려주는 전체 형태를 정의합니다.
 *
 * 데이터 출처 (실연결 시 BFF 내부만 교체):
 * - trending : 채용/분석 파이프라인 집계 — 현재 잠정. CJ ENM 1건만 실데이터, 나머지는 더미.
 * - techStack: 분석 리포트 집계 — 현재 더미.
 * - issues   : 뉴스 파이프라인 — 현재 잠정(더미).
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
}

/** 기술 스택 랭킹의 개별 항목 */
export type TechStackRankItem = {
  rank: number
  /** 기술명 (예: Spring Boot). 잠금 항목은 빈 문자열일 수 있음 */
  name: string
  /** 1위 잠금(로그인 유도) 여부 */
  locked: boolean
}

/** 채용담당자가 기대하는 기술 스택 랭킹 카드 */
export type TechStackRanking = {
  /** 질문 문구 (예: 채용담당자가 지원자에게 기대하는 백엔드 기술 스택은?) */
  question: string
  items: TechStackRankItem[]
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
  techStack: TechStackRanking
  issues: IssueBriefingItem[]
  /** 생성 시각 (ISO 8601) */
  generatedAt: string
}
