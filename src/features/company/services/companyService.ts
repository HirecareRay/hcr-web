/**
 * companyService.ts
 *
 * 회사 도메인의 API 호출을 담당하는 서비스 계층입니다.
 * 컴포넌트/훅은 axios를 직접 쓰지 않고 이 함수들을 통해 서버와 통신합니다.
 */

import axiosInstance from "@/lib/axiosInstance"
import { apiEndpoints } from "@/constants/api"
import type { ApiResponse } from "@/types/api"
import type { CompanyReport } from "../types/company"

/**
 * 회사 분석 보고서를 조회합니다.
 * @param companyId 회사 식별자
 */
export async function getCompanyReport(companyId: string): Promise<CompanyReport> {
  const { data } = await axiosInstance.get<ApiResponse<CompanyReport>>(
    apiEndpoints.companies.report(companyId)
  )

  if (!data.success || !data.data) {
    throw new Error(data.error ?? "보고서를 불러오지 못했습니다")
  }

  return data.data
}
