import { NextRequest } from "next/server"
import { proxyAuth } from "../proxyAuth"

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     description: 회원가입 후 자동 로그인된다. 성공 시 JWT를 httpOnly 쿠키(hcr_token)로 발급한다.
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
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: 회원가입 성공 (Set-Cookie 로 hcr_token 발급)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       409:
 *         description: 이미 가입된 이메일
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
  // FastAPI POST /auth/signup 으로 중계 — 응답을 { success, data } 로 감싸 반환
  return proxyAuth("/auth/signup", body)
}
