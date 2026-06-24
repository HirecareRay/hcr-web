import type { CompanySearchResult, RelatedJobPosting } from "../types/search"
import { buildDummyReport } from "@/app/api/companies/[companyId]/report/dummyReport"

// dummyReport의 hiring.openings를 단일 출처로 사용
const dummyReport = buildDummyReport("4c6a2dc35bec6d932b68")

export const companySearchResults: CompanySearchResult[] = [
  {
    id: "4c6a2dc35bec6d932b68",
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
