// app/api/interview/sessions/history/route.ts
//
// 마이페이지 "AI 면접 기록" 목록 조회 BFF — 쿠키의 토큰을 꺼내 FastAPI
// GET /interviews/sessions/history 로 중계한다(로그인 사용자 전용, 본인 세션만).
// 응답의 각 항목 resultId 가 상세(전체 리포트) 조회의 1급 키다.
//
// 기록이 없으면 백엔드가 { items: [], total: 0 } 을 준다(404 아님, 정상 응답).

import { NextRequest, NextResponse } from "next/server"
import { authCookieName } from "@/features/auth/authCookie"
import { buildDummyInterviewHistory } from "../../dummyInterviewResult"

// hcr-backend 서버·DB 폐쇄로 실제 조회 대신 mock 목록을 반환한다.
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// import { backendApiUrl } from "../../../auth/proxyAuth"
// import { interviewHistorySchema } from "@/features/interview/types/interviewHistorySchema"
// import { logger } from "@/lib/logger"
//
// const res = await fetch(`${backendApiUrl}/interviews/sessions/history`, {
//   headers: { Authorization: `Bearer ${token}` },
//   signal: AbortSignal.timeout(8000),
// })
// if (res.status === 401) return NextResponse.json({ success: false, error: "유효하지 않은 토큰입니다" }, { status: 401 })
// if (!res.ok) { logger.error(...); return NextResponse.json({ success: false, error: "..." }, { status: res.status }) }
// const validated = interviewHistorySchema.parse(await res.json())
// return NextResponse.json({ success: true, data: validated })

/**
 * @swagger
 * /api/interview/sessions/history:
 *   get:
 *     summary: AI 면접 기록 목록 조회 API
 *     description: >
 *       로그인 사용자가 진행한 면접 세션들을 최신순으로 요약해 반환합니다(현재 mock).
 *       각 항목의 resultId 로 상세(전체 리포트)를 조회합니다.
 *     responses:
 *       200:
 *         description: 목록 조회 성공
 *       401:
 *         description: 비로그인
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(authCookieName)?.value
  if (!token) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다" }, { status: 401 })
  }

  return NextResponse.json({ success: true, data: buildDummyInterviewHistory() })
}
