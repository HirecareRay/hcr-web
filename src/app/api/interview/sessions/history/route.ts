// app/api/interview/sessions/history/route.ts
//
// 마이페이지 "AI 면접 기록" 목록 조회 BFF — 쿠키의 토큰을 꺼내 FastAPI
// GET /interviews/sessions/history 로 중계한다(로그인 사용자 전용, 본인 세션만).
// 응답의 각 항목 resultId 가 상세(전체 리포트) 조회의 1급 키다.
//
// 기록이 없으면 백엔드가 { items: [], total: 0 } 을 준다(404 아님, 정상 응답).

import { NextRequest, NextResponse } from "next/server"
import { backendApiUrl } from "../../../auth/proxyAuth"
import { authCookieName } from "@/features/auth/authCookie"
import { interviewHistorySchema } from "@/features/interview/types/interviewHistorySchema"
import { logger } from "@/lib/logger"

/**
 * @swagger
 * /api/interview/sessions/history:
 *   get:
 *     summary: AI 면접 기록 목록 조회 API
 *     description: >
 *       로그인 사용자가 진행한 면접 세션들을 최신순으로 요약해 반환합니다.
 *       각 항목의 resultId 로 상세(전체 리포트)를 조회합니다.
 *       기록이 없으면 빈 목록({ items: [], total: 0 })을 반환합니다(404 아님).
 *     responses:
 *       200:
 *         description: 목록 조회 성공
 *       401:
 *         description: 비로그인 또는 토큰 만료·무효
 *       502:
 *         description: 백엔드 서버 연결 실패
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(authCookieName)?.value
  if (!token) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다" }, { status: 401 })
  }

  try {
    const res = await fetch(`${backendApiUrl}/interviews/sessions/history`, {
      headers: { Authorization: `Bearer ${token}` },
      // 백엔드가 멈추면 8초 후 끊어 무한 대기 대신 502 로 떨어지게 한다.
      signal: AbortSignal.timeout(8000),
    })

    if (res.status === 401) {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 토큰입니다" },
        { status: 401 }
      )
    }
    if (!res.ok) {
      logger.error(`면접 기록 목록 조회 실패 ${res.status}`)
      return NextResponse.json(
        { success: false, error: "면접 기록을 불러오는 중 오류가 발생했습니다" },
        { status: res.status }
      )
    }

    // 빈 목록({ items: [], total: 0 })도 계약을 통과하는 정상 응답이다.
    const validated = interviewHistorySchema.parse(await res.json())
    return NextResponse.json({ success: true, data: validated })
  } catch (error) {
    logger.error("면접 기록 목록 조회 실패:", error)
    return NextResponse.json(
      { success: false, error: "백엔드 서버에 연결할 수 없습니다" },
      { status: 502 }
    )
  }
}
