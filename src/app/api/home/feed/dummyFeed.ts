/**
 * dummyFeed.ts
 *
 * 홈 피드 "폴백" 더미데이터. 프론트가 아니라 BFF 옆에 격리합니다.
 *
 * 세 섹션(trending·jobsByRole·issues) 모두 route.ts가 AI 백엔드 실데이터로 조회하며,
 * 이 더미는 각 섹션 호출이 실패/타임아웃/검증 실패했을 때만 "그 섹션만" 대체하는
 * 폴백으로 쓰입니다(섹션별 graceful degrade). 정상 시에는 사용되지 않습니다.
 */

import type { HomeFeed, IssueBriefingItem, JobRoleGroup } from "@/features/home/types/home"
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

// 직군별 채용공고 더미 — 백엔드 `GET /home/jobs-by-role` 응답 모양 그대로.
// companyId 는 실연결 시 실제 ObjectId 로 교체되며, 지금은 리포트 링크가 동작하는
// CJ ENM(실데이터) 위주로 채워 클릭 흐름을 확인할 수 있게 합니다.
const dummyJobsByRole: JobRoleGroup[] = [
  {
    role: "backend",
    label: "백엔드",
    jobs: [
      {
        id: "e3b1bca75a26a4582ed16ec4",
        companyId: "6a3ca079d7da326c0781963c",
        companyName: "CJ ENM",
        title: "커머스부문 추천 플랫폼 엔지니어",
        jobRole: "backend",
        jobRoleLabel: "백엔드",
        location: "서울",
        employmentType: "정규직",
        deadline: "2026-07-21",
        deadlineType: "fixed_date",
        url: "",
        tags: ["Java", "Python", "AWS"],
      },
      {
        id: "dummy-be-toss",
        companyId: "toss",
        companyName: "토스",
        title: "Server Developer (Core Banking)",
        jobRole: "backend",
        jobRoleLabel: "백엔드",
        location: "서울 강남구",
        employmentType: "정규직",
        deadline: null,
        deadlineType: "rolling",
        url: "",
        tags: ["Kotlin", "Spring Boot", "MySQL"],
      },
    ],
  },
  {
    role: "frontend",
    label: "프론트엔드",
    jobs: [
      {
        id: "500116c9eb165c7a8f97fbd3",
        companyId: "6a3ca079d7da326c0781963c",
        companyName: "CJ ENM",
        title: "[Mnet Plus] Web/App Lead 경력채용",
        jobRole: "frontend",
        jobRoleLabel: "프론트엔드",
        location: "서울 마포구",
        employmentType: "정규직 (협의)",
        deadline: null,
        deadlineType: "rolling",
        url: "",
        tags: ["React", "Next.js", "TypeScript"],
      },
      {
        id: "dummy-fe-baemin",
        companyId: "baemin",
        companyName: "배달의민족",
        title: "프론트엔드 개발자 (주문 플랫폼)",
        jobRole: "frontend",
        jobRoleLabel: "프론트엔드",
        location: "서울 송파구",
        employmentType: "정규직",
        deadline: "2026-07-15",
        deadlineType: "fixed_date",
        url: "",
        tags: ["React", "TypeScript", "Next.js"],
      },
    ],
  },
  {
    role: "ai",
    label: "AI",
    jobs: [
      {
        id: "5e9cabd040c307d7aa142e73",
        companyId: "6a3ca079d7da326c0781963c",
        companyName: "CJ ENM",
        title: "Data Scientist 채용",
        jobRole: "ai",
        jobRoleLabel: "AI",
        location: "서울",
        employmentType: "정규직",
        deadline: "2026-07-03",
        deadlineType: "fixed_date",
        url: "",
        tags: ["Python", "LLM", "PyTorch"],
      },
      {
        id: "dummy-ai-navercloud",
        companyId: "navercloud",
        companyName: "네이버클라우드",
        title: "MLOps Engineer (HyperCLOVA)",
        jobRole: "ai",
        jobRoleLabel: "AI",
        location: "성남 분당구",
        employmentType: "정규직",
        deadline: "2026-07-28",
        deadlineType: "fixed_date",
        url: "",
        tags: ["Kubernetes", "MLOps", "Python"],
      },
    ],
  },
]

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

    // 직군별 채용공고 — 백엔드/프론트엔드/AI 탭 (백엔드 GET /home/jobs-by-role 가정)
    jobsByRole: dummyJobsByRole,

    // 기업 이슈 브리핑 — 팀 뉴스 파이프라인 실데이터(최신순)
    issues: [...cjEnmNewsFixtures]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(toIssueBriefingItem),

    generatedAt,
  }
}
