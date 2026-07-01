"use client"

import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { searchKeywordParam } from "@/constants/routes"
import { searchCompanies, searchCompanyJobs, searchJobs } from "../services/searchService"
import { ALL_CATEGORY, industryToCategory } from "../utils/categorize"
import type { CompanyCategory } from "../types/search"

export type SearchResultTab = "company" | "job"

export function useSearchResults() {
  // 홈 검색바가 실어 보낸 `?q=` 검색어를 초기값으로 사용
  const searchParams = useSearchParams()
  const initialKeyword = searchParams.get(searchKeywordParam) ?? ""

  // 입력값(타이핑)과 실제 검색어(커밋된 것)를 분리한다.
  // → 타이핑마다 백엔드를 때리지 않고, 돋보기 버튼/엔터로만 검색한다.
  const [inputValue, setInputValue] = useState(initialKeyword)
  const [query, setQuery] = useState(initialKeyword)
  const [selectedCategory, setSelectedCategory] = useState<CompanyCategory>(ALL_CATEGORY)
  // 탭: 기업 검색 결과 vs 채용공고(직무·직군 키워드) 검색 결과
  const [activeTab, setActiveTab] = useState<SearchResultTab>("company")

  // 검색 실행(돋보기/엔터): 현재 입력값을 검색어로 커밋한다.
  const submitSearch = (value: string) => setQuery(value.trim())

  const trimmed = query.trim()

  // 자동완성: 타이핑(inputValue)을 200ms 디바운스해 회사명 제안을 미리 조회한다.
  const [debouncedInput, setDebouncedInput] = useState(initialKeyword)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedInput(inputValue.trim()), 200)
    return () => clearTimeout(id)
  }, [inputValue])

  const { data: suggestions = [] } = useQuery({
    queryKey: ["companySuggest", debouncedInput],
    queryFn: () => searchCompanies(debouncedInput),
    enabled: debouncedInput.length > 0,
  })

  // 백엔드(Mongo) 실검색. 커밋된 검색어(query)가 바뀔 때만 호출된다.
  const { data: companies = [], isFetching } = useQuery({
    queryKey: ["companySearch", trimmed],
    queryFn: () => searchCompanies(trimmed),
    enabled: trimmed.length > 0,
  })

  // 연관 채용공고 — 같은 검색어의 회사들 공고. 검색어가 바뀔 때만 호출.
  const { data: relatedJobs = [] } = useQuery({
    queryKey: ["companyJobs", trimmed],
    queryFn: () => searchCompanyJobs(trimmed),
    enabled: trimmed.length > 0,
  })

  // 채용공고 탭 — 회사명이 아니라 공고명·직군명(AI·백엔드 등) 자체로 검색.
  const { data: jobResults = [], isFetching: isFetchingJobs } = useQuery({
    queryKey: ["jobSearch", trimmed],
    queryFn: () => searchJobs(trimmed),
    enabled: trimmed.length > 0,
  })

  // 검색 결과의 업종을 큰 분류로 묶는다. (BE category는 placeholder라 무시하고 industry로 분류)
  // 칩이 너무 많아지지 않게 회사 수 상위 3개만 칩으로 쓰고, 나머지는 '기타'로 묶는다.
  const TOP_CHIPS = 3
  const mainCategories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const c of companies) {
      const cat = industryToCategory(c.industry)
      if (cat === "기타") continue // '기타'는 칩 후보에서 제외(항상 catch-all)
      counts.set(cat, (counts.get(cat) ?? 0) + 1)
    }
    return [...counts.entries()]
      .filter(([, count]) => count >= 2) // 회사 2개 이상인 분류만 칩으로 (1개는 '기타')
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"))
      .slice(0, TOP_CHIPS)
      .map(([cat]) => cat)
  }, [companies])

  // 칩 = 전체 + 상위분류(가나다) + (상위에 안 든 회사가 있으면) 기타
  const categories = useMemo<CompanyCategory[]>(() => {
    // 의미 있는 분류(2개 이상)가 없으면 칩을 만들지 않는다 (전체 | 기타만은 무의미)
    if (mainCategories.length === 0) return [ALL_CATEGORY]
    const hasOther = companies.some((c) => !mainCategories.includes(industryToCategory(c.industry)))
    const sortedMain = [...mainCategories].sort((a, b) => a.localeCompare(b, "ko"))
    return [ALL_CATEGORY, ...sortedMain, ...(hasOther ? ["기타"] : [])]
  }, [companies, mainCategories])

  // 검색어가 바뀌면 칩 선택을 '전체'로 초기화 (이전 분류가 새 결과엔 없을 수 있음)
  useEffect(() => {
    setSelectedCategory(ALL_CATEGORY)
  }, [trimmed])

  // 선택 분류로 필터 + 이름 일치순 정렬(검색어가 이름 앞쪽일수록 위로).
  // '기타' = 상위 분류에 안 든 모든 회사(catch-all).
  const filteredCompanies = useMemo(() => {
    if (trimmed.length === 0) return []
    let filtered = companies
    if (selectedCategory !== ALL_CATEGORY) {
      filtered = companies.filter((company) => {
        const cat = industryToCategory(company.industry)
        return selectedCategory === "기타"
          ? !mainCategories.includes(cat)
          : cat === selectedCategory
      })
    }
    return [...filtered].sort(byNameMatch(trimmed))
  }, [companies, trimmed, selectedCategory, mainCategories])

  return {
    inputValue,
    setInputValue,
    submitSearch,
    query: trimmed,
    isFetching,
    categories,
    selectedCategory,
    setSelectedCategory,
    filteredCompanies,
    relatedJobs,
    suggestions,
    activeTab,
    setActiveTab,
    jobResults,
    isFetchingJobs,
  }
}

// 회사명에서 (주)·㈜ 같은 접두 기호를 떼고 소문자화해 비교용 키로 만든다.
function normalizeName(name: string): string {
  return name
    .replace(/^(?:\(주\)|㈜)\s*/, "")
    .trim()
    .toLowerCase()
}

// 검색어가 이름에 나타나는 위치가 빠를수록(인덱스 작을수록) 위로 정렬.
// 이름에 없으면(업종만 매칭) 맨 뒤. 동률이면 이름 가나다순.
function byNameMatch(query: string) {
  const q = normalizeName(query)
  return (a: { name: string }, b: { name: string }) => {
    const ai = normalizeName(a.name).indexOf(q)
    const bi = normalizeName(b.name).indexOf(q)
    const ar = ai === -1 ? Infinity : ai
    const br = bi === -1 ? Infinity : bi
    if (ar !== br) return ar - br
    return normalizeName(a.name).localeCompare(normalizeName(b.name), "ko")
  }
}
