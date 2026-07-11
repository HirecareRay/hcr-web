// app/api/auth/me/route.ts
//
// 현재 로그인 사용자 조회 — 쿠키의 토큰을 꺼내 FastAPI GET /auth/me 로 검증한다.
// 앱 로드 시 "이 토큰이 아직 유효한가"를 확인해 유저 정보를 복원하는 용도.
// 토큰이 없거나(비로그인) 백엔드가 거부하면 401 을 돌려준다.

import { NextRequest, NextResponse } from "next/server"
import { MOCK_AUTH_TOKEN, MOCK_AUTH_USER } from "../proxyAuth"
import { authCookieName } from "@/features/auth/authCookie"
import { logger } from "@/lib/logger"

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 현재 로그인 사용자 조회
 *     tags: [Auth]
 *     description: httpOnly 쿠키(hcr_token)의 토큰을 검증해 로그인 사용자를 반환한다. 앱 로드 시 로그인 상태 복원에 사용한다.
 *     responses:
 *       200:
 *         description: 로그인 사용자 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthUserResponse'
 *       401:
 *         description: 비로그인 또는 토큰 만료·무효
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
export async function GET(req: NextRequest) {
  const token = req.cookies.get(authCookieName)?.value
  if (!token) {
    return NextResponse.json({ success: false, message: "로그인이 필요합니다" }, { status: 401 })
  }

  // try {
  //   const res = await fetch(`${backendApiUrl}/auth/me`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })

  //   if (!res.ok) {
  //     // 토큰 만료·위조 등 — 비로그인으로 처리
  //     return NextResponse.json(
  //       { success: false, message: "유효하지 않은 토큰입니다" },
  //       { status: 401 }
  //     )
  //   }

  //   const user = await res.json()
  //   return NextResponse.json({ success: true, data: user })
  // } catch (error) {
  //   logger.error("GET /api/auth/me 실패", error)
  //   return NextResponse.json(
  //     { success: false, message: "백엔드 서버에 연결할 수 없습니다" },
  //     { status: 502 }
  //   )
  // }

  // hcr-backend 서버·DB 폐쇄로 위 로직 대신 mock 로그인(proxyAuth)이 심은 토큰인지만 확인한다.
  // 그 외(구 토큰·조작값)는 비로그인 처리.
  logger.api("GET", "/api/auth/me")
  if (token !== MOCK_AUTH_TOKEN) {
    return NextResponse.json(
      { success: false, message: "유효하지 않은 토큰입니다" },
      { status: 401 }
    )
  }

  return NextResponse.json({ success: true, data: MOCK_AUTH_USER })
}
