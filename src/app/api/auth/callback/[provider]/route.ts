// app/api/auth/callback/[provider]/route.ts
//
// 소셜 로그인 OAuth 콜백 — provider 가 인가코드(code)를 붙여 이 경로로 리다이렉트한다.
//   http://localhost:3000/api/auth/callback/{provider}?code=...&state=...
//   (운영: https://hcr-web-brown.vercel.app/api/auth/callback/{provider})
// 이 route 는 서버 사이드라 httpOnly 쿠키를 읽고/심을 수 있다.
//
// 흐름: ①provider 화이트리스트 검증 ②state 대조(CSRF) ③code 를 BFF→FastAPI 로 교환
//       ④성공 시 토큰을 hcr_token 쿠키로 심고 복귀경로(또는 홈)로 302
//       ⑤실패 시 /login?error= 로 302. 어느 경우든 임시 state·redirect 쿠키는 삭제.

import { NextRequest, NextResponse } from "next/server"
import { callBackendAuth, setAuthCookie } from "../../proxyAuth"
import { isSocialProvider } from "@/features/auth/social/providers"
import { oauthStateCookieName, oauthRedirectCookieName } from "@/features/auth/social/oauthState"

// open redirect 방지: 단일 슬래시로 시작하는 내부 경로만 허용(`//`·`/\` 등 외부 URL 거부).
// 클라(socialLogin.ts)·useLogin 과 동일 규칙.
function safeInternalPath(value: string | undefined): string {
  return value && /^\/(?![/\\])/.test(value) ? value : "/"
}

// 로그인 페이지로 에러와 함께 되돌린다. 임시 쿠키도 함께 정리한다.
function redirectToLoginWithError(req: NextRequest, message: string): NextResponse {
  const loginUrl = new URL("/login", req.url)
  loginUrl.searchParams.set("error", message)
  const response = NextResponse.redirect(loginUrl)
  response.cookies.delete(oauthStateCookieName)
  response.cookies.delete(oauthRedirectCookieName)
  return response
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params

  // ① provider 화이트리스트 — 그 외는 404(존재 자체를 숨김)
  if (!isSocialProvider(provider)) {
    return new NextResponse(null, { status: 404 })
  }

  const { searchParams } = req.nextUrl
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error") // provider 가 사용자의 동의 거부 등을 실어 보냄

  // provider 단계에서 실패(동의 거부 등)
  if (error) {
    return redirectToLoginWithError(req, "소셜 로그인이 취소되었습니다")
  }

  if (!code) {
    return redirectToLoginWithError(req, "인가 코드를 받지 못했습니다")
  }

  // ② state 대조(CSRF) — 쿠키 값과 쿼리 값이 정확히 일치해야 함
  const savedState = req.cookies.get(oauthStateCookieName)?.value
  if (!state || !savedState || state !== savedState) {
    return redirectToLoginWithError(req, "잘못된 접근입니다. 다시 시도해주세요")
  }

  // ③ code → 우리 JWT 교환 (BFF → FastAPI POST /auth/social/{provider}).
  //    바디에 code 와 state 를 함께 보낸다 — 네이버는 토큰 교환에 state 가 필수,
  //    카카오·구글은 무시하지만 3사 통일 계약으로 항상 동봉한다.
  const result = await callBackendAuth(`/auth/social/${provider}`, { code, state })
  if (!result.ok) {
    return redirectToLoginWithError(req, result.message)
  }

  // ④ 성공 — 토큰을 httpOnly 쿠키로 심고 복귀경로(또는 홈)로 이동. 임시 쿠키 정리.
  const redirectTo = safeInternalPath(req.cookies.get(oauthRedirectCookieName)?.value)
  const response = NextResponse.redirect(new URL(redirectTo, req.url))
  setAuthCookie(response, result.data.token)
  response.cookies.delete(oauthStateCookieName)
  response.cookies.delete(oauthRedirectCookieName)
  return response
}
