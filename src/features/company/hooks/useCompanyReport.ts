/**
 * useCompanyReport.ts
 *
 * 회사 보고서 데이터를 가져오는 React Query 훅입니다.
 * data / isLoading / isError 상태를 컴포넌트에 그대로 전달합니다.
 */

import { useQuery } from "@tanstack/react-query"
import { getCompanyReport } from "../services/companyService"

export function useCompanyReport(companyId: string) {
  return useQuery({
    queryKey: ["companyReport", companyId],
    queryFn: () => getCompanyReport(companyId),
    enabled: Boolean(companyId),
  })
}
