/**
 * homeSchema.ts
 *
 * home.ts 계약을 미러링한 Zod 스키마입니다.
 * BFF가 응답 직전 `homeFeedSchema.parse()`로 형태를 검증합니다.
 * 더미를 실데이터로 바꿔도 형태가 깨지면 서버에서 즉시 잡힙니다.
 *
 * 파일 끝의 타입 동기화 단언으로 home.ts와 양방향 일치를 강제합니다.
 */

import { z } from "zod"
import type {
  HomeFeed,
  HomeJobPosting,
  IssueBriefingItem,
  JobRoleGroup,
  TrendingCompany,
} from "./home"

// ─── 오늘 많이 분석된 채용공고 ────────────────────────────────────────────────
export const trendingCompanySchema = z.object({
  rank: z.number().int().positive(),
  companyId: z.string().min(1),
  name: z.string().min(1),
  parentName: z.string(),
  logoText: z.string().min(1),
  logoColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "hex 색상이어야 합니다"),
  logoUrl: z.string().url().nullable(),
})

// ─── 직군별 채용공고 ─────────────────────────────────────────────────────────
export const jobRoleSchema = z.enum(["backend", "frontend", "ai"])

export const homeJobPostingSchema = z.object({
  id: z.string().min(1),
  companyId: z.string().min(1),
  companyName: z.string().min(1),
  title: z.string().min(1),
  jobRole: jobRoleSchema,
  jobRoleLabel: z.string().min(1),
  location: z.string(),
  employmentType: z.string(),
  deadline: z.string().nullable(),
  deadlineType: z.string(),
  // url 은 원본 공고 링크가 없으면 "" 이므로 .url() 검증은 걸지 않습니다.
  url: z.string(),
  tags: z.array(z.string()),
})

export const jobRoleGroupSchema = z.object({
  role: jobRoleSchema,
  label: z.string().min(1),
  jobs: z.array(homeJobPostingSchema),
})

// ─── 기업 이슈 브리핑 ────────────────────────────────────────────────────────
export const issueBriefingItemSchema = z.object({
  id: z.string().min(1),
  companyTag: z.string().min(1),
  headline: z.string().min(1),
  url: z.string().url(),
  publishedAt: z.string(),
})

// ─── 홈 피드 전체 ────────────────────────────────────────────────────────────
export const homeFeedSchema = z.object({
  trending: z.array(trendingCompanySchema),
  jobsByRole: z.array(jobRoleGroupSchema),
  issues: z.array(issueBriefingItemSchema),
  generatedAt: z.string(),
})

/**
 * 타입 동기화 단언.
 * home.ts의 타입과 위 스키마의 추론 타입이 양방향으로 일치하지 않으면
 * 컴파일 에러가 발생합니다. (둘 중 하나만 수정하면 바로 잡힘)
 */
type _AssertTrending = [z.infer<typeof trendingCompanySchema>] extends [TrendingCompany]
  ? [TrendingCompany] extends [z.infer<typeof trendingCompanySchema>]
    ? true
    : never
  : never
type _AssertJobPosting = [z.infer<typeof homeJobPostingSchema>] extends [HomeJobPosting]
  ? [HomeJobPosting] extends [z.infer<typeof homeJobPostingSchema>]
    ? true
    : never
  : never
type _AssertJobGroup = [z.infer<typeof jobRoleGroupSchema>] extends [JobRoleGroup]
  ? [JobRoleGroup] extends [z.infer<typeof jobRoleGroupSchema>]
    ? true
    : never
  : never
type _AssertIssue = [z.infer<typeof issueBriefingItemSchema>] extends [IssueBriefingItem]
  ? [IssueBriefingItem] extends [z.infer<typeof issueBriefingItemSchema>]
    ? true
    : never
  : never
type _AssertFeed = [z.infer<typeof homeFeedSchema>] extends [HomeFeed]
  ? [HomeFeed] extends [z.infer<typeof homeFeedSchema>]
    ? true
    : never
  : never

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _assertSync: [
  _AssertTrending,
  _AssertJobPosting,
  _AssertJobGroup,
  _AssertIssue,
  _AssertFeed,
] = [true, true, true, true, true]
