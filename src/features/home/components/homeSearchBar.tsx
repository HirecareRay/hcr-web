/**
 * homeSearchBar.tsx
 *
 * 홈 기업명 검색바. 제출 시 검색어를 쿼리(`?q=`)로 실어 검색 결과 페이지로 이동한다.
 * 입력 UI는 공통 SearchBar를 쓰고, 여기서는 상태와 이동만 담당한다.
 */

"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { SearchBar } from "@/components/ui/searchBar"
import { routes } from "@/constants/routes"
import { SEARCH_UI_LIMITS } from "@/features/search/constants/search"
import { searchCompanies } from "@/features/search/services/searchService"

export function HomeSearchBar({
  resultTab,
  placeholder,
}: { resultTab?: "company" | "job"; placeholder?: string } = {}) {
  const router = useRouter()
  const [keyword, setKeyword] = useState("")
  const [debouncedKeyword, setDebouncedKeyword] = useState("")
  const [suggestOpen, setSuggestOpen] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setDebouncedKeyword(keyword.trim()), 200)
    return () => clearTimeout(id)
  }, [keyword])

  const { data: suggestions = [] } = useQuery({
    queryKey: ["companySuggest", debouncedKeyword, SEARCH_UI_LIMITS.suggestions],
    queryFn: () => searchCompanies(debouncedKeyword, SEARCH_UI_LIMITS.suggestions),
    enabled: debouncedKeyword.length > 0,
  })
  const visibleSuggestions = suggestions.slice(0, SEARCH_UI_LIMITS.suggestions)
  const showSuggest = suggestOpen && keyword.trim().length > 0 && visibleSuggestions.length > 0

  useEffect(() => {
    if (!showSuggest) return

    const closeOnEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSuggestOpen(false)
    }

    window.addEventListener("keydown", closeOnEsc)
    return () => window.removeEventListener("keydown", closeOnEsc)
  }, [showSuggest])

  const handleSubmit = (value: string) => {
    setSuggestOpen(false)
    router.push(routes.searchWithKeyword(value, resultTab))
  }

  return (
    <div className="relative">
      <SearchBar
        value={keyword}
        onChange={(value) => {
          setKeyword(value)
          setSuggestOpen(true)
        }}
        onSubmit={handleSubmit}
        placeholder={placeholder}
      />

      {showSuggest && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setSuggestOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="border-warm-border absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-2xl border bg-white shadow-lg">
            {visibleSuggestions.map((company) => (
              <button
                key={company.id}
                type="button"
                onMouseDown={() => {
                  setSuggestOpen(false)
                  router.push(routes.company(company.id))
                }}
                className="hover:bg-warm-bg flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
              >
                <span className="bg-coral-light text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  {company.logoText}
                </span>
                <span className="min-w-0">
                  <span className="text-ink block truncate text-sm font-bold">{company.name}</span>
                  <span className="text-muted block truncate text-xs">{company.industry}</span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
