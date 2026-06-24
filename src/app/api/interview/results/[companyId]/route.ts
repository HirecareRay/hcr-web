// app/api/interview/results/[companyId]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { buildDummyResult } from "./dummyResult"
import { interviewResultSchema } from "@/features/interview/types/interviewResultSchema"

// 실제 멀티모달 분석(영상·음성·LLM) 대기를 흉내내기 위한 인위적 지연(ms).
// 프론트의 로딩/스켈레톤 UX를 지금 단계에서 완성하기 위한 장치입니다.
// TODO: 실제 분석 파이프라인 연결 시 이 지연은 제거하세요.
const dummyAnalysisDelayMs = 1500

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * @swagger
 * /api/interview/results/{companyId}:
 *   get:
 *     summary: AI 모의 면접 결과 리포트 조회 API
 *     description: >
 *       한 면접 세션의 결과를 반환합니다 (현재 더미 데이터 응답).
 *       표정·음성·답변 멀티모달 피드백, 강점·약점·보완점, 질답 스크립트,
 *       회사/직무 추천 질문, 면접 다시 보기, 이전 연습과의 차이를 포함합니다.
 *       표정·음성·녹화·세션 비교는 인프라 미존재로 더미이며,
 *       UI에서는 "AI 분석" 추론으로 사실 데이터와 분리해 표시합니다.
 *       결과는 회사가 아니라 세션 단위이므로 응답의 meta.resultId가 1급 식별자입니다.
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
 *       500:
 *         description: 서버 오류
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params

    if (!companyId) {
      return NextResponse.json({ success: false, error: "companyId가 필요합니다" }, { status: 400 })
    }

    // 실제 분석 대기를 흉내내기 위한 지연 (로딩/스켈레톤 UX 확인용).
    await delay(dummyAnalysisDelayMs)

    // TODO: 백엔드(분석 파이프라인) 연결 시 이 줄을 실제 조회 로직으로 교체하세요.
    // 정합성 주의: comparison.deltas[].current 는 overall.score / feedback.*.score 와
    //   같은 값이어야 합니다(스키마로는 자유 배열이라 못 잡으므로 생성 측에서 보장).
    const result = buildDummyResult(companyId)

    // 응답이 계약(InterviewResult)을 지키는지 Zod로 검증한 뒤 내려보냅니다.
    // 나중에 더미를 실제 산출물로 바꿔도, 형태가 깨지면 여기서 바로 잡힙니다.
    const validated = interviewResultSchema.parse(result)

    return NextResponse.json({ success: true, data: validated })
  } catch (error) {
    console.error("면접 결과 조회 실패:", error)
    return NextResponse.json(
      { success: false, error: "면접 결과를 불러오는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
