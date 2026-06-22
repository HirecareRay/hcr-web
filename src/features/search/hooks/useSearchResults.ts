"use client"

import { useMemo, useState } from "react"
import type { CompanyCategory, CompanySearchResult } from "../types/search"

export function useSearchResults(companies: CompanySearchResult[]) {
  const [keyword, setKeyword] = useState("CJ ENM")
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
