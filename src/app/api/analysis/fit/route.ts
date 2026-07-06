import { isAxiosError } from "axios"
import { NextRequest, NextResponse } from "next/server"
import backendApi from "@/lib/backendAxiosInstance"
import { authCookieName } from "@/features/auth/authCookie"
import { toFitAnalysis } from "./toFitAnalysis"

export async function POST(req: NextRequest) {
  try {
    const { companyId, jobId } = await req.json()

    if (!companyId || !jobId) {
      return NextResponse.json(
        { success: false, error: "companyId, jobId가 필요합니다" },
        { status: 400 }
      )
    }

    const token = req.cookies.get(authCookieName)?.value
    const { data } = await backendApi.post(
      "/analysis/fit",
      { company_id: companyId, job_posting_id: jobId },
      {
        timeout: 300000, // LLM 5단계 파이프라인 — 최대 5분
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      }
    )

    return NextResponse.json({ success: true, data: toFitAnalysis(data.data) })
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        { success: false, error: error.response.data?.detail ?? "분석 실패" },
        { status: error.response.status }
      )
    }
    console.error("적합도 분석 실패:", error)
    return NextResponse.json({ success: false, error: "서버 오류" }, { status: 500 })
  }
}
