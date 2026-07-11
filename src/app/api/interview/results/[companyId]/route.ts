// app/api/interview/results/[companyId]/route.ts
//
// AI 모의 면접 결과 리포트 조회 BFF — 쿠키의 토큰을 꺼내 FastAPI
// GET /interviews/results/{companyId} 로 중계한다(로그인 사용자 전용).
// 결과는 회사가 아니라 "세션" 단위이므로, 백엔드는 그 유저의 해당 회사 최신
// 세션을 돌려주고 응답의 meta.resultId 가 1급 식별자다.
//
// 백엔드 응답(InterviewResult)을 계약(zod)으로 검증한 뒤 { success, data } 로 감싼다.
// replay(다시보기)는 계약에서 제외됐다(녹화 인프라 미존재 — 가짜로 채우지 않음).

import { NextRequest, NextResponse } from "next/server"
import { authCookieName } from "@/features/auth/authCookie"
import { buildDummyInterviewResult, MOCK_RESULT_ID } from "../../dummyInterviewResult"

// hcr-backend 서버·DB 폐쇄로 실제 조회 대신 mock 리포트를 반환한다.
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// import { backendApiUrl } from "../../../auth/proxyAuth"
// import { interviewResultSchema } from "@/features/interview/types/interviewResultSchema"
// import { logger } from "@/lib/logger"
//
// const res = await fetch(
//   `${backendApiUrl}/interviews/results/${encodeURIComponent(companyId)}`,
//   {
//     headers: { Authorization: `Bearer ${token}` },
//     signal: AbortSignal.timeout(8000),
//   }
// )
// if (res.status === 401) return NextResponse.json({ success: false, error: "유효하지 않은 토큰입니다" }, { status: 401 })
// if (res.status === 404) return NextResponse.json({ success: false, error: "아직 면접 결과가 없습니다" }, { status: 404 })
// if (!res.ok) { logger.error(...); return NextResponse.json({ success: false, error: "..." }, { status: res.status }) }
// const validated = interviewResultSchema.parse(await res.json())
// return NextResponse.json({ success: true, data: validated })

/**
 * @swagger
 * /api/interview/results/{companyId}:
 *   get:
 *     summary: AI 모의 면접 결과 리포트 조회 API
 *     description: >
 *       로그인 사용자의 해당 회사 최신 면접 세션 결과를 반환합니다(현재 mock).
 *       표정·음성·답변 멀티모달 피드백, 강점·약점·보완점, 질답 스크립트,
 *       회사/직무 추천 질문, 이전 연습과의 차이를 포함합니다.
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: 회사 식별자
 *     responses:
 *       200:
 *         description: 결과 조회 성공
 *       400:
 *         description: 잘못된 요청 (companyId 누락)
 *       401:
 *         description: 비로그인
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const { companyId } = await params

  if (!companyId) {
    return NextResponse.json({ success: false, error: "companyId가 필요합니다" }, { status: 400 })
  }

  const token = req.cookies.get(authCookieName)?.value
  if (!token) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다" }, { status: 401 })
  }

  return NextResponse.json({
    success: true,
    data: buildDummyInterviewResult(MOCK_RESULT_ID, companyId),
  })
}
