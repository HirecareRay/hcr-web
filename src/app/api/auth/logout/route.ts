// app/api/auth/logout/route.ts
//
// 로그아웃 — 토큰 쿠키를 지운다. 서버 상태(JWT)는 무상태라 쿠키 제거만으로 충분하다.

import { NextResponse } from "next/server"
import { authCookieName } from "@/features/auth/authCookie"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(authCookieName)
  return response
}
