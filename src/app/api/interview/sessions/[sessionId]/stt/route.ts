// app/api/interview/sessions/[sessionId]/stt/route.ts

import { NextRequest, NextResponse } from "next/server"
import { sttResultSchema } from "@/features/interview/types/interviewSessionSchema"

// 더미 전사문 — 음성 모드 데모용. 사용자가 제출 전 답변 박스에서 수정할 수 있습니다.
// TODO: 실연결 시 실제 전사 결과로 교체하세요.
const dummyTranscript =
  "안녕하세요. 저는 맡은 일은 끝까지 책임지는 성격이고, 팀과 적극적으로 소통하며 문제를 해결해 왔습니다. 이 직무에서도 그런 강점을 발휘하고 싶습니다."

/**
 * @swagger
 * /api/interview/sessions/{sessionId}/stt:
 *   post:
 *     summary: 음성 답변 전사(STT) API
 *     description: >
 *       녹음된 오디오를 받아 전사 텍스트를 반환합니다(현재 더미).
 *       음성 모드에서 사용자가 말한 답변을 텍스트로 바꾸는 단계입니다.
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 전사 성공
 *       400:
 *         description: 오디오 누락
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

    // 오디오 첨부 검증 (실연결 시 이 audio를 Whisper로 전달).
    const form = await req.formData().catch(() => null)
    const audio = form?.get("audio")

    if (!audio || typeof audio === "string") {
      return NextResponse.json({ success: false, error: "오디오가 필요합니다" }, { status: 400 })
    }

    // TODO: 백엔드 연결 시 이 줄을 실제 STT 결과로 교체하세요.
    const validated = sttResultSchema.parse({ transcript: dummyTranscript })

    return NextResponse.json({ success: true, data: validated })
  } catch (error) {
    console.error("음성 전사 실패:", error)
    return NextResponse.json(
      { success: false, error: "음성을 전사하는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
