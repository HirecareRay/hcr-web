import { NextRequest, NextResponse } from "next/server"
import { buildDummyFitAnalysis } from "./dummyFitAnalysis"

// hcr-backend 서버·DB 폐쇄로 LLM 5단계 분석 파이프라인 대신 고정 mock 결과를 반환한다.
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// import { isAxiosError } from "axios"
// import backendApi from "@/lib/backendAxiosInstance"
// import { authCookieName } from "@/features/auth/authCookie"
// import { toFitAnalysis } from "./toFitAnalysis"
//
// const token = req.cookies.get(authCookieName)?.value
// const { data } = await backendApi.post(
//   "/analysis/fit",
//   { company_id: companyId, job_posting_id: jobId },
//   {
//     timeout: 300000, // LLM 5단계 파이프라인 — 최대 5분
//     ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
//   }
// )
// return NextResponse.json({ success: true, data: toFitAnalysis(data.data) })
// (실패 시 error.response.data?.detail 을 그대로 전달)

export async function POST(req: NextRequest) {
  try {
    const { companyId, jobId } = await req.json()

    if (!companyId || !jobId) {
      return NextResponse.json(
        { success: false, error: "companyId, jobId가 필요합니다" },
        { status: 400 }
      )
    }

    const analysisId = `fit-mock-${companyId}-${jobId}`
    return NextResponse.json({
      success: true,
      data: buildDummyFitAnalysis(analysisId, companyId, jobId),
    })
  } catch (error) {
    console.error("적합도 분석 실패:", error)
    return NextResponse.json({ success: false, error: "서버 오류" }, { status: 500 })
  }
}
