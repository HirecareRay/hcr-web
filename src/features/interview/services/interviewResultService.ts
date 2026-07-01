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
import type { InterviewHistory } from "../types/interviewHistory"

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

/**
 * 마이페이지 "AI 면접 기록" 목록을 조회합니다.
 * 유저가 진행한 면접 세션 요약을 최신순으로 반환합니다.
 */
export async function getInterviewHistory(): Promise<InterviewHistory> {
  const { data } = await axiosInstance.get<ApiResponse<InterviewHistory>>(
    apiEndpoints.interview.history
  )

  if (!data.success || !data.data) {
    throw new Error(data.error ?? "면접 기록을 불러오지 못했습니다")
  }

  return data.data
}

/**
 * 면접 기록 상세(전체 리포트)를 조회합니다.
 * 목록 항목의 resultId 로 해당 세션의 InterviewResult 를 반환합니다.
 * @param resultId 세션 결과 식별자 (목록 항목의 resultId)
 */
export async function getInterviewSessionResult(resultId: string): Promise<InterviewResult> {
  const { data } = await axiosInstance.get<ApiResponse<InterviewResult>>(
    apiEndpoints.interview.session(resultId)
  )

  if (!data.success || !data.data) {
    throw new Error(data.error ?? "면접 기록을 불러오지 못했습니다")
  }

  return data.data
}
