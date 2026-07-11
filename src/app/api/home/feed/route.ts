// app/api/home/feed/route.ts
//
// 홈(메인) 피드 BFF. 세 섹션을 각기 다른 AI 백엔드 엔드포인트에서 모아 한 번에 내려준다.
// - trending(인기기업 순위): GET /rankings/trending — 래퍼 없는 TrendingCompany[] 배열.
// - jobsByRole(직군별 채용공고): GET /home/jobs-by-role?roles=&perRole= — { groups: [...] }.
// - issues(기업 이슈 브리핑): GET /home/news?limit= — { items: [...] }.
// 모두 이미 camelCase 이며 공개 조회(인증 헤더 불필요).

import { NextResponse } from "next/server"
import { buildDummyFeed } from "./dummyFeed"
import { homeFeedSchema } from "@/features/home/types/homeSchema"
import { logger } from "@/lib/logger"

// hcr-backend 서버·DB 폐쇄로 세 섹션 모두 상시 더미를 반환한다. 원래는 "백엔드 시도 → 실패
// 시 섹션별 더미 폴백" 구조였는데, 백엔드가 영구히 없으니 매 요청마다 8초씩 타임아웃을
// 기다렸다가 폴백되는 문제가 있었다(홈 로딩 지연). 그래서 시도 자체를 생략한다.
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// import { z } from "zod"
// import { backendApiUrl } from "../../auth/proxyAuth"
// import {
//   issueBriefingItemSchema,
//   jobRoleGroupSchema,
//   trendingCompanySchema,
// } from "@/features/home/types/homeSchema"
// import type { IssueBriefingItem, JobRoleGroup, TrendingCompany } from "@/features/home/types/home"
//
// const homeRoles = "backend,frontend,ai"
// const jobsPerRole = 5
// const newsLimit = 10
// const trendingListSchema = z.array(trendingCompanySchema)
// const jobsByRoleResponseSchema = z.object({ groups: z.array(jobRoleGroupSchema) })
// const newsResponseSchema = z.object({ items: z.array(issueBriefingItemSchema) })
//
// async function fetchBackendTrending(limit: number): Promise<TrendingCompany[] | null> {
//   try {
//     const res = await fetch(`${backendApiUrl}/rankings/trending?limit=${limit}`, {
//       signal: AbortSignal.timeout(8000),
//     })
//     if (!res.ok) { logger.error(`인기기업 순위 조회 실패 ${res.status}`); return null }
//     return trendingListSchema.parse(await res.json())
//   } catch (error) {
//     logger.error("인기기업 순위 조회 실패:", error)
//     return null
//   }
// }
//
// async function fetchBackendJobsByRole(roles: string, perRole: number): Promise<JobRoleGroup[] | null> {
//   try {
//     const params = new URLSearchParams({ roles, perRole: String(perRole) })
//     const res = await fetch(`${backendApiUrl}/home/jobs-by-role?${params}`, {
//       signal: AbortSignal.timeout(8000),
//     })
//     if (!res.ok) { logger.error(`직군별 채용공고 조회 실패 ${res.status}`); return null }
//     return jobsByRoleResponseSchema.parse(await res.json()).groups
//   } catch (error) {
//     logger.error("직군별 채용공고 조회 실패:", error)
//     return null
//   }
// }
//
// async function fetchBackendNews(limit: number): Promise<IssueBriefingItem[] | null> {
//   try {
//     const res = await fetch(`${backendApiUrl}/home/news?limit=${limit}`, {
//       signal: AbortSignal.timeout(8000),
//     })
//     if (!res.ok) { logger.error(`기업 이슈 브리핑 조회 실패 ${res.status}`); return null }
//     return newsResponseSchema.parse(await res.json()).items
//   } catch (error) {
//     logger.error("기업 이슈 브리핑 조회 실패:", error)
//     return null
//   }
// }
//
// export async function GET() {
//   try {
//     const now = new Date().toISOString()
//     const dummy = buildDummyFeed(now)
//     const [trending, jobsByRole, issues] = await Promise.all([
//       fetchBackendTrending(5),
//       fetchBackendJobsByRole(homeRoles, jobsPerRole),
//       fetchBackendNews(newsLimit),
//     ])
//     const feed = {
//       trending: trending ?? dummy.trending,
//       jobsByRole: jobsByRole ?? dummy.jobsByRole,
//       issues: issues ?? dummy.issues,
//       generatedAt: now,
//     }
//     const validated = homeFeedSchema.parse(feed)
//     return NextResponse.json({ success: true, data: validated })
//   } catch (error) {
//     logger.error("홈 피드 조회 실패:", error)
//     return NextResponse.json(
//       { success: false, error: "홈 정보를 불러오는 중 오류가 발생했습니다" },
//       { status: 500 }
//     )
//   }
// }

/**
 * @swagger
 * /api/home/feed:
 *   get:
 *     summary: 홈 피드 조회 API
 *     description: >
 *       메인 화면의 트렌딩 기업·직군별 채용공고·기업 이슈 브리핑을 한 번에 반환합니다(현재 mock).
 *     responses:
 *       200:
 *         description: 피드 조회 성공
 *       500:
 *         description: 서버 오류
 */
export async function GET() {
  try {
    const now = new Date().toISOString()
    const validated = homeFeedSchema.parse(buildDummyFeed(now))
    return NextResponse.json({ success: true, data: validated })
  } catch (error) {
    logger.error("홈 피드 조회 실패:", error)
    return NextResponse.json(
      { success: false, error: "홈 정보를 불러오는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
