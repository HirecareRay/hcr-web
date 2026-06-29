// app/api/companies/[companyId]/report/route.ts

import { isAxiosError } from "axios"
import { NextRequest, NextResponse } from "next/server"
import backendApi from "@/lib/backendAxiosInstance"
import { companyReportSchema } from "@/features/company/types/companyReportSchema"
import { buildDummyReport } from "./dummyReport"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const { companyId } = await params

  if (!companyId) {
    return NextResponse.json({ success: false, error: "companyId가 필요합니다" }, { status: 400 })
  }

  try {
    const { data: report } = await backendApi.get(`/companies/${companyId}/report`)

    const validated = companyReportSchema.parse(report)

    return NextResponse.json({ success: true, data: validated })
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[report] 백엔드 실패 → dev 더미 대체 (companyId=${companyId})`)
      const dummy = companyReportSchema.parse(buildDummyReport(companyId))
      return NextResponse.json({ success: true, data: dummy })
    }

    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        { success: false, error: `백엔드 오류 (${error.response.status})` },
        { status: error.response.status }
      )
    }
    console.error("회사 보고서 조회 실패:", error)
    return NextResponse.json(
      { success: false, error: "보고서를 불러오는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
