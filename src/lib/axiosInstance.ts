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

// axios 인스턴스 생성 — 프로젝트 전용 HTTP 클라이언트
const axiosInstance = axios.create({
  // 모든 요청의 기본 URL. 환경변수가 없으면 로컬 Flask 서버(5000번 포트)로 연결
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  // 서버 응답이 10초(10000ms) 넘으면 자동으로 요청 취소
  timeout: 10000,
  // 모든 요청에 JSON 형식임을 명시 (서버가 body를 올바르게 파싱하도록)
  headers: { "Content-Type": "application/json" },
})

// ─── 요청 인터셉터 ────────────────────────────────────────────────────────────
// 모든 API 요청이 서버로 나가기 직전에 실행됩니다.
// localStorage에 저장된 토큰을 꺼내 Authorization 헤더에 자동으로 붙여줍니다.
// 덕분에 API 호출할 때마다 토큰을 직접 넣지 않아도 됩니다.
axiosInstance.interceptors.request.use((config) => {
  // 서버사이드 렌더링(SSR) 환경에서는 localStorage가 없으므로 브라우저 환경인지 확인
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── 응답 인터셉터 ────────────────────────────────────────────────────────────
// 서버로부터 응답을 받은 직후에 실행됩니다.
// 정상 응답은 그대로 통과시키고, 에러가 발생하면 공통 처리를 합니다.
axiosInstance.interceptors.response.use(
  // 성공 응답: 그대로 반환
  (response) => response,
  // 에러 응답: 상태 코드에 따라 공통 처리
  (error) => {
    // 401 = 인증 실패 (토큰 만료 또는 미로그인)
    // 저장된 토큰을 지우고 로그인 페이지로 이동
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
