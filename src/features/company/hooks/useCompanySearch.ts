import { useCallback, useState } from "react"
import { searchCompanies } from "@/features/company/services/companyService"
import { Company } from "@/features/company/types/company"

export function useCompanySearch() {
  const [results, setResults] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const res = await searchCompanies(query)
      if (res.success && res.data) {
        setResults(res.data)
      } else {
        setError(res.error ?? "검색 중 오류가 발생했습니다")
      }
    } catch {
      setError("검색 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { results, isLoading, error, search }
}
