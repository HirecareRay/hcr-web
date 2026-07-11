// app/api/interview/sessions/[sessionId]/route.ts
//
// 마이페이지 "AI 면접 기록" 상세 조회 BFF — 쿠키의 토큰을 꺼내 FastAPI
// GET /interviews/sessions/{resultId} 로 중계한다(로그인 사용자 전용, 본인 세션만).
//
// ⚠️ 폴더 슬러그는 형제 라우트(answer·stt)와 이름을 맞추려 [sessionId] 지만,
//    여기 들어오는 값은 목록(history) 항목의 resultId 다(= meta.resultId). 동일 식별자.
//    Next.js 는 같은 위치에서 서로 다른 슬러그 이름을 허용하지 않아 이름을 공유한다.
//
// 응답은 기존 면접 결과 리포트와 동일한 스키마(InterviewResult)라 그대로 재사용한다.
// 남의/없는 세션은 백엔드가 404 로 응답하므로 그대로 전달한다.

import { NextRequest, NextResponse } from "next/server"
import { authCookieName } from "@/features/auth/authCookie"
import { buildDummyInterviewResult } from "../../dummyInterviewResult"

// hcr-backend 서버·DB 폐쇄로 실제 조회 대신 mock 리포트를 반환한다(요청 id를 그대로 반영).
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// import { backendApiUrl } from "../../../auth/proxyAuth"
// import { interviewResultSchema } from "@/features/interview/types/interviewResultSchema"
// import { logger } from "@/lib/logger"
//
// const res = await fetch(
//   `${backendApiUrl}/interviews/sessions/${encodeURIComponent(resultId)}`,
//   {
//     headers: { Authorization: `Bearer ${token}` },
//     signal: AbortSignal.timeout(8000),
//   }
// )
// if (res.status === 401) return NextResponse.json({ success: false, error: "유효하지 않은 토큰입니다" }, { status: 401 })
// if (res.status === 404) return NextResponse.json({ success: false, error: "면접 기록을 찾을 수 없습니다" }, { status: 404 })
// if (!res.ok) { logger.error(...); return NextResponse.json({ success: false, error: "..." }, { status: res.status }) }
// const validated = interviewResultSchema.parse(await res.json())
// return NextResponse.json({ success: true, data: validated })

/**
 * @swagger
 * /api/interview/sessions/{sessionId}:
 *   get:
 *     summary: AI 면접 기록 상세(결과 리포트) 조회 API
 *     description: >
 *       로그인 사용자의 특정 면접 세션 결과를 반환합니다(현재 mock).
 *       응답 형태는 /api/interview/results/{companyId} 와 동일한 InterviewResult 입니다.
 *       경로의 sessionId 는 목록(/api/interview/sessions/history) 각 항목의 resultId 입니다.
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: 세션 결과 식별자 (목록 항목의 resultId)
 *     responses:
 *       200:
 *         description: 상세 조회 성공
 *       400:
 *         description: 잘못된 요청 (resultId 누락)
 *       401:
 *         description: 비로그인
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  // 슬러그는 sessionId 지만 값은 목록 항목의 resultId 다.
  const { sessionId: resultId } = await params

  if (!resultId) {
    return NextResponse.json({ success: false, error: "resultId가 필요합니다" }, { status: 400 })
  }

  const token = req.cookies.get(authCookieName)?.value
  if (!token) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다" }, { status: 401 })
  }

  return NextResponse.json({ success: true, data: buildDummyInterviewResult(resultId) })
}
