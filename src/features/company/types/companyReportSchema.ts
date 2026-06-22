/**
 * companyReportSchema.ts
 *
 * 회사 보고서 응답 계약(contract)의 런타임 검증 스키마입니다.
 * `company.ts`의 타입 정의를 Zod로 1:1 미러링한 것으로,
 * 컴파일 타임 타입(company.ts) ↔ 런타임 검증(이 파일)을 함께 강제합니다.
 *
 * 사용처:
 *   - BFF(route.ts): DB/LLM 대신 더미를 응답하기 전, 응답이 계약을 지키는지 parse.
 *     → 나중에 실제 DB·LLM 산출물로 교체해도 이 parse를 통과해야만 응답되므로,
 *       프론트가 기대하는 형태가 깨지면 그 즉시 서버에서 잡힙니다.
 *
 * 파일 맨 아래의 타입 동기화 단언(_AssertSync) 덕분에,
 * company.ts 타입과 이 스키마 중 한쪽만 바뀌면 컴파일 에러가 납니다.
 */

import { z } from "zod"
import type { CompanyReport } from "./company"

// ─── 기업 식별 정보 ───────────────────────────────────────────────────────────
export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  corpCode: z.string(),
  stockCode: z.string().nullable(),
  industry: z.string(),
})

// ─── 기업 개요 (company-crawler) ──────────────────────────────────────────────
export const companyProfileSchema = z.object({
  industry: z.string(),
  companySize: z.string(),
  companyType: z.string(),
  founded: z.string(),
  ceo: z.string(),
  employeeCount: z.string(),
  revenue: z.string(),
  capital: z.string(),
  entrySalary: z.string(),
  address: z.string(),
  mainBusiness: z.string(),
  creditRating: z.string().nullable(),
  insurance: z.array(z.string()),
})

export const companyHistoryEventSchema = z.object({
  year: z.string(),
  month: z.string(),
  events: z.array(z.string()),
})

export const overviewSectionSchema = z.object({
  businessDescription: z.string(),
  mainProductsServices: z.array(z.string()),
  talentValues: z.string().nullable(),
  ceoMessage: z.string().nullable(),
  websiteUrl: z.string().nullable(),
  profile: companyProfileSchema,
  history: z.array(companyHistoryEventSchema),
})

// ─── 재무 분석 (DART 재무지표) ────────────────────────────────────────────────
export const financialIndicatorSchema = z.object({
  label: z.string(),
  value: z.number().nullable(),
  unit: z.string(),
})

export const financialSectionSchema = z.object({
  year: z.string(),
  source: z.string(),
  profitability: z.array(financialIndicatorSchema),
  stability: z.array(financialIndicatorSchema),
  summary: z.string(),
})

// ─── 임직원 현황 (DART 직원현황) ──────────────────────────────────────────────
export const employeeSectionSchema = z.object({
  year: z.string(),
  source: z.string(),
  totalCount: z.number(),
  maleCount: z.number(),
  femaleCount: z.number(),
  avgSalary: z.number().nullable(),
  avgTenureYears: z.number().nullable(),
})

// ─── 평판 / 리뷰 (잡플래닛) ───────────────────────────────────────────────────
export const reviewRatingSchema = z.object({
  label: z.string(),
  score: z.number(),
})

export const reviewScoreSchema = z.object({
  advancement: z.number(),
  compensation: z.number(),
  worklifeBalance: z.number(),
  culture: z.number(),
  management: z.number(),
})

export const reviewItemSchema = z.object({
  id: z.number(),
  rating: z.number(),
  title: z.string(),
  pros: z.string(),
  cons: z.string(),
  occupation: z.string(),
  employStatus: z.string(),
  date: z.string(),
  helpfulCount: z.number(),
  scores: reviewScoreSchema,
})

export const reviewSectionSchema = z.object({
  source: z.string(),
  overallRating: z.number(),
  reviewCount: z.number(),
  ratings: z.array(reviewRatingSchema),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  summary: z.string(),
  reviews: z.array(reviewItemSchema),
})

// ─── 성장성 / 뉴스 (뉴스 파이프라인 *_chosen_articles) ───────────────────────
export const newsItemSchema = z.object({
  id: z.string(),
  articleId: z.string(),
  company: z.string(),
  title: z.string(),
  media: z.string(),
  url: z.string(),
  date: z.string(),
  articleIdx: z.number(),
  articleType: z.string(),
  paragraphStart: z.number(),
  newsCount: z.number(),
  content: z.string(),
})

export const growthSectionSchema = z.object({
  summary: z.string(),
  news: z.array(newsItemSchema),
})

// ─── 채용 정보 (채용공고 크롤링 산출물) ──────────────────────────────────────
export const jobDetailSchema = z.object({
  name: z.string(),
  headcount: z.string(),
  locations: z.array(z.string()),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
  preferred: z.array(z.string()),
})

export const jobQualificationSchema = z.object({
  education: z.string(),
  major: z.string(),
  documents: z.array(z.string()),
})

export const jobWorkConditionsSchema = z.object({
  employmentType: z.string(),
  workType: z.string(),
  salary: z.string(),
  benefits: z.array(z.string()),
  deadline: z.string().nullable(),
  deadlineType: z.string(),
})

export const jobPostingSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  title: z.string(),
  url: z.string(),
  job: jobDetailSchema,
  qualification: jobQualificationSchema,
  process: z.array(z.string()),
  workConditions: jobWorkConditionsSchema,
})

export const hiringSectionSchema = z.object({
  summary: z.string(),
  openings: z.array(jobPostingSchema),
})

// ─── AI 인사이트 (LLM 추론 ②) ────────────────────────────────────────────────
export const swotAnalysisSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  opportunities: z.array(z.string()),
  threats: z.array(z.string()),
})

export const competitorSchema = z.object({
  name: z.string(),
  description: z.string(),
})

export const insightSectionSchema = z.object({
  headline: z.string(),
  keyPoints: z.array(z.string()),
  vision: z.string(),
  industry: z.string(),
  competitors: z.array(competitorSchema),
  swot: swotAnalysisSchema,
})

// ─── 보고서 전체 ──────────────────────────────────────────────────────────────
export const companyReportSchema = z.object({
  company: companySchema,
  overview: overviewSectionSchema,
  financial: financialSectionSchema,
  employees: employeeSectionSchema,
  review: reviewSectionSchema,
  growth: growthSectionSchema,
  hiring: hiringSectionSchema,
  insight: insightSectionSchema,
  generatedAt: z.string(),
})

/**
 * 타입 동기화 단언.
 * company.ts의 CompanyReport와 위 스키마의 추론 타입이 양방향으로 일치하지 않으면
 * 컴파일 에러가 발생합니다. (둘 중 하나만 수정하면 바로 잡힘)
 */
type SchemaReport = z.infer<typeof companyReportSchema>
type _AssertSync = [SchemaReport] extends [CompanyReport]
  ? [CompanyReport] extends [SchemaReport]
    ? true
    : never
  : never
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _assertSync: _AssertSync = true
