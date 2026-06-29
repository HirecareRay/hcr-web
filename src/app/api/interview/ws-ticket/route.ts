// app/api/interview/ws-ticket/route.ts
//
// 면접 WebSocket 접속용 "1회용·단기 티켓"을 발급하는 BFF 라우트.
//
// 브라우저 WebSocket 은 Authorization 헤더를 못 붙이고, JWT 는 httpOnly 쿠키라 JS 가
// 못 읽는다. 그래서 입장 직전 프론트는 이 BFF 를 호출하고, BFF 가 쿠키의 JWT 를 꺼내
// Bearer 로 백엔드에 중계해 티켓을 받아 돌려준다. 프론트는 그 티켓만 WS URL(?ticket=)에
// 실어 연결한다(JWT 를 URL 에 노출하지 않는 표준 패턴).
//
// 인증 실패(쿠키 없음·만료·무효) → 401. 프론트는 이를 세션 만료로 보고 로그인 페이지로
// 보낸다(면접은 로그인 필수). 백엔드엔 익명 우회가 안전망으로 남아 있지만, 프론트는
// 익명 경로를 쓰지 않으므로 여기서 막는다.

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"
import backendAxiosInstance from "@/lib/backendAxiosInstance"
import { authCookieName } from "@/features/auth/authCookie"
import { wsTicketSchema } from "@/features/interview/types/interviewSessionSchema"
import { logger } from "@/lib/logger"

/**
 * @swagger
 * /api/interview/ws-ticket:
 *   post:
 *     summary: 면접 WS 접속용 단기 티켓 발급
 *     tags: [Interview]
 *     description: >
 *       httpOnly 쿠키(hcr_token)의 JWT 를 Bearer 로 백엔드에 중계해 1회용·단기 티켓을 받는다.
 *       프론트는 받은 ticket 을 WS URL 쿼리(?ticket=)로만 전달한다.
 *     responses:
 *       200:
 *         description: 티켓 발급 성공 ({ ticket, expiresIn })
 *       401:
 *         description: 비로그인 또는 토큰 만료·무효
 *       502:
 *         description: 백엔드 서버 연결 실패
 */
export async function POST() {
  // 쿠키가 아예 없으면 백엔드를 때리지 않고 즉시 401(로그인 필요).
  const cookieStore = await cookies()
  const hasToken = !!cookieStore.get(authCookieName)?.value
  if (!hasToken) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다" }, { status: 401 })
  }

  try {
    // backendAxiosInstance 가 쿠키의 JWT 를 Bearer 헤더로 자동 주입한다.
    const { data } = await backendAxiosInstance.post("/interviews/ws-ticket")

    // 백엔드 응답이 계약(WsTicket)을 지키는지 Zod 로 검증한 뒤 내려보낸다.
    const ticket = wsTicketSchema.parse(data)

    return NextResponse.json({ success: true, data: ticket })
  } catch (error) {
    // 토큰 만료·무효 등 백엔드 401 → 그대로 전달(프론트가 로그인으로 보냄).
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return NextResponse.json({ success: false, error: "세션이 만료되었습니다" }, { status: 401 })
    }

    // ⚠️ axios 에러 객체를 통째로 로깅하면 config.headers 의 Bearer JWT 가 로그에 남는다.
    //   상태/응답본문/메시지만 추려 토큰 노출을 막는다(backendAxiosInstance 와 동일 원칙).
    if (axios.isAxiosError(error)) {
      logger.error(
        `POST /api/interview/ws-ticket 실패 ${error.response?.status ?? "network"}`,
        error.response?.data ?? error.message
      )
    } else {
      logger.error("POST /api/interview/ws-ticket 실패", error)
    }
    return NextResponse.json(
      { success: false, error: "WS 티켓을 발급하지 못했습니다" },
      { status: 502 }
    )
  }
}
