// app/api/companies/[companyId]/report/route.ts

import { NextRequest, NextResponse } from "next/server"
import { buildDummyReport } from "./dummyReport"

/**
 * @swagger
 * /api/companies/{companyId}/report:
 *   get:
 *     summary: 회사 분석 보고서 조회 API
 *     description: 기업 개요·재무·임직원·뉴스·채용·예상 면접질문을 담은 보고서를 반환합니다. (현재 더미 데이터 응답)
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
 *       400:
 *         description: 잘못된 요청 (companyId 누락)
 *       500:
 *         description: 서버 오류
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

    // TODO: 백엔드(DB/AI) 연결 시 이 줄을 실제 조회 로직으로 교체하세요.
    const report = buildDummyReport(companyId)

    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    console.error("회사 보고서 조회 실패:", error)
    return NextResponse.json(
      { success: false, error: "보고서를 불러오는 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}
