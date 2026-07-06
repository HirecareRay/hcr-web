import { isAxiosError } from "axios"
import { NextRequest, NextResponse } from "next/server"
import backendApi from "@/lib/backendAxiosInstance"
import { authCookieName } from "@/features/auth/authCookie"
import { toFitAnalysis } from "../toFitAnalysis"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ analysisId: string }> }
) {
  const { analysisId } = await params
  const token = req.cookies.get(authCookieName)?.value

  try {
    const { data } = await backendApi.get(
      `/analysis/fit/${analysisId}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    )
    return NextResponse.json({ success: true, data: toFitAnalysis(data.data) })
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        { success: false, error: error.response.data?.detail ?? "조회 실패" },
        { status: error.response.status }
      )
    }
    console.error("적합도 분석 단건 조회 실패:", error)
    return NextResponse.json({ success: false, error: "서버 오류" }, { status: 500 })
  }
}
