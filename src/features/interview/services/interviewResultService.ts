/**
 * interviewResultService.ts
 *
 * 면접 결과 도메인의 API 호출을 담당하는 서비스 계층입니다.
 * 컴포넌트/훅은 axios를 직접 쓰지 않고 이 함수를 통해 서버와 통신합니다.
 */

import axiosInstance from "@/lib/axiosInstance"
import { apiEndpoints } from "@/constants/api"
import type { ApiResponse } from "@/types/api"
import type { InterviewResult } from "../types/interviewResult"

/**
 * 면접 결과 리포트를 조회합니다.
 * @param companyId 회사 식별자 (현재는 최신 결과를 반환)
 */
export async function getInterviewResult(companyId: string): Promise<InterviewResult> {
  const { data } = await axiosInstance.get<ApiResponse<InterviewResult>>(
    apiEndpoints.interview.result(companyId)
  )

  if (!data.success || !data.data) {
    throw new Error(data.error ?? "면접 결과를 불러오지 못했습니다")
  }

  return data.data
}
