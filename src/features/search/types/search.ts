// 업종(industry)을 묶은 큰 분류. "전체"는 필터 해제용. 실제 값은 industryToCategory가 만든다.
export type CompanyCategory = string

export type CompanySearchResult = {
  id: string
  key: string
  name: string
  industry: string
  companySize: string
  companyType: string
  founded: string
  employeeCount: string
  category: string
  logoText: string
}

export type RelatedJobPosting = {
  id: string
  companyId: string
  companyName: string
  title: string
  url: string
  employmentType: string
  deadline: string
}

export type JobPostingFixture = {
  id: string
  companyName: string
  title: string
  job: {
    name: string
    headcount: string
    locations: string[]
    responsibilities: string[]
    requirements: string[]
    preferred: string[]
  }
  qualification: {
    education: string
    major: string
    documents: string[]
  }
  process: string[]
  workConditions: {
    employmentType: string
    workType: string
    salary: string
    benefits: string[]
    deadline: string | null
    deadlineType: "fixed_date" | "rolling"
  }
}
