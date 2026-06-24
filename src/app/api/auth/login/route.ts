// app/api/auth/login/route.ts

import { NextRequest } from "next/server"
import { proxyAuth } from "../proxyAuth"

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     description: 이메일·비밀번호로 로그인한다. 성공 시 JWT를 httpOnly 쿠키(hcr_token)로 발급한다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: 로그인 성공 (Set-Cookie 로 hcr_token 발급)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: 이메일 또는 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorResponse'
 *       502:
 *         description: 백엔드 서버 연결 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorResponse'
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  // FastAPI POST /auth/login 으로 중계 — 응답을 { success, data } 로 감싸 반환
  return proxyAuth("/auth/login", body)
}
