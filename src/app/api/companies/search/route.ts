// app/api/companies/search/route.ts
//
// 회사 검색 BFF — ?q= 를 FastAPI /companies/search 로 그대로 넘기고 결과를 반환한다.

import { isAxiosError } from "axios"
import { NextRequest, NextResponse } from "next/server"
import backendApi from "@/lib/backendAxiosInstance"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? ""
  const limit = req.nextUrl.searchParams.get("limit") ?? undefined
  const parsedLimit = Number(limit)
  const limitData = <T,>(data: T[]) =>
    Number.isFinite(parsedLimit) && parsedLimit > 0 ? data.slice(0, parsedLimit) : data

  try {
    const { data } = await backendApi.get("/companies/search", { params: { q, limit } })
    return NextResponse.json({ success: true, data: Array.isArray(data) ? limitData(data) : data })
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        { success: false, error: `백엔드 오류 (${error.response.status})` },
        { status: error.response.status }
      )
    }
    console.error("회사 검색 실패:", error)
    return NextResponse.json(
      { success: false, error: "검색 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
