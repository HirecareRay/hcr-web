/**
 * company.ts
 *
 * 회사 분석 보고서의 데이터 타입 정의입니다.
 * 이 타입은 백엔드 API(`/api/companies/[id]/report`)의 응답 contract이기도 합니다.
 *
 * 각 섹션의 필드 출처:
 *   - overview  ← 회사 크롤링(company-crawler)  [실제 데이터 형태 확인됨]
 *   - financial ← DART 재무지표                  [실제 데이터 형태 확인됨]
 *   - employees ← DART 직원현황                  [실제 데이터 형태 확인됨]
 *   - growth    ← 뉴스 크롤링                     [⚠️ 잠정 — 팀원 보유, 실제 형태 미확인]
 *   - hiring    ← 채용공고 크롤링(jobkorea)        [⚠️ 잠정 — 팀원 보유, 실제 형태 미확인]
 *
 * 현재 백엔드는 DB 대신 더미 데이터를 응답합니다.
 * overview/financial/employees는 실제 데이터 모양에 맞춰 두었으므로 DB 연결 시 프론트를 거의 안 고쳐도 됩니다.
 * 반면 growth/hiring은 아직 실제 데이터(뉴스·채용)를 보지 못해 추정한 잠정 구조이며,
 * 팀원의 실제 데이터 형태가 확인되면 이 타입과 해당 섹션 컴포넌트를 함께 맞춰야 합니다.
 */

export interface Company {
  id: string
  name: string
  corpCode: string
  stockCode: string | null
}

export interface CompanyReport {
  company: Company
  overview: OverviewSection
  financial: FinancialSection
  employees: EmployeeSection
  growth: GrowthSection
  hiring: HiringSection
  generatedAt: string
}

// 참고: 예상 면접질문은 LLM 생성물이라 회사 보고서 계약에서 제외했습니다.
//       이후 features/interview 슬라이스에서 별도 엔드포인트로 생성/조회합니다.

// ─── 기업 개요 (company-crawler) ──────────────────────────────────────────────
export interface OverviewSection {
  businessDescription: string
  mainProductsServices: string[]
  talentValues: string | null
  ceoMessage: string | null
  websiteUrl: string | null
}

// ─── 재무 분석 (DART 재무지표) ────────────────────────────────────────────────
export interface FinancialIndicator {
  label: string
  value: number | null
  unit: string
}

export interface FinancialSection {
  year: string
  source: string
  profitability: FinancialIndicator[]
  stability: FinancialIndicator[]
  summary: string
}

// ─── 임직원 현황 (DART 직원현황) ──────────────────────────────────────────────
export interface EmployeeSection {
  year: string
  source: string
  totalCount: number
  maleCount: number
  femaleCount: number
  avgSalary: number | null
  avgTenureYears: number | null
}

// ─── 성장성 / 뉴스 (뉴스 크롤링) ⚠️ 잠정 구조 — 실제 데이터 확인 후 조정 필요 ───
export interface NewsItem {
  title: string
  url: string
  publishedAt: string
  source: string
}

export interface GrowthSection {
  summary: string
  news: NewsItem[]
}

// ─── 채용 정보 (채용공고 크롤링) ⚠️ 잠정 구조 — 실제 데이터 확인 후 조정 필요 ───
export interface JobPosting {
  title: string
  url: string
  employmentType: string
  experienceLevel: string
  location: string
  deadline: string
}

export interface HiringSection {
  summary: string
  openings: JobPosting[]
}
