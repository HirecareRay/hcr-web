// app/api/jobs/search/route.ts
//
// 채용공고 검색 BFF — ?q= 를 FastAPI /jobs/search 로 넘긴다.
// 회사명이 아니라 공고명·직군명(예: AI, 백엔드) 키워드로 전체 진행중 공고를 검색한다.

import { NextRequest, NextResponse } from "next/server"
import type { HomeJobPosting } from "@/features/home/types/home"

// hcr-backend 서버·DB 폐쇄로 실제 검색 대신 home/feed dummyFeed.ts와 동일한 목록에서 필터링한다.
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// import { isAxiosError } from "axios"
// import backendApi from "@/lib/backendAxiosInstance"
//
// export async function GET(req: NextRequest) {
//   try {
//     const q = req.nextUrl.searchParams.get("q") ?? ""
//     const { data } = await backendApi.get("/jobs/search", { params: { q } })
//     return NextResponse.json({ success: true, data })
//   } catch (error) {
//     if (isAxiosError(error) && error.response) {
//       return NextResponse.json(
//         { success: false, error: `백엔드 오류 (${error.response.status})` },
//         { status: error.response.status }
//       )
//     }
//     console.error("채용공고 검색 실패:", error)
//     return NextResponse.json(
//       { success: false, error: "채용공고 검색 중 오류가 발생했습니다" },
//       { status: 500 }
//     )
//   }
// }

const mockJobs: HomeJobPosting[] = [
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
    tags: ["데이터분석", "머신러닝", "Python"],
  },
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
    tags: ["React", "Next.js", "리더십"],
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
]

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase()

  const filtered = q
    ? mockJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.jobRoleLabel.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q))
      )
    : mockJobs

  return NextResponse.json({ success: true, data: filtered })
}
