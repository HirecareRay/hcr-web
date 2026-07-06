import { useQuery } from "@tanstack/react-query"
import { fetchFitAnalysisById } from "../services/analysisService"

export function useFitAnalysisById(analysisId: string) {
  return useQuery({
    queryKey: ["fitAnalysisById", analysisId],
    queryFn: () => fetchFitAnalysisById(analysisId),
    enabled: !!analysisId,
    staleTime: Infinity, // 히스토리 단건은 불변 스냅샷
    retry: 1,
  })
}
