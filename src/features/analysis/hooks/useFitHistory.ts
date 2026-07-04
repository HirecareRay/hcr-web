import { useQuery } from "@tanstack/react-query"
import { fetchFitHistory } from "../services/analysisService"

export function useFitHistory() {
  return useQuery({
    queryKey: ["fitHistory"],
    queryFn: fetchFitHistory,
  })
}
