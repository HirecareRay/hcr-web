export type UserProfileFixture = {
  name: string
  email: string
  statusMessage: string
  completionRate: number
}

export type CareerDocumentFixture = {
  id: string
  type: "resume" | "coverLetter" | "portfolio" | "project"
  label: string
  count: number
  description: string
}

export type MyPageActivityFixture = {
  recentlyViewedCompanies: number
  recentlyViewedJobs: number
  bookmarkedCompanies: number
  bookmarkedJobs: number
  interviewResults: number
}
