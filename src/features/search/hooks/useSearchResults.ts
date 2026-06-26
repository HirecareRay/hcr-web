"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { searchKeywordParam } from "@/constants/routes"
import { searchCompanies } from "../services/searchService"
import type { CompanyCategory } from "../types/search"

export function useSearchResults() {
  // 홈 검색바가 실어 보낸 `?q=` 검색어를 초기값으로 사용
  const searchParams = useSearchParams()
  const initialKeyword = searchParams.get(searchKeywordParam) ?? ""

  const [keyword, setKeyword] = useState(initialKeyword)
  const [selectedCategory, setSelectedCategory] = useState<CompanyCategory>("전체")

  const trimmed = keyword.trim()

  // 백엔드(Mongo) 실검색. 검색어 있을 때만 호출.
  const { data: companies = [] } = useQuery({
    queryKey: ["companySearch", trimmed],
    queryFn: () => searchCompanies(trimmed),
    enabled: trimmed.length > 0,
  })

  // 카테고리는 백엔드 결과 위에서 클라이언트 필터 (ponytail: 현재 enum '미디어'만)
  const filteredCompanies = useMemo(() => {
    if (trimmed.length === 0) return []
    return selectedCategory === "전체"
      ? companies
      : companies.filter((company) => company.category === selectedCategory)
  }, [companies, trimmed, selectedCategory])

  return {
    keyword,
    setKeyword,
    selectedCategory,
    setSelectedCategory,
    filteredCompanies,
  }
}
