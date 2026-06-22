export type CompanyCategory = "전체" | "미디어"

export type CompanySearchResult = {
  id: string
  key: string
  name: string
  industry: string
  companySize: string
  companyType: string
  founded: string
  employeeCount: string
  category: Exclude<CompanyCategory, "전체">
  logoText: string
}

export type RelatedJobPosting = {
  id: string
  title: string
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
