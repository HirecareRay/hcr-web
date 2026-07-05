// 소셜 로그인 CSRF 방어용 state·복귀경로 쿠키 이름 — 클라(설정)와 콜백 route(대조·삭제)가 공유한다.
// authCookie.ts 와 같은 방침: node 전용 import 없이 상수만 둬서 Edge 런타임에서도 안전.
//
// state 쿠키는 클라의 document.cookie 로 심으므로 httpOnly 가 될 수 없다(비밀이 아니라 대조용 난수).
// 보안 성질: 공격자가 "쿼리 state" 와 "쿠키 state" 쌍을 동시에 위조할 수 없다는 점(표준 OAuth state 패턴).
// SameSite=Lax 라야 provider → 우리 콜백으로의 top-level GET 리다이렉트에 쿠키가 실린다.

// 클릭 시 생성한 난수 state 를 담는 쿠키
export const oauthStateCookieName = "hcr_oauth_state"

// 로그인 후 돌아갈 내부 경로(선택) — 미들웨어가 ?redirect= 로 보낸 경우 유지하려고 함께 저장
export const oauthRedirectCookieName = "hcr_oauth_redirect"

// state/redirect 쿠키 수명(초). 인가 왕복은 보통 수십 초 — 넉넉히 5분.
export const oauthCookieMaxAgeSeconds = 300
