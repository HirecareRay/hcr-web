export interface Company {
  id: string
  name: string
  corpCode: string
}

export interface CompanyReport {
  company: Company
  financial: FinancialSection | null
  culture: CultureSection | null
  growth: GrowthSection | null
  interviewQuestions: string[]
}

export interface FinancialSection {
  summary: string
  source: string
  year: string
}

export interface CultureSection {
  talent: string
  welfare: string[]
  source: string
}

export interface GrowthSection {
  news: NewsItem[]
  summary: string
}

export interface NewsItem {
  title: string
  url: string
  publishedAt: string
}
