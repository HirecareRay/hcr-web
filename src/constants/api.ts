export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

export const apiEndpoints = {
  home: {
    feed: "/api/home/feed",
  },
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    me: "/api/auth/me",
    logout: "/api/auth/logout",
  },
  companies: {
    search: "/api/companies/search",
    jobs: "/api/companies/jobs",
    report: (id: string) => `/api/companies/${id}/report`,
  },
  interview: {
    sessions: "/api/interview/sessions",
    answer: (id: string) => `/api/interview/sessions/${id}/answer`,
    stt: (id: string) => `/api/interview/sessions/${id}/stt`,
    // WS 접속용 단기 티켓 발급(BFF가 쿠키 JWT를 Bearer로 백엔드에 중계)
    wsTicket: "/api/interview/ws-ticket",
    // 면접 결과 리포트 — 현재는 companyId로 최신 결과 조회.
    // TODO: 세션 영속화 후 resultId 기준 조회로 확장.
    result: (companyId: string) => `/api/interview/results/${companyId}`,
  },
}
