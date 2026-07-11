// app/api/companies/jobs/route.ts
//
// 연관 채용공고 BFF — ?q= 를 FastAPI /companies/jobs 로 넘겨, 검색 회사들의 공고를 반환한다.

import { NextRequest, NextResponse } from "next/server"
import type { RelatedJobPosting } from "@/features/search/types/search"

// hcr-backend 서버·DB 폐쇄로 실제 조회 대신 고정 mock 목록에서 회사명/직무명으로 필터링한다.
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// import { isAxiosError } from "axios"
// import backendApi from "@/lib/backendAxiosInstance"
//
// export async function GET(req: NextRequest) {
//   try {
//     const q = req.nextUrl.searchParams.get("q") ?? ""
//     const { data } = await backendApi.get("/companies/jobs", { params: { q } })
//     return NextResponse.json({ success: true, data })
//   } catch (error) {
//     if (isAxiosError(error) && error.response) {
//       return NextResponse.json(
//         { success: false, error: `백엔드 오류 (${error.response.status})` },
//         { status: error.response.status }
//       )
//     }
//     console.error("연관 채용공고 조회 실패:", error)
//     return NextResponse.json(
//       { success: false, error: "채용공고 조회 중 오류가 발생했습니다" },
//       { status: 500 }
//     )
//   }
// }

const mockJobs: RelatedJobPosting[] = [
  {
    id: "5e9cabd040c307d7aa142e73",
    companyId: "6a3ca079d7da326c0781963c",
    companyName: "CJ ENM",
    title: "Data Scientist 채용",
    url: "",
    employmentType: "정규직",
    deadline: "2026.07.03",
  },
  {
    id: "500116c9eb165c7a8f97fbd3",
    companyId: "6a3ca079d7da326c0781963c",
    companyName: "CJ ENM",
    title: "[Mnet Plus] Web/App Lead 경력채용",
    url: "",
    employmentType: "정규직 (협의)",
    deadline: "상시채용",
  },
  {
    id: "dummy-be-toss",
    companyId: "toss",
    companyName: "토스",
    title: "Server Developer (Core Banking)",
    url: "",
    employmentType: "정규직",
    deadline: "상시채용",
  },
  {
    id: "dummy-fe-baemin",
    companyId: "baemin",
    companyName: "배달의민족",
    title: "프론트엔드 개발자 (주문 플랫폼)",
    url: "",
    employmentType: "정규직",
    deadline: "2026.07.15",
  },
  {
    id: "dummy-ai-navercloud",
    companyId: "navercloud",
    companyName: "네이버클라우드",
    title: "MLOps Engineer (HyperCLOVA)",
    url: "",
    employmentType: "정규직",
    deadline: "2026.07.28",
  },
]

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase()

  const filtered = q
    ? mockJobs.filter(
        (j) => j.companyName.toLowerCase().includes(q) || j.title.toLowerCase().includes(q)
      )
    : mockJobs

  return NextResponse.json({ success: true, data: filtered })
}
