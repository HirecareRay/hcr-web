/**
 * useInterviewResult.ts
 *
 * 면접 결과 리포트를 가져오는 React Query 훅입니다.
 * data / isLoading / isError 상태를 컴포넌트에 그대로 전달합니다.
 */

import { useQuery } from "@tanstack/react-query"
import { getInterviewResult } from "../services/interviewResultService"

export function useInterviewResult(companyId: string) {
  return useQuery({
    // 지금은 companyId로 최신 결과 1건만 조회하므로 캐시 키도 companyId 기준입니다.
    // TODO: 세션 영속화로 한 회사에 결과가 여러 개 생기면 queryKey에 resultId를 추가해
    //       세션별 캐시가 충돌하지 않게 하세요.
    queryKey: ["interviewResult", companyId],
    queryFn: () => getInterviewResult(companyId),
    enabled: Boolean(companyId),
  })
}
