// app/api/auth/me/route.ts
//
// 현재 로그인 사용자 조회 — 쿠키의 토큰을 꺼내 FastAPI GET /auth/me 로 검증한다.
// 앱 로드 시 "이 토큰이 아직 유효한가"를 확인해 유저 정보를 복원하는 용도.
// 토큰이 없거나(비로그인) 백엔드가 거부하면 401 을 돌려준다.

import { NextRequest, NextResponse } from "next/server"
import { backendApiUrl } from "../proxyAuth"
import { authCookieName } from "@/features/auth/authCookie"
import { logger } from "@/lib/logger"

export async function GET(req: NextRequest) {
  const token = req.cookies.get(authCookieName)?.value
  if (!token) {
    return NextResponse.json({ success: false, message: "로그인이 필요합니다" }, { status: 401 })
  }

  try {
    const res = await fetch(`${backendApiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      // 토큰 만료·위조 등 — 비로그인으로 처리
      return NextResponse.json(
        { success: false, message: "유효하지 않은 토큰입니다" },
        { status: 401 }
      )
    }

    const user = await res.json()
    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    logger.error("GET /api/auth/me 실패", error)
    return NextResponse.json(
      { success: false, message: "백엔드 서버에 연결할 수 없습니다" },
      { status: 502 }
    )
  }
}
