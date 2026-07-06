import { useQuery } from "@tanstack/react-query"
import { fetchFitAnalysis } from "../services/analysisService"

export function useFitAnalysis(companyId: string, jobPostId: string, enabled = true) {
  return useQuery({
    queryKey: ["fitAnalysis", companyId, jobPostId],
    queryFn: () => fetchFitAnalysis(companyId, jobPostId),
    enabled: enabled && !!companyId && !!jobPostId,
    staleTime: 1000 * 60 * 30, // 30분 캐시 (LLM 비용)
    retry: 1,
  })
}
