// 인증 토큰 쿠키 설정 — BFF(쿠키 심기/지우기)와 middleware(존재 확인)가 공유한다.
// node 전용 import 없이 상수만 둬서 Edge 런타임(middleware)에서도 안전하게 쓰인다.

// 토큰을 담는 httpOnly 쿠키 이름. JS(document.cookie)로 못 읽으므로 XSS 에 안전하다.
export const authCookieName = "hcr_token"

// "로그인 상태 유지" 선택 시 토큰 유효기간(초). 백엔드 JWT_EXPIRE_MINUTES=1440(1일)과 맞춘다.
export const authCookieMaxAge = 60 * 60 * 24

// 쿠키 옵션 — 토큰을 심을 때 사용한다. secure 는 운영(HTTPS)에서만 켜 로컬 http 개발을 막지 않는다.
//
// remember=true  → maxAge 부여 → 지속 쿠키(브라우저 껐다 켜도 1일간 유지)
// remember=false → maxAge 없음  → 세션 쿠키(브라우저 닫으면 삭제, 사람인·네이버 기본값)
export function buildAuthCookieOptions(remember: boolean) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(remember ? { maxAge: authCookieMaxAge } : {}),
  }
}
