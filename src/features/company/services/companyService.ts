import { ApiResponse } from "@/types/api"
import { Company, CompanyReport } from "@/features/company/types/company"

export async function searchCompanies(query: string): Promise<ApiResponse<Company[]>> {
  const res = await fetch(`/api/companies?q=${encodeURIComponent(query)}`)
  return res.json()
}

export async function getCompanyReport(companyId: string): Promise<ApiResponse<CompanyReport>> {
  const res = await fetch(`/api/companies/${companyId}/report`)
  return res.json()
}
