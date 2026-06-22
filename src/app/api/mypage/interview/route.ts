import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/mypage/interview:
 *   get:
 *     summary: AI 면접 기록 목록
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 면접 기록 목록
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      {
        id: "1",
        companyName: "CJ ENM",
        jobName: "Data Scientist",
        date: "2026.06.10",
        score: 82,
        feedback: "논리적 답변 구성이 우수하나 구체적 수치 활용이 부족합니다.",
      },
      {
        id: "2",
        companyName: "CJ ENM",
        jobName: "Web/App Lead",
        date: "2026.06.03",
        score: 76,
        feedback: "기술 역량은 충분하나 리더십 경험 어필이 아쉽습니다.",
      },
    ],
  })
}
