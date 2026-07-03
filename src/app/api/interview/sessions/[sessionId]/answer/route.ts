// app/api/interview/sessions/[sessionId]/answer/route.ts

import { NextRequest, NextResponse } from "next/server"
import { buildDummyEvaluation } from "./dummyEvaluation"
import {
  answerSubmissionSchema,
  liveEvaluationSchema,
} from "@/features/interview/types/interviewSessionSchema"

/**
 * @swagger
 * /api/interview/sessions/{sessionId}/answer:
 *   post:
 *     summary: 면접 답변 제출 및 채점 API
 *     description: >
 *       한 질문에 대한 답변을 제출하면 표정·음성·답변 더미 평가를 반환합니다(제출 후 일괄).
 *       표정·음성은 인프라 미존재로 더미이며, 실연결 시 BFF 내부만 교체합니다.
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 채점 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "sessionId가 필요합니다" }, { status: 400 })
    }

    const body = await req.json().catch(() => null)
    const parsed = answerSubmissionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "답변 형식이 올바르지 않습니다" },
        { status: 400 }
      )
    }

    // TODO: 백엔드 연결 시 이 줄을 실제 채점 로직으로 교체하세요.
    const evaluation = buildDummyEvaluation(parsed.data)

    const validated = liveEvaluationSchema.parse(evaluation)

    return NextResponse.json({ success: true, data: validated })
  } catch (error) {
    console.error("답변 채점 실패:", error)
    return NextResponse.json(
      { success: false, error: "답변을 채점하는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
