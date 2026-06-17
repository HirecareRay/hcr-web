// app/api/login/route.ts

import { NextRequest, NextResponse } from "next/server"
// import bcrypt from "bcrypt";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인 API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       401:
 *         description: 로그인 실패
 */

export async function POST(req: NextRequest) {
  const body = await req.json()

  return NextResponse.json({
    success: true,
    data: {
      token: "temp-dev-token",
      user: {
        id: "1",
        name: "테스트유저",
        email: body.email ?? "test@example.com",
      },
    },
  })
}
