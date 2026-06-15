import { useEffect, useState } from "react"
import { getCompanyReport } from "@/features/company/services/companyService"
import { CompanyReport } from "@/features/company/types/company"

export function useCompanyReport(companyId: string) {
  const [report, setReport] = useState<CompanyReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    getCompanyReport(companyId)
      .then((res) => {
        if (res.success && res.data) {
          setReport(res.data)
        } else {
          setError(res.error ?? "리포트를 불러오지 못했습니다")
        }
      })
      .catch(() => setError("리포트를 불러오지 못했습니다"))
      .finally(() => setIsLoading(false))
  }, [companyId])

  return { report, isLoading, error }
}
