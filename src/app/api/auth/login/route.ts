// app/api/auth/login/route.ts

import { NextRequest } from "next/server"
import { proxyAuth } from "../proxyAuth"

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
  // FastAPI POST /auth/login 으로 중계 — 응답을 { success, data } 로 감싸 반환
  return proxyAuth("/auth/login", body)
}
