import { NextRequest } from "next/server"
import { proxyAuth } from "../proxyAuth"

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
  const body = await req.json()
  // FastAPI POST /auth/signup 으로 중계 — 응답을 { success, data } 로 감싸 반환
  return proxyAuth("/auth/signup", body)
}
