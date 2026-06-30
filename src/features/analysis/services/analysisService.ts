import axiosInstance from "@/lib/axiosInstance"
import type { FitAnalysis } from "../types/analysis"

export async function fetchFitAnalysis(companyId: string, jobId: string): Promise<FitAnalysis> {
  const { data } = await axiosInstance.post<{ success: boolean; data: FitAnalysis }>(
    "/api/analysis/fit",
    { companyId, jobId }
  )
  return data.data
}
