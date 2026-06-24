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
 *               remember:
 *                 type: boolean
 *                 description: 로그인 상태 유지. true 면 지속 쿠키(1일), false/생략 시 세션 쿠키
 *                 default: false
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
  // remember 는 쿠키 수명 결정용 — 백엔드엔 보내지 않고 분리한다.
  const { remember, ...credentials } = await req.json()
  // FastAPI POST /auth/login 으로 중계 — 응답을 { success, data } 로 감싸 반환
  return proxyAuth("/auth/login", credentials, Boolean(remember))
}
