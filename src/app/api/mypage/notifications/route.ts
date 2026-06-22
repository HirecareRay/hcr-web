import { NextRequest, NextResponse } from "next/server"

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
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      newJob: true,
      deadline: true,
      report: false,
      interview: true,
      marketing: false,
    },
  })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({ success: true, data: body })
}
