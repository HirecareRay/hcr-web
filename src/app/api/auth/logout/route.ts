// app/api/auth/logout/route.ts
//
// 로그아웃 — 토큰 쿠키를 지운다. 서버 상태(JWT)는 무상태라 쿠키 제거만으로 충분하다.

import { NextResponse } from "next/server"
import { authCookieName } from "@/features/auth/authCookie"

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     description: 토큰 쿠키(hcr_token)를 삭제한다. JWT는 무상태라 쿠키 제거만으로 로그아웃된다.
 *     responses:
 *       200:
 *         description: 로그아웃 성공 (쿠키 삭제)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *               required: [success]
 */
export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(authCookieName)
  return response
}
