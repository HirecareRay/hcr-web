// 검색 결과 페이지가 읽는 URL 쿼리 파라미터 키 — 홈 검색바(쓰기)·검색 페이지(읽기)의 단일 계약
export const searchKeywordParam = "q"

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
  company: (companyId: string) => `/company/${companyId}`,
  interview: (companyId: string) => `/interview/${companyId}`,
  // 면접 결과 리포트 — 결과는 세션 단위지만, 지금은 companyId로 최신 결과를 본다.
  // TODO: 세션 영속화 후 `/interview/[companyId]/result/[resultId]`로 확장.
  interviewResult: (companyId: string) => `/interview/${companyId}/result`,
}
