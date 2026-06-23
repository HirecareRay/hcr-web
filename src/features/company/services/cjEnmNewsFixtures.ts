/**
 * cjEnmNewsFixtures.ts
 *
 * 팀 뉴스 파이프라인(ChromaDB)에서 실제로 검색된 CJ ENM 기사 실데이터입니다.
 * 실데이터 모양 그대로(year/month 없이 date만)이며, 백엔드 연결 시 snake→camel 매핑만 하면 됩니다.
 *
 * 단일 출처(single source of truth): 기업 리포트의 growth.news와 홈 이슈 브리핑이
 * 모두 이 fixture를 참조합니다.
 */

import type { NewsItem } from "../types/company"

export const cjEnmNewsFixtures: NewsItem[] = [
  {
    id: "CJ_ENM-000246_0",
    articleId: "CJ_ENM-000246",
    company: "CJ ENM",
    title: "CJ ENM, 2025년 하반기 신입사원 공채…미래 K-콘텐츠 주역 찾는다",
    media: "이데일리",
    url: "https://n.news.naver.com/mnews/article/018/0006113362",
    date: "2025-09-12",
    articleIdx: 1,
    articleType: "longest",
    paragraphStart: 0,
    newsCount: 3,
    content:
      "CJ ENM이 2025년 하반기 신입사원 공개채용을 실시한다. 채용은 크리에이터·일반·글로벌 전형으로 나뉘며, 플랫폼 부문에서는 티빙 개발·데이터·전략기획 직무에서 처음으로 신입을 모집한다. 인크루트 '2025 대학생이 일하고 싶은 기업' 조사에서 인문·사회·상경·교육 전공자 기준 1위, 여성 구직자 선호 1위에 올랐다.",
  },
  {
    id: "CJ_ENM-000418_0",
    articleId: "CJ_ENM-000418",
    company: "CJ ENM",
    title: "CJ 3년간 1만3000명 신규 채용…올리브영·ENM 등 '청년 선호' 사업 집중",
    media: "동아일보",
    url: "https://n.news.naver.com/mnews/article/020/0003699587",
    date: "2026-02-25",
    articleIdx: 0,
    articleType: "longest",
    paragraphStart: 0,
    newsCount: 1,
    content:
      "CJ그룹이 향후 3년간 약 1만3000명을 정규직으로 신규 채용한다. CJ제일제당·올리브영·대한통운·CJ ENM 등 주요 계열사가 모두 채용에 나서며, 올해 신입 공채 인원은 전년 대비 20% 이상 늘릴 계획이다.",
  },
  {
    id: "CJ_ENM-000306_0",
    articleId: "CJ_ENM-000306",
    company: "CJ ENM",
    title: "'AI 콘텐츠' 출사표 던진 CJ ENM, 콘텐츠 산업 혁신 가속",
    media: "데일리안",
    url: "https://n.news.naver.com/mnews/article/119/0003011479",
    date: "2025-10-11",
    articleIdx: 0,
    articleType: "longest",
    paragraphStart: 0,
    newsCount: 2,
    content:
      "CJ ENM이 콘텐츠 특화 AI 기술과 크리에이티브 역량을 결합해 'AI 콘텐츠' 영역 개척에 나섰다. 기획 단계의 'AI 스크립트', 제작 단계의 '시네마틱 AI'를 앞세우고, AI 애니메이션 '캣 비기'는 글로벌 누적 1000만 뷰를 돌파했다.",
  },
  {
    id: "CJ_ENM-000431_0",
    articleId: "CJ_ENM-000431",
    company: "CJ ENM",
    title: "[단독] CJ ENM, 왓챠 인수의향서 제출…회생 딜 '새 국면'",
    media: "조선비즈",
    url: "https://n.news.naver.com/mnews/article/366/0001152662",
    date: "2026-03-30",
    articleIdx: 0,
    articleType: "longest",
    paragraphStart: 0,
    newsCount: 1,
    content:
      "CJ ENM이 회생 절차를 밟고 있는 OTT 기업 왓챠 인수를 타진하며 매각 주간사에 인수의향서를 제출했다. 티빙·웨이브 합병이 지지부진한 가운데 왓챠 인수로 OTT 시장 내 입지를 넓히려는 행보로 해석된다.",
  },
  {
    id: "CJ_ENM-000378_0",
    articleId: "CJ_ENM-000378",
    company: "CJ ENM",
    title: "[35th SRE][Worst]CJ ENM, 실적 개선에도 무거운 몸",
    media: "이데일리",
    url: "https://n.news.naver.com/mnews/article/018/0005889410",
    date: "2024-11-20",
    articleIdx: 1,
    articleType: "longest",
    paragraphStart: 0,
    newsCount: 2,
    content:
      "CJ ENM이 분기 실적 개선에도 시장의 부정적 인식을 떨치지 못하고 신용평가 워스트레이팅 3위에 올랐다. 피프스시즌 인수에 따른 재무 부담과 티빙 적자, 넷플릭스 독주가 부담 요인으로 지적됐으나, 1분기 123억원·2분기 353억원 흑자로 회복 흐름도 나타난다.",
  },
]
