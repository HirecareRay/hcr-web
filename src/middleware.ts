// src/middleware.ts
//
// 페이지가 로드되기 "전에" 서버에서 실행되는 라우트 가드.
// 로그인 필요한 경로(/mypage, /interview)에 토큰 쿠키 없이 접근하면 /login 으로 보낸다.
// 원래 가려던 경로는 ?redirect= 로 실어, 로그인 후 그 페이지로 복귀시킨다.
//
// 여기선 쿠키 "존재"만 확인한다(빠르고 Edge 안전). 토큰의 실제 유효성은
// /auth/me 와 보호된 API(FastAPI JWT 검증)에서 한 번 더 걸러진다.

import { NextRequest, NextResponse } from "next/server"
import { authCookieName } from "@/features/auth/authCookie"

export function middleware(req: NextRequest) {
  const token = req.cookies.get(authCookieName)?.value
  if (token) return NextResponse.next()

  const { pathname, search } = req.nextUrl
  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = "/login"
  loginUrl.search = ""
  loginUrl.searchParams.set("redirect", `${pathname}${search}`)
  return NextResponse.redirect(loginUrl)
}

// 가드 대상 경로만 미들웨어를 태운다(나머지는 영향 없음).
export const config = {
  matcher: ["/mypage/:path*", "/interview/:path*", "/analysis/:path*"],
}
