// 소셜 로그인 시작 로직 — 소셜 버튼 클릭 시 실행되는 클라이언트 유틸.
// (컴포넌트가 아니라 유틸이므로 "use client" 불필요 — 반드시 클라 이벤트 핸들러에서만 호출한다.)
//
// 하는 일: ①CSRF state 난수 생성 ②state·복귀경로를 쿠키로 저장 ③provider 인가 URL 조립 ④이동.
// 콜백(/api/auth/callback/{provider})이 쿠키 state 와 쿼리 state 를 대조한다.

import { socialProviders, type SocialProvider } from "./providers"
import {
  oauthStateCookieName,
  oauthRedirectCookieName,
  oauthCookieMaxAgeSeconds,
} from "./oauthState"

// open redirect 방지: 단일 슬래시로 시작하는 내부 경로만 허용(`//`·`/\` 등 외부 URL 거부).
// useLogin 의 safeRedirect 규칙과 동일하게 맞춘다.
function readSafeRedirect(): string {
  const redirect = new URLSearchParams(window.location.search).get("redirect")
  return redirect && /^\/(?![/\\])/.test(redirect) ? redirect : "/"
}

// 대조용 난수 state. crypto.randomUUID 는 최신 브라우저 표준(면접 WS 티켓 등에서도 쓰는 방식).
function generateState(): string {
  return crypto.randomUUID()
}

// 비-httpOnly 쿠키 설정(클라에서 document.cookie 로만 심을 수 있음).
// SameSite=Lax 로 provider → 콜백 top-level 리다이렉트에 실리게 하고, 운영(HTTPS)에서만 Secure.
function setShortLivedCookie(name: string, value: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie =
    `${name}=${encodeURIComponent(value)}` +
    `; Path=/; Max-Age=${oauthCookieMaxAgeSeconds}; SameSite=Lax${secure}`
}

/**
 * provider 인가 URL 을 조립한다. client_id 가 없으면(아직 .env 미설정) 에러를 던진다.
 * redirect_uri 는 env 값 우선, 없으면 현재 origin 기준으로 조립(콘솔 등록값과 동일 패턴).
 */
export function buildAuthorizeUrl(provider: SocialProvider, state: string): string {
  const config = socialProviders[provider]
  if (!config.clientId) {
    throw new Error(`${config.label} client_id 가 설정되지 않았습니다`)
  }

  const redirectUri =
    config.redirectUri || `${window.location.origin}/api/auth/callback/${provider}`

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state,
  })
  if (config.scope) params.set("scope", config.scope)

  return `${config.authorizeUrl}?${params.toString()}`
}

/**
 * 소셜 로그인 시작 — state 저장 후 provider 인가 페이지로 이동한다.
 * client_id 미설정 등으로 URL 조립이 실패하면 예외를 그대로 던져 호출측이 에러를 노출한다.
 */
export function startSocialLogin(provider: SocialProvider): void {
  const state = generateState()
  const authorizeUrl = buildAuthorizeUrl(provider, state)

  // URL 조립 성공 후에만 쿠키를 심는다(실패 시 잔여 쿠키 방지).
  setShortLivedCookie(oauthStateCookieName, state)
  setShortLivedCookie(oauthRedirectCookieName, readSafeRedirect())

  window.location.assign(authorizeUrl)
}
