// app/api/interview/ws-ticket/route.ts
//
// 면접 WebSocket 접속용 "1회용·단기 티켓"을 발급하는 BFF 라우트.
//
// 브라우저 WebSocket 은 Authorization 헤더를 못 붙이고, JWT 는 httpOnly 쿠키라 JS 가
// 못 읽는다. 그래서 입장 직전 프론트는 이 BFF 를 호출하고, BFF 가 쿠키의 JWT 를 꺼내
// Bearer 로 백엔드에 중계해 티켓을 받아 돌려준다. 프론트는 그 티켓만 WS URL(?ticket=)에
// 실어 연결한다(JWT 를 URL 에 노출하지 않는 표준 패턴).
//
// ⚠️ mock 상태: 메인 면접방(useInterviewSocket)이 이제 실시간 WS 대신 REST 세션의
// questions 를 타이머로 재생하는 방식으로 바뀌면서, 이 티켓을 요청하는 코드가 없다
// (getWsTicket 호출부 없음 — interviewService.ts 에만 함수가 남아있다). ws-demo/
// nonverbal-demo 데모 페이지가 향후 이 훅을 다시 쓰게 되더라도, 브라우저가 FastAPI에
// 직접 WebSocket을 여는 구조라 실제 WS 서버가 없는 한 이 티켓만으로는 연결되지 않는다.
// 백엔드 복구 전까지는 죽은 경로이지만, 엔드포인트 자체는 형태 유지를 위해 남겨둔다.

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { authCookieName } from "@/features/auth/authCookie"

// hcr-backend 서버·DB 폐쇄로 실제 티켓 발급 대신 고정 mock 티켓을 반환한다.
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// import axios from "axios"
// import backendAxiosInstance from "@/lib/backendAxiosInstance"
// import { wsTicketSchema } from "@/features/interview/types/interviewSessionSchema"
// import { logger } from "@/lib/logger"
//
// try {
//   const { data } = await backendAxiosInstance.post("/interviews/ws-ticket")
//   const ticket = wsTicketSchema.parse(data)
//   return NextResponse.json({ success: true, data: ticket })
// } catch (error) {
//   if (axios.isAxiosError(error) && error.response?.status === 401) {
//     return NextResponse.json({ success: false, error: "세션이 만료되었습니다" }, { status: 401 })
//   }
//   logger.error(...)
//   return NextResponse.json({ success: false, error: "WS 티켓을 발급하지 못했습니다" }, { status: 502 })
// }

/**
 * @swagger
 * /api/interview/ws-ticket:
 *   post:
 *     summary: 면접 WS 접속용 단기 티켓 발급
 *     tags: [Interview]
 *     description: >
 *       hcr-backend 폐쇄로 고정 mock 티켓을 반환한다(현재 mock). WS 서버 자체가 없어
 *       이 티켓으로 실제 소켓 연결은 되지 않는다 — ws-demo/nonverbal-demo 전용 한계.
 *     responses:
 *       200:
 *         description: 티켓 발급 성공 ({ ticket, expiresIn })
 *       401:
 *         description: 비로그인
 */
export async function POST() {
  const cookieStore = await cookies()
  const hasToken = !!cookieStore.get(authCookieName)?.value
  if (!hasToken) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다" }, { status: 401 })
  }

  return NextResponse.json({ success: true, data: { ticket: "mock-ws-ticket", expiresIn: 60 } })
}
