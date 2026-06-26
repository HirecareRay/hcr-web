/**
 * backendAxiosInstance.ts
 *
 * BFF(Next.js Route Handler) → AI 백엔드(FastAPI, 기본 8000번) 호출 전용 HTTP 클라이언트.
 *
 * 주의: 이 인스턴스는 **서버 사이드(BFF) 에서만** 쓴다.
 *   - 프론트(브라우저)는 같은 출처의 BFF(`@/lib/axiosInstance`, 3000번)만 호출한다(CLAUDE.md BFF 원칙).
 *   - BFF 가 보호된 요청을 중계할 때 쿠키의 토큰을 꺼내 이 인스턴스로 FastAPI 에 Bearer 로 전달한다.
 *
 * baseURL 은 서버 전용 env(`BACKEND_API_URL`)에서 읽는다 — `NEXT_PUBLIC_` 가 아니라 브라우저에 노출되지 않는다.
 * 기존 `proxyAuth.ts` 의 `fetch` 중계와 같은 대상을 보지만, interceptor·timeout·공통 헤더를
 * 한 곳에서 관리하기 위해 axios 버전으로 둔다.
 *
 * 사용법:
 *   import backendApi from "@/lib/backendAxiosInstance"
 *   const res = await backendApi.post("/auth/login", body)
 *   // 토큰이 필요한 호출:
 *   const res = await backendApi.get("/interview/...", { headers: { Authorization: `Bearer ${token}` } })
 */

import axios from "axios"
import { logger } from "@/lib/logger"

// 서버 사이드 전용 env (NEXT_PUBLIC_ 아님 — 브라우저에 노출되지 않는다)
const backendApiUrl = process.env.BACKEND_API_URL ?? "http://localhost:8000"

// axios 인스턴스 생성 — BFF 전용 FastAPI 클라이언트
const backendAxiosInstance = axios.create({
  baseURL: backendApiUrl,
  // AI 백엔드는 LLM·RAG 처리로 응답이 느릴 수 있어 브라우저용(10초)보다 넉넉히 둔다.
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  // 서버↔서버 호출이라 브라우저 쿠키 개념이 없다. 인증은 호출부에서 Bearer 헤더로 직접 전달한다.
})

// ─── 요청 인터셉터 ────────────────────────────────────────────────────────────
// 어떤 요청이 FastAPI 로 나가는지 로깅만 한다.
backendAxiosInstance.interceptors.request.use((config) => {
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
