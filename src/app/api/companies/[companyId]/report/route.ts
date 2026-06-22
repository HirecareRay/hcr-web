// app/api/companies/[companyId]/report/route.ts

import { NextRequest, NextResponse } from "next/server"
import { buildDummyReport } from "./dummyReport"
import { companyReportSchema } from "@/features/company/types/companyReportSchema"

// 실제 LLM 분석 대기를 흉내내기 위한 인위적 지연(ms).
// 프론트의 로딩/스켈레톤 UX를 지금 단계에서 완성하기 위한 장치입니다.
// TODO: 실제 DB·LLM 연결 시 이 지연은 제거하세요.
const dummyAnalysisDelayMs = 1500

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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

    // 실제 LLM 분석 대기를 흉내내기 위한 지연 (로딩/스켈레톤 UX 확인용).
    await delay(dummyAnalysisDelayMs)

    // TODO: 백엔드(DB/AI) 연결 시 이 줄을 실제 조회 로직으로 교체하세요.
    const report = buildDummyReport(companyId)

    // 응답이 계약(CompanyReport)을 지키는지 Zod로 검증한 뒤 내려보냅니다.
    // 나중에 더미를 실제 DB·LLM 산출물로 바꿔도, 형태가 깨지면 여기서 바로 잡힙니다.
    const validated = companyReportSchema.parse(report)

    return NextResponse.json({ success: true, data: validated })
  } catch (error) {
    console.error("회사 보고서 조회 실패:", error)
    return NextResponse.json(
      { success: false, error: "보고서를 불러오는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
