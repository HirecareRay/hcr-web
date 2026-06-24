/**
 * axiosInstance.ts
 *
 * 서버 API와 통신할 때 사용하는 HTTP 클라이언트 설정 파일입니다.
 * fetch() 대신 axios 라이브러리를 쓰면 요청/응답 가로채기(interceptor),
 * 타임아웃, 공통 헤더 설정 등을 한 곳에서 관리할 수 있습니다.
 *
 * 사용법: import axiosInstance from "@/lib/axiosInstance"
 *         axiosInstance.get("/api/...") 처럼 호출하면 됩니다.
 */

import axios from "axios"
import { logger } from "@/lib/logger"
import { useAuthStore } from "@/features/auth/store/authStore"

// axios 인스턴스 생성 — 프로젝트 전용 HTTP 클라이언트
const axiosInstance = axios.create({
  // 모든 요청의 기본 URL. 환경변수가 없으면 로컬 Next 서버(3000번 포트)로 연결
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  // 서버 응답이 10초(10000ms) 넘으면 자동으로 요청 취소
  timeout: 10000,
  // 모든 요청에 JSON 형식임을 명시 (서버가 body를 올바르게 파싱하도록)
  headers: { "Content-Type": "application/json" },
  // 인증 토큰은 httpOnly 쿠키로 관리 — 같은 출처 BFF 호출에 쿠키를 함께 보낸다.
  withCredentials: true,
})

// ─── 요청 인터셉터 ────────────────────────────────────────────────────────────
// 토큰은 httpOnly 쿠키에 있어 JS 가 손대지 않는다(브라우저가 자동으로 실어 보냄).
// 여기선 로깅만 한다.
axiosInstance.interceptors.request.use((config) => {
  logger.api(config.method ?? "?", config.url ?? "?", config.data)
  return config
})

// ─── 응답 인터셉터 ────────────────────────────────────────────────────────────
// 서버로부터 응답을 받은 직후에 실행됩니다.
// 정상 응답은 그대로 통과시키고, 에러가 발생하면 공통 처리를 합니다.
axiosInstance.interceptors.response.use(
  // 성공 응답: 그대로 반환
  (response) => {
    logger.info(`${response.status} ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    const status = error.response?.status
    const url = error.config?.url ?? "?"

    // 401: 토큰 만료·비로그인 — "로그인 안 함"이라는 정상 신호다(에러 아님).
    // 전역 인증 상태만 비우고 조용히 넘어간다(콘솔을 빨갛게 만들지 않음).
    // 보호 페이지 진입 차단은 미들웨어가 담당하므로 여기서 강제 이동은 하지 않는다.
    if (status === 401) {
      useAuthStore.getState().clearUser()
      logger.info(`401 ${url} — 비로그인`)
      return Promise.reject(error)
    }

    logger.error(`${status ?? "network"} ${url}`, error.response?.data)
    return Promise.reject(error)
  }
)

export default axiosInstance
