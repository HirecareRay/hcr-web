export type JobCategory = "전체" | "개발·데이터" | "디자인" | "보안"
export type JobStatus = "open" | "rolling" | "closed"
export type JobSort = "recommended" | "deadline" | "latest"

export type JobListItem = {
  id: string
  companyId: string
  companyName: string
  title: string
  jobName: string
  category: Exclude<JobCategory, "전체">
  employmentType: string
  location: string
  deadline: string | null
  status: JobStatus
  tags: string[]
}

export type JobDetail = JobListItem & {
  responsibilities: string[]
  requirements: string[]
  preferredQualifications: string[]
  hiringProcess: string[]
  documents: string[]
  description: string
  companyWebsite?: string
}
