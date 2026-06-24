// 인증 토큰 쿠키 설정 — BFF(쿠키 심기/지우기)와 middleware(존재 확인)가 공유한다.
// node 전용 import 없이 상수만 둬서 Edge 런타임(middleware)에서도 안전하게 쓰인다.

// 토큰을 담는 httpOnly 쿠키 이름. JS(document.cookie)로 못 읽으므로 XSS 에 안전하다.
export const authCookieName = "hcr_token"

// 쿠키 옵션 — 토큰을 심을 때 사용한다. secure 는 운영(HTTPS)에서만 켜 로컬 http 개발을 막지 않는다.
//
// maxAge 를 주지 않아 항상 세션 쿠키로 발급한다 → 브라우저를 닫으면 토큰이 삭제돼 로그아웃된다.
// (로그인 유지 옵션은 두지 않기로 함)
export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}
