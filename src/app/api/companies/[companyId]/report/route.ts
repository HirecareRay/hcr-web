// app/api/companies/[companyId]/report/route.ts

import { isAxiosError } from "axios"
import { NextRequest, NextResponse } from "next/server"
import backendApi from "@/lib/backendAxiosInstance"
import { companyReportSchema } from "@/features/company/types/companyReportSchema"

/**
 * @swagger
 * /api/companies/{companyId}/report:
 *   get:
 *     summary: 회사 분석 보고서 조회 API
 *     description: >
 *       기업 개요·재무·임직원·평판·뉴스·채용·AI 인사이트를 담은 보고서를 반환합니다. (현재 더미 데이터 응답)
 *       채용(hiring.openings)은 한 공고 = 한 직무인 평탄 구조를 따릅니다
 *       (companyName·title·job·qualification·process·workConditions).
 *       실제 산출물은 snake_case지만 응답은 프론트 컨벤션(camelCase)으로 변환됩니다.
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: 회사 식별자
 *     responses:
 *       200:
 *         description: 보고서 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyReportResponse'
 *       400:
 *         description: 잘못된 요청 (companyId 누락)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params

    if (!companyId) {
      return NextResponse.json({ success: false, error: "companyId가 필요합니다" }, { status: 400 })
    }

    // FastAPI 백엔드에서 실제 보고서를 조회한다 (BFF→FastAPI 전용 axios 인스턴스).
    const { data: report } = await backendApi.get(`/companies/${companyId}/report`)

    // 응답이 계약(CompanyReport)을 지키는지 Zod로 검증한 뒤 내려보냅니다.
    // 형태가 깨지면 여기서 바로 잡힙니다(아래 catch 로 500 + 콘솔 로그).
    const validated = companyReportSchema.parse(report)

    return NextResponse.json({ success: true, data: validated })
  } catch (error) {
    // 백엔드가 4xx/5xx 로 응답하면 그 상태코드를 그대로 전달(예: 없는 기업 404).
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
