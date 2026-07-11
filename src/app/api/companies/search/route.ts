// app/api/companies/search/route.ts
//
// 회사 검색 BFF — ?q= 를 FastAPI /companies/search 로 그대로 넘기고 결과를 반환한다.

import { NextRequest, NextResponse } from "next/server"
import type { CompanySearchResult } from "@/features/search/types/search"

// hcr-backend 서버·DB 폐쇄로 실제 검색 대신 고정 mock 목록에서 이름/업종으로 필터링한다.
// companyId는 home/feed dummyFeed.ts의 trending 목록과 동일하게 맞춰 리포트 라우트와 연결된다.
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// import { isAxiosError } from "axios"
// import backendApi from "@/lib/backendAxiosInstance"
//
// export async function GET(req: NextRequest) {
//   const q = req.nextUrl.searchParams.get("q") ?? ""
//   const limit = req.nextUrl.searchParams.get("limit") ?? undefined
//   try {
//     const { data } = await backendApi.get("/companies/search", { params: { q, limit } })
//     return NextResponse.json({ success: true, data })
//   } catch (error) {
//     if (isAxiosError(error) && error.response) {
//       return NextResponse.json(
//         { success: false, error: `백엔드 오류 (${error.response.status})` },
//         { status: error.response.status }
//       )
//     }
//     console.error("회사 검색 실패:", error)
//     return NextResponse.json(
//       { success: false, error: "검색 중 오류가 발생했습니다" },
//       { status: 500 }
//     )
//   }
// }

const mockCompanies: CompanySearchResult[] = [
  {
    id: "6a3ca079d7da326c0781963c",
    key: "cjenm",
    name: "CJ ENM",
    industry: "방송·미디어·콘텐츠",
    companySize: "대기업",
    companyType: "코스닥",
    founded: "1994.12.16",
    employeeCount: "3,078명",
    category: "미디어/콘텐츠",
    logoText: "CJ",
  },
  {
    id: "kakaopay",
    key: "kakaopay",
    name: "카카오페이",
    industry: "핀테크·전자금융업",
    companySize: "대기업",
    companyType: "코스피",
    founded: "2017.04.11",
    employeeCount: "1,100명",
    category: "금융/핀테크",
    logoText: "pay",
  },
  {
    id: "navercloud",
    key: "navercloud",
    name: "네이버클라우드",
    industry: "클라우드·AI",
    companySize: "대기업",
    companyType: "비상장",
    founded: "2009.09.26",
    employeeCount: "2,200명",
    category: "IT/플랫폼",
    logoText: "N",
  },
  {
    id: "toss",
    key: "toss",
    name: "토스",
    industry: "핀테크·전자금융업",
    companySize: "대기업",
    companyType: "비상장",
    founded: "2013.04.03",
    employeeCount: "2,900명",
    category: "금융/핀테크",
    logoText: "toss",
  },
  {
    id: "baemin",
    key: "baemin",
    name: "배달의민족",
    industry: "커머스·플랫폼",
    companySize: "대기업",
    companyType: "비상장",
    founded: "2010.06.01",
    employeeCount: "3,600명",
    category: "커머스/플랫폼",
    logoText: "배민",
  },
]

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase()
  const limitParam = req.nextUrl.searchParams.get("limit")
  const limit = limitParam ? Number(limitParam) : undefined

  const filtered = q
    ? mockCompanies.filter(
        (c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)
      )
    : mockCompanies

  return NextResponse.json({ success: true, data: limit ? filtered.slice(0, limit) : filtered })
}
