// 업종(industry) 문자열을 칩에 쓸 큰 분류로 묶는다.
// BE의 category는 현재 "미디어" placeholder라, 실제 분류는 여기서 industry 키워드로 만든다.
// 규칙은 위에서부터 검사 → 먼저 맞는 분류 채택(구체적인 것을 위에 둔다).

const CATEGORY_RULES: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["바이오·제약", ["제제", "약학", "바이오", "생물", "제약", "의약", "의료"]],
  ["금융", ["보험", "카드", "증권", "투신", "선물", "금융", "은행", "투자", "할부"]],
  ["IT·서비스", ["프로그래밍", "소프트웨어", "정보", "인터넷", "데이터", "시스템", "통신"]],
  ["미디어·콘텐츠", ["방송", "미디어", "콘텐츠", "광고", "엔터", "영화", "게임"]],
  ["건설·엔지니어링", ["건설", "엔지니어링", "건축", "토목", "플랜트"]],
  ["제조", ["제조", "건조", "화학", "기계", "장치", "전자", "반도체", "자동차", "철강", "조선"]],
  ["유통·소비재", ["도매", "소매", "유통", "식품", "식당", "패션", "화장품"]],
  ["교육", ["교육", "학원", "어학"]],
] as const

export const ALL_CATEGORY = "전체"

export function industryToCategory(industry: string): string {
  for (const [category, keywords] of CATEGORY_RULES) {
    if (keywords.some((kw) => industry.includes(kw))) return category
  }
  return "기타"
}
