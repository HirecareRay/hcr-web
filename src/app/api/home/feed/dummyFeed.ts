/**
 * dummyFeed.ts
 *
 * 홈 피드 더미데이터. 프론트가 아니라 BFF 옆에 격리합니다.
 *
 * 데이터 출처:
 * - trending : CJ ENM 1건은 팀 보유 실데이터(검색/리포트와 동일 회사). 나머지는 더미.
 * - techStack: 분석 리포트 집계 가정 — 더미.
 * - issues   : 팀 뉴스 파이프라인(ChromaDB) 실데이터(cjEnmNewsFixtures)를 그대로 변환.
 *              기업 리포트(growth.news)와 동일한 단일 출처를 참조합니다.
 *
 * TODO: 백엔드(DB/AI) 연결 시 buildDummyFeed를 실제 집계 조회로 교체하세요.
 */

import type { HomeFeed, IssueBriefingItem } from "@/features/home/types/home"
import { cjEnmNewsFixtures } from "@/features/company/services/cjEnmNewsFixtures"

// 뉴스 실데이터(NewsItem)를 이슈 브리핑 항목으로 변환합니다.
// 헤드라인 앞의 회사명은 태그와 중복되므로 제거합니다.
function toIssueBriefingItem(news: (typeof cjEnmNewsFixtures)[number]): IssueBriefingItem {
  return {
    id: news.articleId,
    companyTag: news.company,
    headline: news.title.replace(/^CJ ENM[,\s]*/, ""),
    url: news.url,
    publishedAt: news.date,
  }
}

/**
 * 홈 피드를 생성합니다.
 * @param generatedAt 생성 시각(ISO 8601). 라우트에서 주입합니다.
 */
export function buildDummyFeed(generatedAt: string): HomeFeed {
  return {
    // 오늘 많이 분석된 채용공고 — 1위 CJ ENM은 실데이터(리포트 라우트 cjenm로 연결)
    trending: [
      {
        rank: 1,
        companyId: "6a3ca079d7da326c0781963c",
        name: "CJ ENM",
        parentName: "CJ",
        logoText: "CJ",
        logoColor: "#e2402a",
        logoUrl: "https://www.google.com/s2/favicons?domain=cjenm.com&sz=128",
      },
      {
        rank: 2,
        companyId: "kakaopay",
        name: "카카오페이",
        parentName: "카카오",
        logoText: "pay",
        logoColor: "#ffcd00",
        logoUrl: "https://www.google.com/s2/favicons?domain=kakaopay.com&sz=128",
      },
      {
        rank: 3,
        companyId: "navercloud",
        name: "네이버클라우드",
        parentName: "네이버",
        logoText: "N",
        logoColor: "#03c75a",
        logoUrl: "https://www.google.com/s2/favicons?domain=navercorp.com&sz=128",
      },
      {
        rank: 4,
        companyId: "toss",
        name: "토스",
        parentName: "비바리퍼블리카",
        logoText: "toss",
        logoColor: "#3182f6",
        logoUrl: "https://www.google.com/s2/favicons?domain=toss.im&sz=128",
      },
      {
        rank: 5,
        companyId: "baemin",
        name: "배달의민족",
        parentName: "우아한형제들",
        logoText: "배민",
        logoColor: "#2ac1bc",
        logoUrl: "https://www.google.com/s2/favicons?domain=baemin.com&sz=128",
      },
    ],

    // 채용담당자가 기대하는 기술 스택 — 1위는 잠금(로그인 유도)
    techStack: {
      question: "채용담당자가 지원자에게 기대하는\n백엔드 기술 스택은?",
      items: [
        { rank: 1, name: "", locked: true },
        { rank: 2, name: "Spring Boot", locked: false },
        { rank: 3, name: "MySQL", locked: false },
        { rank: 4, name: "Redis", locked: false },
        { rank: 5, name: "Docker", locked: false },
      ],
    },

    // 기업 이슈 브리핑 — 팀 뉴스 파이프라인 실데이터(최신순)
    issues: [...cjEnmNewsFixtures]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(toIssueBriefingItem),

    generatedAt,
  }
}
