/**
 * useInterviewSessionResult.ts
 *
 * 마이페이지 "AI 면접 기록" 상세(전체 리포트)를 resultId 로 가져오는 React Query 훅입니다.
 * data / isLoading / isError 상태를 컴포넌트에 그대로 전달합니다.
 *
 * 회사 최신 결과를 companyId 로 보는 useInterviewResult 와 달리, 이 훅은 목록에서 고른
 * 특정 세션을 resultId 로 정확히 조회합니다.
 */

import { useQuery } from "@tanstack/react-query"
import { getInterviewSessionResult } from "../services/interviewResultService"

export function useInterviewSessionResult(resultId: string) {
  return useQuery({
    queryKey: ["interviewSessionResult", resultId],
    queryFn: () => getInterviewSessionResult(resultId),
    enabled: Boolean(resultId),
  })
}
