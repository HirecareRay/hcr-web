/**
 * backendAxiosInstance.ts
 *
 * BFF(Next.js Route Handler) → AI 백엔드(FastAPI, 기본 8000번) 호출 전용 HTTP 클라이언트.
 */

import axios from "axios"
import { logger } from "@/lib/logger"
import { cookies } from "next/headers"
import { authCookieName } from "@/features/auth/authCookie"

// 서버 사이드 전용 env (NEXT_PUBLIC_ 아님 — 브라우저에 노출되지 않는다)
const backendApiUrl = process.env.BACKEND_API_URL ?? "http://localhost:8000"

// axios 인스턴스 생성 — BFF 전용 FastAPI 클라이언트
const backendAxiosInstance = axios.create({
  baseURL: backendApiUrl,
  // 기본 타임아웃 — LLM 미사용 엔드포인트 기준. LLM 사용 라우트는 호출 시 개별 override
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
})

// ─── 요청 인터셉터 ────────────────────────────────────────────────────────────
// 💡 async/await를 적용하여 요청 직전에 Next.js 쿠키 저장소에서 토큰을 추출하고 헤더에 주입합니다.
backendAxiosInstance.interceptors.request.use(async (config) => {
  try {
    // 호출부에서 이미 Authorization 헤더를 직접 넣었다면 덮어쓰지 않고 유지합니다.
    if (!config.headers["Authorization"]) {
      const cookieStore = await cookies()
      const token = cookieStore.get(authCookieName)?.value

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
    }
  } catch (error) {
    // Next.js 빌드 시점이나 쿠키에 접근할 수 없는 특수 환경(예: 정적 생성)에서의 예외 처리
    logger.warn("backendAxiosInstance: 쿠키 저장소에 접근할 수 없거나 토큰이 없습니다.")
  }

  logger.api(config.method ?? "?", `${config.baseURL ?? ""}${config.url ?? "?"}`, config.data)
  return config
})

// ─── 응답 인터셉터 ────────────────────────────────────────────────────────────
backendAxiosInstance.interceptors.response.use(
  (response) => {
    logger.info(`${response.status} ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    const status = error.response?.status
    const url = error.config?.url ?? "?"
    logger.error(`${status ?? "network"} ${url}`, error.response?.data)
    return Promise.reject(error)
  }
)

export default backendAxiosInstance
