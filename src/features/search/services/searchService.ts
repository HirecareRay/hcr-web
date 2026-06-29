import axiosInstance from "@/lib/axiosInstance"
import { apiEndpoints } from "@/constants/api"
import type { ApiResponse } from "@/types/api"
import type { CompanySearchResult, RelatedJobPosting } from "../types/search"
import { buildDummyReport } from "@/app/api/companies/[companyId]/report/dummyReport"

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

// dummyReport의 hiring.openings를 단일 출처로 사용
const dummyReport = buildDummyReport("6a3ca079d7da326c0781963c")

export const companySearchResults: CompanySearchResult[] = [
  {
    id: "6a3ca079d7da326c0781963c", // CJ ENM ObjectId — 클릭 시 /company/{ObjectId} 로 실백엔드 조회
    key: "cjenm",
    name: "(주)CJ ENM",
    industry: "텔레비전 방송업",
    companySize: "대기업",
    companyType: "코스닥",
    founded: "1994.12.16",
    employeeCount: "3,078명",
    category: "미디어",
    logoText: "CJ",
  },
]

export const relatedJobPostings: RelatedJobPosting[] = dummyReport.hiring.openings.map(
  (posting) => ({
    id: posting.id,
    title: posting.title.replace(/^(?:\(주\))?CJ ENM\s*/i, ""),
    employmentType: posting.workConditions.employmentType,
    deadline:
      posting.workConditions.deadlineType === "rolling"
        ? "상시채용"
        : `${posting.workConditions.deadline?.replaceAll("-", ".")} 마감`,
  })
)

export const relatedJobPostingCount = relatedJobPostings.length
