import { isAxiosError } from "axios"
import { NextRequest, NextResponse } from "next/server"
import backendApi from "@/lib/backendAxiosInstance"
import { authCookieName } from "@/features/auth/authCookie"
import type { FitHistoryItem } from "@/features/analysis/types/analysis"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFitHistoryItem(raw: Record<string, any>): FitHistoryItem {
  return {
    analysisId: raw.analysis_id,
    companyId: raw.company_id ?? null,
    companyName: raw.company_name ?? null,
    jobPostingId: raw.job_posting_id ?? null,
    jobTitle: raw.job_title ?? null,
    jobNames: raw.job_names ?? [],
    analyzedAt: raw.analyzed_at ?? null,
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(authCookieName)?.value
  if (!token) {
    return NextResponse.json({ success: false, error: "로그인이 필요합니다" }, { status: 401 })
  }

  try {
    const { data } = await backendApi.get("/analysis/fit/history", {
      headers: { Authorization: `Bearer ${token}` },
    })

    return NextResponse.json({ success: true, data: (data.data ?? []).map(toFitHistoryItem) })
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        { success: false, error: error.response.data?.detail ?? "조회 실패" },
        { status: error.response.status }
      )
    }
    console.error("적합도 보고서 목록 조회 실패:", error)
    return NextResponse.json({ success: false, error: "서버 오류" }, { status: 500 })
  }
}
