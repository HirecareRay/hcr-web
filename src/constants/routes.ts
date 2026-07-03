// 검색 결과 페이지가 읽는 URL 쿼리 파라미터 키 — 홈 검색바(쓰기)·검색 페이지(읽기)의 단일 계약
export const searchKeywordParam = "q"

// 기업을 고르지 않고 보는 "일반 면접"의 약속된 companyId.
// `/interview/[companyId]` 라우트를 그대로 쓰되, 이 값이면 면접방이 기업 컨텍스트를 생략한다.
// (WS 에는 실제 ObjectId 가 아니므로 보내지 않는다 — interviewRoomPage 에서 null 로 치환)
export const generalInterviewId = "general"

export const routes = {
  home: "/",
  search: "/search",
  // 검색어를 쿼리로 실어 검색 결과 페이지로 이동 (빈 값이면 기본 경로)
  searchWithKeyword: (keyword: string) => {
    const trimmed = keyword.trim()
    return trimmed ? `/search?${searchKeywordParam}=${encodeURIComponent(trimmed)}` : "/search"
  },
  login: "/login",
  signup: "/signup",
  mypage: "/mypage",
  company: (companyId: string) => `/company/${companyId}`,
  // 면접 진입 화면(네비바 "AI면접") — 기업 없이 시작하거나 기업을 골라 면접으로 이동
  interviewEntry: "/interview",
  // 기업 없이 바로 보는 일반 면접
  generalInterview: `/interview/${generalInterviewId}`,
  interview: (companyId: string) => `/interview/${companyId}`,
  // 면접 결과 리포트 — 결과는 세션 단위지만, 지금은 companyId로 최신 결과를 본다.
  // TODO: 세션 영속화 후 `/interview/[companyId]/result/[resultId]`로 확장.
  interviewResult: (companyId: string) => `/interview/${companyId}/result`,
}
