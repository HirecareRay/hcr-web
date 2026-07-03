import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"

/**
 * @swagger
 * /api/mypage/notifications:
 *   get:
 *     summary: 알림 설정 조회
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 알림 설정 값
 *       500:
 *         description: 서버 오류
 *   put:
 *     summary: 알림 설정 변경
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
 *               newJob:
 *                 type: boolean
 *               deadline:
 *                 type: boolean
 *               report:
 *                 type: boolean
 *               interview:
 *                 type: boolean
 *               marketing:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 설정 변경 성공
 *       500:
 *         description: 서버 오류
 */
export async function GET() {
  try {
    logger.api("GET", "/api/mypage/notifications")
    return NextResponse.json(
      {
        success: true,
        data: {
          newJob: true,
          deadline: true,
          report: false,
          interview: true,
          marketing: false,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error("GET /api/mypage/notifications 실패", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    logger.api("PUT", "/api/mypage/notifications", body)
    return NextResponse.json({ success: true, data: body }, { status: 200 })
  } catch (error) {
    logger.error("PUT /api/mypage/notifications 실패", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}
