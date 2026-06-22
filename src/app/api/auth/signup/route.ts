import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 회원가입 성공 및 토큰 반환
 *       409:
 *         description: 이미 가입된 이메일
 *       500:
 *         description: 서버 오류
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    logger.api("POST", "/api/auth/signup", body)

    return NextResponse.json(
      {
        success: true,
        data: {
          token: "temp-dev-token",
          user: {
            id: "1",
            name: body.name ?? "신규유저",
            email: body.email ?? "new@example.com",
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error("POST /api/auth/signup 실패", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}
