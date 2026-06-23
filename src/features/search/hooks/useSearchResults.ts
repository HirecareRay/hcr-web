"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { searchKeywordParam } from "@/constants/routes"
import type { CompanyCategory, CompanySearchResult } from "../types/search"

export function useSearchResults(companies: CompanySearchResult[]) {
  // 홈 검색바가 실어 보낸 `?q=` 검색어를 초기값으로 사용 (없으면 빈 값 → 전체 표시)
  const searchParams = useSearchParams()
  const initialKeyword = searchParams.get(searchKeywordParam) ?? ""

  const [keyword, setKeyword] = useState(initialKeyword)
  const [selectedCategory, setSelectedCategory] = useState<CompanyCategory>("전체")

  const filteredCompanies = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    const relatedKeyword = normalizedKeyword.startsWith("cj") ? "cj" : normalizedKeyword

    return companies.filter((company) => {
      const matchesKeyword =
        relatedKeyword.length === 0 ||
        company.name.toLowerCase().includes(relatedKeyword) ||
        company.industry.toLowerCase().includes(relatedKeyword)
      const matchesCategory = selectedCategory === "전체" || company.category === selectedCategory

      return matchesKeyword && matchesCategory
    })
  }, [companies, keyword, selectedCategory])

  return {
    keyword,
    setKeyword,
    selectedCategory,
    setSelectedCategory,
    filteredCompanies,
  }
}
