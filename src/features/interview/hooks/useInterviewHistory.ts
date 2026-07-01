/**
 * useInterviewHistory.ts
 *
 * 마이페이지 "AI 면접 기록" 목록을 가져오는 React Query 훅입니다.
 * data / isLoading / isError 상태를 컴포넌트에 그대로 전달합니다.
 */

import { useQuery } from "@tanstack/react-query"
import { getInterviewHistory } from "../services/interviewResultService"

export function useInterviewHistory() {
  return useQuery({
    queryKey: ["interviewHistory"],
    queryFn: getInterviewHistory,
  })
}
