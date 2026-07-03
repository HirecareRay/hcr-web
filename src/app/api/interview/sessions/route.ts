// app/api/interview/sessions/route.ts

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { buildDummySession } from "./dummyQuestions"
import { interviewSessionStartSchema } from "@/features/interview/types/interviewSessionSchema"
import { durationOptionsSec } from "@/features/interview/lib/sessionPlan"

// 요청 바디 검증 — 사용자가 시작 화면에서 고른 설정.
const startRequestSchema = z.object({
  companyId: z.string().min(1),
  jobTitle: z.string().min(1),
  mode: z.enum(["text", "voice"]),
  totalDurationSec: z
    .number()
    .refine((v) => durationOptionsSec.includes(v as (typeof durationOptionsSec)[number]), {
      message: "허용되지 않은 면접 시간입니다",
    }),
})

/**
 * @swagger
 * /api/interview/sessions:
 *   post:
 *     summary: AI 모의 면접 세션 시작 API
 *     description: >
 *       회사/직무/모드/전체 시간을 받아 면접 세션을 시작하고 질문 목록을 반환합니다(현재 더미).
 *       질문 수는 전체 면접 시간에서 환산됩니다.
 *       TODO: 실연결 시 기업 분석 리포트를 면접관 컨텍스트로 주입해 LLM이 질문을 생성합니다.
 *     responses:
 *       200:
 *         description: 세션 시작 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const parsed = startRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "면접 설정이 올바르지 않습니다" },
        { status: 400 }
      )
    }

    // TODO: 백엔드 연결 시 이 줄을 실제 질문 생성 로직으로 교체하세요.
    const session = buildDummySession(parsed.data)

    // 응답이 계약(InterviewSessionStart)을 지키는지 Zod로 검증한 뒤 내려보냅니다.
    const validated = interviewSessionStartSchema.parse(session)

    return NextResponse.json({ success: true, data: validated })
  } catch (error) {
    console.error("면접 세션 시작 실패:", error)
    return NextResponse.json(
      { success: false, error: "면접을 시작하는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
