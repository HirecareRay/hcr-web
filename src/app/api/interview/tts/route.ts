// app/api/interview/tts/route.ts
//
// 면접관 질문 음성(TTS) 합성용 BFF 프록시 라우트.
//
// 백엔드 TTS 엔드포인트는 로그인 전용이라 브라우저에서 직접 못 부른다(JWT 는 httpOnly 쿠키).
// 그래서 ws-ticket 과 동일하게, 이 BFF 가 쿠키의 JWT 를 꺼내 Bearer 로 백엔드에 중계한다.
// 프론트는 personaId 만 넘기고, 담당 면접관(인사/기술/실무) 목소리 선택은 백엔드가 한다.
//
// 응답은 오디오 바이너리(audio/mpeg)라 JSON 파싱하지 않고 body 를 그대로 스트리밍한다.
// 백엔드 status 를 그대로 전달해 클라이언트가 폴백을 판단한다:
//   - 200            → mp3 재생
//   - 404            → 백엔드 TTS 비활성(INTERVIEW_TTS_ENABLED=false) → SpeechSynthesis 폴백
//   - 401/502/기타   → 인증 실패·외부 합성 실패 → SpeechSynthesis 폴백

import { cookies } from "next/headers"
import { authCookieName } from "@/features/auth/authCookie"

// hcr-backend 서버·DB 폐쇄로 실제 TTS 합성 대신 항상 404를 반환한다.
// 클라이언트(useInterviewSocket 등)가 이미 404를 "백엔드 TTS 비활성"으로 해석해
// 브라우저 SpeechSynthesis로 자연스럽게 폴백하므로, mock 오디오를 따로 만들 필요가 없다.
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// const backendApiUrl = process.env.BACKEND_API_URL ?? "http://localhost:8000"
// const res = await fetch(`${backendApiUrl}/interviews/tts`, {
//   method: "POST",
//   headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
//   body,
// })
// return new Response(res.body, {
//   status: res.status,
//   headers: { "Content-Type": res.headers.get("content-type") ?? "application/octet-stream" },
// })

/**
 * @swagger
 * /api/interview/tts:
 *   post:
 *     summary: 면접관 질문 음성(TTS) 합성 프록시
 *     tags: [Interview]
 *     description: >
 *       hcr-backend 폐쇄로 항상 404를 반환한다(현재 mock). 클라이언트는 이를
 *       "백엔드 TTS 비활성" 신호로 해석해 브라우저 SpeechSynthesis로 폴백한다.
 *     responses:
 *       404:
 *         description: 백엔드 TTS 비활성(mock) → 클라 폴백
 */
export async function POST() {
  // 쿠키가 없으면 즉시 401(클라가 SpeechSynthesis 로 폴백) — 원래 인증 검사만 유지.
  const cookieStore = await cookies()
  const jwt = cookieStore.get(authCookieName)?.value
  if (!jwt) {
    return new Response(null, { status: 401 })
  }

  return new Response(null, { status: 404 })
}
