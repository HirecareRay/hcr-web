// app/api/auth/proxyAuth.ts
//
// BFF(로그인·회원가입 route)가 FastAPI 인증 엔드포인트로 요청을 중계하는 헬퍼.
// 프론트는 이 BFF만 호출하고 백엔드를 직접 보지 않는다(CLAUDE.md BFF 원칙).
// 브라우저는 같은 출처인 Next 만 호출하므로 CORS 가 걸리지 않는다.
//
// 로그인·회원가입 성공 시 토큰을 httpOnly 쿠키로 심는다(브라우저 JS 가 못 읽음).
// 이후 브라우저 → BFF 요청에 쿠키가 자동으로 실리고, 보호가 필요한 호출은
// BFF 가 쿠키의 토큰을 꺼내 FastAPI 에 Bearer 로 다시 전달한다.

import { NextResponse } from "next/server"
import { authCookieName, authCookieOptions } from "@/features/auth/authCookie"
import { logger } from "@/lib/logger"

// 서버 사이드 전용 env (NEXT_PUBLIC_ 아님 — 브라우저에 노출되지 않는다)
export const backendApiUrl = process.env.BACKEND_API_URL ?? "http://localhost:8000"

interface BackendAuthResponse {
  token: string
  user: { id: string; name: string; email: string }
}

/**
 * 인증 요청을 FastAPI 로 중계하고, 프론트 계약 { success, data } 로 감싸 응답한다.
 * 성공 시 토큰을 httpOnly 쿠키로 심는다.
 *
 * @param path  백엔드 경로 (예: "/auth/login", "/auth/signup")
 * @param body  프론트가 보낸 원본 요청 body (email/password 등)
 */
export async function proxyAuth(path: string, body: unknown): Promise<NextResponse> {
  try {
    const res = await fetch(`${backendApiUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    // FastAPI 응답을 JSON 으로 파싱 (성공: {token,user} / 실패: {detail})
    const payload = (await res.json().catch(() => null)) as
      | BackendAuthResponse
      | { detail?: string }
      | null

    if (!res.ok) {
      // 백엔드의 상태코드(401·409 등)와 detail 메시지를 그대로 전달
      const message = (payload && "detail" in payload && payload.detail) || "인증에 실패했습니다"
      logger.error(`프록시 실패 ${res.status} ${path}`, payload)
      return NextResponse.json({ success: false, message }, { status: res.status })
    }

    const data = payload as BackendAuthResponse
    const response = NextResponse.json({ success: true, data }, { status: res.status })
    // 토큰은 응답 본문이 아니라 httpOnly 쿠키로 보관한다(XSS 안전)
    response.cookies.set(authCookieName, data.token, authCookieOptions)
    return response
  } catch (error) {
    // 백엔드가 꺼져 있거나 네트워크 오류 — 502 로 알린다
    logger.error(`백엔드 연결 실패 ${path}`, error)
    return NextResponse.json(
      { success: false, message: "백엔드 서버에 연결할 수 없습니다" },
      { status: 502 }
    )
  }
}
