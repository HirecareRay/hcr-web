import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"

/**
 * @swagger
 * /api/mypage/profile:
 *   get:
 *     summary: 내 프로필 조회
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 프로필 정보
 *       500:
 *         description: 서버 오류
 *   put:
 *     summary: 프로필 수정
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               companySize:
 *                 type: array
 *                 items:
 *                   type: string
 *               careerLevel:
 *                 type: array
 *                 items:
 *                   type: string
 *               interestJobs:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 *       500:
 *         description: 서버 오류
 */
export async function GET() {
  try {
    logger.api("GET", "/api/mypage/profile")
    return NextResponse.json(
      {
        success: true,
        data: {
          id: "1",
          name: "김취준",
          email: "getajob@example.com",
          companySize: ["스타트업"],
          careerLevel: ["신입"],
          interestJobs: ["프론트엔드"],
          completionRate: 65,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error("GET /api/mypage/profile 실패", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    logger.api("PUT", "/api/mypage/profile", body)
    return NextResponse.json({ success: true, data: { ...body } }, { status: 200 })
  } catch (error) {
    logger.error("PUT /api/mypage/profile 실패", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}
