// app/api/companies/jobs/route.ts
//
// 연관 채용공고 BFF — ?q= 를 FastAPI /companies/jobs 로 넘겨, 검색 회사들의 공고를 반환한다.

import { isAxiosError } from "axios"
import { NextRequest, NextResponse } from "next/server"
import backendApi from "@/lib/backendAxiosInstance"

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") ?? ""
    const { data } = await backendApi.get("/companies/jobs", { params: { q } })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        { success: false, error: `백엔드 오류 (${error.response.status})` },
        { status: error.response.status }
      )
    }
    console.error("연관 채용공고 조회 실패:", error)
    return NextResponse.json(
      { success: false, error: "채용공고 조회 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
