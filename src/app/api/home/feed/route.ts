// app/api/home/feed/route.ts

import { NextResponse } from "next/server"
import { buildDummyFeed } from "./dummyFeed"
import { homeFeedSchema } from "@/features/home/types/homeSchema"

// 실제 집계/분석 대기를 흉내내기 위한 인위적 지연(ms).
// 홈 로딩/스켈레톤 UX를 지금 단계에서 완성하기 위한 장치입니다.
// TODO: 실제 DB·집계 연결 시 이 지연은 제거하세요.
const dummyFeedDelayMs = 1200

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * @swagger
 * /api/home/feed:
 *   get:
 *     summary: 홈 피드 조회 API
 *     description: >
 *       메인 화면의 트렌딩 채용공고·기술 스택 랭킹·기업 이슈 브리핑을 한 번에 반환합니다.
 *       (현재 더미 데이터 응답 — CJ ENM 항목 일부는 팀 보유 실데이터)
 *     responses:
 *       200:
 *         description: 피드 조회 성공
 *       500:
 *         description: 서버 오류
 */
export async function GET() {
  try {
    // 실제 집계 대기를 흉내내기 위한 지연 (로딩/스켈레톤 UX 확인용).
    await delay(dummyFeedDelayMs)

    // TODO: 백엔드(DB/집계) 연결 시 이 줄을 실제 조회 로직으로 교체하세요.
    const feed = buildDummyFeed(new Date().toISOString())

    // 응답이 계약(HomeFeed)을 지키는지 Zod로 검증한 뒤 내려보냅니다.
    const validated = homeFeedSchema.parse(feed)

    return NextResponse.json({ success: true, data: validated })
  } catch (error) {
    console.error("홈 피드 조회 실패:", error)
    return NextResponse.json(
      { success: false, error: "홈 정보를 불러오는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
