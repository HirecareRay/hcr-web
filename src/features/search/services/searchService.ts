import axiosInstance from "@/lib/axiosInstance"
import { apiEndpoints } from "@/constants/api"
import type { ApiResponse } from "@/types/api"
import type { CompanySearchResult, RelatedJobPosting } from "../types/search"

/** 회사명/업종 검색 — 백엔드(Mongo) 실데이터. q 비면 빈 배열. */
export async function searchCompanies(q: string): Promise<CompanySearchResult[]> {
  const trimmed = q.trim()
  if (!trimmed) return []

  const { data } = await axiosInstance.get<ApiResponse<CompanySearchResult[]>>(
    apiEndpoints.companies.search,
    { params: { q: trimmed } }
  )

  if (!data.success || !data.data) {
    throw new Error(data.error ?? "검색에 실패했습니다")
  }

  return data.data
}

export async function searchCompanyJobs(q: string): Promise<RelatedJobPosting[]> {
  const trimmed = q.trim()
  if (!trimmed) return []

  const { data } = await axiosInstance.get<ApiResponse<RelatedJobPosting[]>>(
    apiEndpoints.companies.jobs,
    { params: { q: trimmed } }
  )

  if (!data.success || !data.data) {
    throw new Error(data.error ?? "채용공고 조회에 실패했습니다")
  }

  return data.data
}
