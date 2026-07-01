// app/api/home/feed/route.ts
//
// 홈(메인) 피드 BFF. 세 섹션을 각기 다른 AI 백엔드 엔드포인트에서 모아 한 번에 내려준다.
// - trending(인기기업 순위): GET /rankings/trending — 래퍼 없는 TrendingCompany[] 배열.
// - jobsByRole(직군별 채용공고): GET /home/jobs-by-role?roles=&perRole= — { groups: [...] }.
// - issues(기업 이슈 브리핑): GET /home/news?limit= — { items: [...] }.
// 모두 이미 camelCase 이며 공개 조회(인증 헤더 불필요).
//
// 홈은 공개 페이지라 백엔드가 죽어도 화면이 깨지면 안 된다.
// 각 섹션 호출이 실패/타임아웃/검증 실패하면 502 대신 "그 섹션만" 더미로 폴백한다.
// 세 호출은 서로 독립적이라 한 엔드포인트가 죽어도 나머지는 실데이터를 유지한다
// (섹션별 graceful degrade, 실패 사유는 logger로만 남김).

import { NextResponse } from "next/server"
import { z } from "zod"
import { buildDummyFeed } from "./dummyFeed"
import { backendApiUrl } from "../../auth/proxyAuth"
import {
  homeFeedSchema,
  issueBriefingItemSchema,
  jobRoleGroupSchema,
  trendingCompanySchema,
} from "@/features/home/types/homeSchema"
import type { IssueBriefingItem, JobRoleGroup, TrendingCompany } from "@/features/home/types/home"
import { logger } from "@/lib/logger"

// 홈이 요청하는 직군·직군당 개수·뉴스 개수 (백엔드 GET 쿼리 파라미터 기본값)
const homeRoles = "backend,frontend,ai"
const jobsPerRole = 5
const newsLimit = 10

const trendingListSchema = z.array(trendingCompanySchema)
// jobs-by-role 응답은 { groups: [...] } 래퍼로 온다.
const jobsByRoleResponseSchema = z.object({ groups: z.array(jobRoleGroupSchema) })
// news 응답은 { items: [...] } 래퍼로 온다.
const newsResponseSchema = z.object({ items: z.array(issueBriefingItemSchema) })

/**
 * 인기기업 순위를 AI 백엔드에서 가져온다.
 * 실패(네트워크·타임아웃·비정상 상태·검증 실패) 시 null을 반환해
 * 호출부가 더미로 폴백할 수 있게 한다(예외를 위로 던지지 않음).
 */
async function fetchBackendTrending(limit: number): Promise<TrendingCompany[] | null> {
  try {
    const res = await fetch(`${backendApiUrl}/rankings/trending?limit=${limit}`, {
      // 백엔드가 멈추면 8초 후 끊어 무한 대기 대신 폴백으로 떨어지게 한다.
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      logger.error(`인기기업 순위 조회 실패 ${res.status}`)
      return null
    }

    // 래퍼 없는 배열 응답을 계약(TrendingCompany[])으로 검증한다.
    return trendingListSchema.parse(await res.json())
  } catch (error) {
    logger.error("인기기업 순위 조회 실패:", error)
    return null
  }
}

/**
 * 직군별 채용공고를 AI 백엔드에서 가져온다.
 * 실패 시 null을 반환해 호출부가 더미로 폴백하게 한다.
 * 특정 직군에 공고가 0건이면 백엔드가 `jobs: []`로 그룹을 유지해 내려준다(빈 상태 UI 처리).
 */
async function fetchBackendJobsByRole(
  roles: string,
  perRole: number
): Promise<JobRoleGroup[] | null> {
  try {
    const params = new URLSearchParams({ roles, perRole: String(perRole) })
    const res = await fetch(`${backendApiUrl}/home/jobs-by-role?${params}`, {
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      logger.error(`직군별 채용공고 조회 실패 ${res.status}`)
      return null
    }

    // 정렬(마감임박순·상시 뒤)은 백엔드가 이미 처리 → 프론트 재정렬 없음.
    return jobsByRoleResponseSchema.parse(await res.json()).groups
  } catch (error) {
    logger.error("직군별 채용공고 조회 실패:", error)
    return null
  }
}

/**
 * 기업 이슈 브리핑(뉴스)을 AI 백엔드에서 가져온다.
 * 실패 시 null을 반환해 호출부가 더미로 폴백하게 한다.
 */
async function fetchBackendNews(limit: number): Promise<IssueBriefingItem[] | null> {
  try {
    const res = await fetch(`${backendApiUrl}/home/news?limit=${limit}`, {
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      logger.error(`기업 이슈 브리핑 조회 실패 ${res.status}`)
      return null
    }

    // 최신순 정렬은 백엔드가 이미 처리 → 프론트 재정렬 없음.
    return newsResponseSchema.parse(await res.json()).items
  } catch (error) {
    logger.error("기업 이슈 브리핑 조회 실패:", error)
    return null
  }
}

/**
 * @swagger
 * /api/home/feed:
 *   get:
 *     summary: 홈 피드 조회 API
 *     description: >
 *       메인 화면의 트렌딩 기업·직군별 채용공고·기업 이슈 브리핑을 한 번에 반환합니다.
 *       세 섹션 모두 AI 백엔드 실데이터이며, 각 섹션은 독립적으로 백엔드 장애 시
 *       해당 섹션만 더미로 폴백합니다(섹션별 graceful degrade).
 *     responses:
 *       200:
 *         description: 피드 조회 성공 (백엔드 장애 시에도 섹션별 더미로 graceful degrade)
 *       500:
 *         description: 서버 오류
 */
export async function GET() {
  try {
    const now = new Date().toISOString()
    const dummy = buildDummyFeed(now)

    // 세 섹션을 병렬로 가져온다. 각 호출은 실패 시 null을 반환한다(예외 전파 없음).
    const [trending, jobsByRole, issues] = await Promise.all([
      fetchBackendTrending(5),
      fetchBackendJobsByRole(homeRoles, jobsPerRole),
      fetchBackendNews(newsLimit),
    ])

    // 섹션별 독립 폴백 — 죽은 엔드포인트만 더미로 대체하고 나머지는 실데이터를 유지한다.
    const feed = {
      trending: trending ?? dummy.trending,
      jobsByRole: jobsByRole ?? dummy.jobsByRole,
      issues: issues ?? dummy.issues,
      generatedAt: now,
    }

    // 응답이 계약(HomeFeed)을 지키는지 Zod로 검증한 뒤 내려보낸다.
    const validated = homeFeedSchema.parse(feed)
    return NextResponse.json({ success: true, data: validated })
  } catch (error) {
    logger.error("홈 피드 조회 실패:", error)
    return NextResponse.json(
      { success: false, error: "홈 정보를 불러오는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
