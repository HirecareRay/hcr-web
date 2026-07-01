// app/api/home/feed/route.ts
//
// 홈(메인) 피드 BFF.
// - trending(인기기업 순위): AI 백엔드(GET /rankings/trending) 실데이터.
//   응답은 래퍼 없는 TrendingCompany[] 배열(이미 camelCase)이며 인증 불필요(공개 홈).
// - techStack·issues: 아직 더미(buildDummyFeed).
//
// 홈은 공개 페이지라 백엔드가 죽어도 화면이 깨지면 안 된다.
// trending 호출이 실패/타임아웃/검증 실패하면 502 대신 더미 trending으로 폴백해
// 홈 전체가 더미로 graceful degrade 되게 한다(실패 사유는 logger로만 남김).

import { NextResponse } from "next/server"
import { z } from "zod"
import { buildDummyFeed } from "./dummyFeed"
import { backendApiUrl } from "../../auth/proxyAuth"
import { homeFeedSchema, trendingCompanySchema } from "@/features/home/types/homeSchema"
import type { TrendingCompany } from "@/features/home/types/home"
import { logger } from "@/lib/logger"

const trendingListSchema = z.array(trendingCompanySchema)

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
 * @swagger
 * /api/home/feed:
 *   get:
 *     summary: 홈 피드 조회 API
 *     description: >
 *       메인 화면의 트렌딩 채용공고·기술 스택 랭킹·기업 이슈 브리핑을 한 번에 반환합니다.
 *       trending(인기기업 순위)은 AI 백엔드 실데이터이며, 백엔드 장애 시 더미로 폴백합니다.
 *       techStack·issues는 현재 더미 데이터 응답입니다.
 *     responses:
 *       200:
 *         description: 피드 조회 성공 (백엔드 장애 시에도 더미로 graceful degrade)
 *       500:
 *         description: 서버 오류
 */
export async function GET() {
  try {
    const now = new Date().toISOString()
    const backendTrending = await fetchBackendTrending(5)

    if (!backendTrending) {
      // 백엔드 장애 — 더미 trending으로 폴백(홈 전체가 더미로 정상 렌더).
      const fallback = homeFeedSchema.parse(buildDummyFeed(now))
      return NextResponse.json({ success: true, data: fallback })
    }

    // 실데이터 trending을 더미 피드 위에 덮어쓴다(techStack·issues는 더미 유지).
    const feed = { ...buildDummyFeed(now), trending: backendTrending }

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
