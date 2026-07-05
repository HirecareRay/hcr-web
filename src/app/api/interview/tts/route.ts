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
//
// axios(backendAxiosInstance) 대신 네이티브 fetch 를 쓰는 이유: 바이너리 스트림을 변형 없이
// 그대로 흘려보내기 위해서다(axios 는 바디를 버퍼링/파싱하려 든다).

import { cookies } from "next/headers"
import { authCookieName } from "@/features/auth/authCookie"
import { logger } from "@/lib/logger"

// 서버 사이드 전용 env (backendAxiosInstance 와 동일 출처)
const backendApiUrl = process.env.BACKEND_API_URL ?? "http://localhost:8000"

/**
 * @swagger
 * /api/interview/tts:
 *   post:
 *     summary: 면접관 질문 음성(TTS) 합성 프록시
 *     tags: [Interview]
 *     description: >
 *       httpOnly 쿠키(hcr_token)의 JWT 를 Bearer 로 백엔드에 중계해 질문 텍스트를 mp3 로 합성한다.
 *       프론트는 personaId 만 넘기고 목소리 선택은 백엔드가 담당한다. 200 이면 audio/mpeg 바이너리를,
 *       그 외 상태(404/401/502 등)면 상태만 전달해 클라이언트가 SpeechSynthesis 폴백을 판단한다.
 *     responses:
 *       200:
 *         description: 합성 성공 (audio/mpeg 바이너리)
 *       401:
 *         description: 비로그인 또는 토큰 만료·무효 → 클라 폴백
 *       404:
 *         description: 백엔드 TTS 비활성 → 클라 폴백
 *       502:
 *         description: 외부 합성 실패 또는 백엔드 연결 실패 → 클라 폴백
 */
export async function POST(req: Request) {
  // 쿠키가 없으면 백엔드를 때리지 않고 즉시 401(클라가 SpeechSynthesis 로 폴백).
  const cookieStore = await cookies()
  const jwt = cookieStore.get(authCookieName)?.value
  if (!jwt) {
    return new Response(null, { status: 401 })
  }

  // 클라이언트 바디({ text, personaId })를 파싱하지 않고 그대로 통과시킨다.
  const body = await req.text()

  try {
    const res = await fetch(`${backendApiUrl}/interviews/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body,
    })

    // 200 이면 audio/mpeg 바이너리, 그 외는 상태만 전달해 클라가 폴백을 판단한다.
    // body 를 파싱하지 않고 스트림째 그대로 흘려보낸다.
    return new Response(res.body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/octet-stream",
      },
    })
  } catch (error) {
    // ⚠️ 에러 객체를 통째로 로깅하면 요청 헤더의 Bearer JWT 가 남을 수 있어 메시지만 추린다.
    logger.error(
      "POST /api/interview/tts 실패",
      error instanceof Error ? error.message : String(error)
    )
    // 백엔드 연결 실패 → 502. 클라는 이를 폴백 신호로 본다.
    return new Response(null, { status: 502 })
  }
}
