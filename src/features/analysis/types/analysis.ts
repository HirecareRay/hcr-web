export type EvidenceRef = {
  docId: string
  field: string | null
  featureName: string | null
  excerpt: string | null
  source: string | null
}

export type JobMatch = {
  jobPostingId: string
  matchTargetType:
    | "required"
    | "preferred"
    | "responsibility"
    | "tech_tool"
    | "career"
    | "education"
  matchTargetText: string
  matchTargetEvidence: string | null
  matched: boolean
  candidateProfileId: string
  candidateEvidence: EvidenceRef
  reasoning: string | null
}

export type CompanyMatch = {
  companyProfileId: string
  dimension: "industry_domain" | "culture" | "talent_values"
  criterionText: string
  criterionEvidence: string | null
  matched: boolean
  candidateProfileId: string
  candidateEvidence: EvidenceRef
  reasoning: string | null
}

export type CategorySummary = {
  category: string
  total: number
  matched: number
}

// 유저분석 탭의 "적합도 보고서" 목록 카드 1건 — 상세는 FitAnalysis(jobPostingId+companyId로 조회).
export type FitHistoryItem = {
  analysisId: string
  companyId: string | null
  companyName: string | null
  jobPostingId: string | null
  jobTitle: string | null
  jobNames: string[]
  analyzedAt: string | null
}

export type FitAnalysis = {
  analysisId: string
  companyName: string | null
  jobTitle: string | null
  jobNames: string[]
  candidateProfileId: string
  jobProfileId: string
  companyProfileId: string
  overallSummary: string
  jobMatches: JobMatch[]
  companyMatches: CompanyMatch[]
  categorySummary: CategorySummary[]
  strengths: string[] | null
  improvements: string[] | null
  recommendations: string[] | null
}
