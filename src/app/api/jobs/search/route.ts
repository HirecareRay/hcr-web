// app/api/jobs/search/route.ts
//
// 채용공고 검색 BFF — ?q= 를 FastAPI /jobs/search 로 넘긴다.
// 회사명이 아니라 공고명·직군명(예: AI, 백엔드) 키워드로 전체 진행중 공고를 검색한다.

import { isAxiosError } from "axios"
import { NextRequest, NextResponse } from "next/server"
import backendApi from "@/lib/backendAxiosInstance"

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") ?? ""
    const { data } = await backendApi.get("/jobs/search", { params: { q } })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        { success: false, error: `백엔드 오류 (${error.response.status})` },
        { status: error.response.status }
      )
    }
    console.error("채용공고 검색 실패:", error)
    return NextResponse.json(
      { success: false, error: "채용공고 검색 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
