// 검색 페이지 노출 정책값. 데이터가 아니라 "몇 개까지 보여줄지" 같은 UI 정책이라 한곳에 모은다.
export const SEARCH_UI_LIMITS = {
  companiesPreview: 5, // 기업 검색 결과 기본 노출 개수 ("전체 N개 보기" 전까지)
  jobsPreview: 8, // 연관 채용공고 기본 노출 개수 ("전체 N건 보기" 전까지)
  suggestions: 5, // 자동완성 추천 최대 개수
} as const
