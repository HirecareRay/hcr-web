import { NextRequest, NextResponse } from "next/server"

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
 */
export async function POST(req: NextRequest) {
  const body = await req.json()

  return NextResponse.json({
    success: true,
    data: {
      token: "temp-dev-token",
      user: {
        id: "1",
        name: body.name ?? "신규유저",
        email: body.email ?? "new@example.com",
      },
    },
  })
}
