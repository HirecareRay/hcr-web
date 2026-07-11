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

// hcr-backend 서버·DB 폐쇄로 인한 mock 고정 로그인 정보.
// MariaDB users 테이블 id=4(실제 email: 2@2.com, name: 김취준) 기준이며,
// 노출용 이메일만 요청대로 hcr@hcr.com 으로 대체했다.
export const MOCK_AUTH_TOKEN = "mock-hcr-token-4"
export const MOCK_AUTH_USER = { id: "4", name: "김취준", email: "hcr@hcr.com" }

// 백엔드 인증 호출 결과 — 성공 시 {token,user}, 실패 시 상태코드+메시지.
// NextResponse 를 만들지 않아 JSON 응답(login/signup)과 리다이렉트 응답(소셜 콜백)이 함께 재사용한다.
export type BackendAuthResult =
  | { ok: true; data: BackendAuthResponse }
  | { ok: false; status: number; message: string }

/**
 * 인증 요청을 FastAPI 로 중계하고 결과만 돌려준다(응답 형태는 호출측이 결정).
 * 이메일 로그인·회원가입(JSON)과 소셜 콜백(리다이렉트) 양쪽이 공유한다.
 *
 * @param path  백엔드 경로 (예: "/auth/login", "/auth/social/kakao")
 * @param body  백엔드로 보낼 인증 정보 (email/password 또는 {code} 등)
 */
export async function callBackendAuth(path: string, body: unknown): Promise<BackendAuthResult> {
  // hcr-backend 서버·DB 폐쇄로 실제 인증 호출을 막고 항상 mock 로그인 성공으로 처리한다.
  // 로그인·회원가입·소셜 콜백 세 진입점이 모두 이 함수를 거치므로 여기 한 곳만 바꾸면 셋 다 mock 된다.
  // 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
  //
  // try {
  //   const res = await fetch(`${backendApiUrl}${path}`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(body),
  //     signal: AbortSignal.timeout(8000),
  //   })
  //   const payload = (await res.json().catch(() => null)) as
  //     | BackendAuthResponse
  //     | { detail?: string }
  //     | null
  //   if (!res.ok) {
  //     const message = (payload && "detail" in payload && payload.detail) || "인증에 실패했습니다"
  //     logger.error(`프록시 실패 ${res.status} ${path}`, payload)
  //     return { ok: false, status: res.status, message }
  //   }
  //   return { ok: true, data: payload as BackendAuthResponse }
  // } catch (error) {
  //   logger.error(`백엔드 연결 실패 ${path}`, error)
  //   return { ok: false, status: 502, message: "백엔드 서버에 연결할 수 없습니다" }
  // }

  logger.api("POST", path, body)
  return { ok: true, data: { token: MOCK_AUTH_TOKEN, user: MOCK_AUTH_USER } }
}

/**
 * 응답에 토큰을 httpOnly 세션 쿠키로 심는다(XSS 안전, 창 닫으면 로그아웃).
 * JSON 응답·리다이렉트 응답 어디에나 붙일 수 있다.
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(authCookieName, token, authCookieOptions)
}

/**
 * 인증 요청을 FastAPI 로 중계하고, 프론트 계약 { success, data } 로 감싸 응답한다.
 * 성공 시 토큰을 httpOnly 쿠키로 심는다. (이메일 로그인·회원가입 route 전용)
 *
 * @param path  백엔드 경로 (예: "/auth/login", "/auth/signup")
 * @param body  백엔드로 보낼 인증 정보 (email/password 등)
 */
export async function proxyAuth(path: string, body: unknown): Promise<NextResponse> {
  const result = await callBackendAuth(path, body)

  if (!result.ok) {
    return NextResponse.json({ success: false, message: result.message }, { status: result.status })
  }

  const response = NextResponse.json({ success: true, data: result.data })
  setAuthCookie(response, result.data.token)
  return response
}
