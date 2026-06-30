"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchBar } from "@/components/ui/searchBar"
import { useSearchResults } from "../hooks/useSearchResults"
import { SEARCH_UI_LIMITS } from "../constants/search"
import type { CompanySearchResult, RelatedJobPosting } from "../types/search"

function CompanyCard({ company }: { company: CompanySearchResult }) {
  // 카드 전체를 리포트로 가는 링크로 만든다 (AI 리포트 배지는 안내용 표시).
  return (
    <Link
      href={`/company/${company.id}`}
      className="border-warm-border bg-warm-bg hover:border-primary flex items-center gap-3 rounded-2xl border p-4 transition-colors"
    >
      <div className="bg-coral-beam flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
        {company.logoText}
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-ink truncate text-base font-bold">{company.name}</h2>
        <p className="text-muted mt-0.5 text-xs">
          {company.industry} · {company.companySize} · {company.companyType}
        </p>
        <p className="text-disabled mt-1 text-[0.6875rem]">
          설립 {company.founded} · 사원수 {company.employeeCount}
        </p>
      </div>

      <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#f1ecff] px-3 py-1.5 text-[0.6875rem] font-bold text-[#6d4ae8]">
        <Sparkles className="size-3" />
        AI 리포트
      </span>
    </Link>
  )
}

function JobCard({ jobPosting }: { jobPosting: RelatedJobPosting }) {
  // 공고 상세 페이지가 아직 없어 원문(source_url) 새 탭으로 연결한다.
  return (
    <a
      href={jobPosting.url || "#"}
      target="_blank"
      rel="noreferrer"
      className="border-warm-border hover:bg-warm-bg flex w-full items-center justify-between rounded-2xl border bg-white px-5 py-3 text-left transition-colors"
    >
      <span className="min-w-0">
        <strong className="text-ink block truncate text-sm font-semibold">
          {jobPosting.title}
        </strong>
        <span className="text-muted mt-0.5 block text-xs">
          {jobPosting.companyName} · {jobPosting.employmentType} · {jobPosting.deadline}
        </span>
      </span>
      <ChevronRight className="text-disabled size-4 shrink-0" />
    </a>
  )
}

export function SearchResultPage() {
  // useSearchResults가 useSearchParams로 ?q=를 읽으므로 Suspense 경계로 감싼다
  return (
    <Suspense>
      <SearchResultContent />
    </Suspense>
  )
}

function SearchResultContent() {
  const {
    inputValue,
    setInputValue,
    submitSearch,
    query,
    isFetching,
    categories,
    selectedCategory,
    setSelectedCategory,
    filteredCompanies,
    relatedJobs,
    suggestions,
  } = useSearchResults()

  // 연관 채용공고는 도배 방지로 기본 N개만, "더보기"로 전체 펼침
  const [showAllJobs, setShowAllJobs] = useState(false)
  const visibleJobs = showAllJobs ? relatedJobs : relatedJobs.slice(0, SEARCH_UI_LIMITS.jobsPreview)
  const [showAllCompanies, setShowAllCompanies] = useState(false)
  const visibleCompanies = showAllCompanies
    ? filteredCompanies
    : filteredCompanies.slice(0, SEARCH_UI_LIMITS.companiesPreview)

  useEffect(() => {
    setShowAllCompanies(false)
  }, [query, selectedCategory])

  // 자동완성 드롭다운 열림 상태. 타이핑하면 열고, 선택/검색하면 닫는다.
  const [suggestOpen, setSuggestOpen] = useState(false)
  const visibleSuggestions = suggestions.slice(0, SEARCH_UI_LIMITS.suggestions)
  const showSuggest = suggestOpen && inputValue.trim().length > 0 && visibleSuggestions.length > 0

  // 회사명 선택: 입력창을 채우고 그 이름으로 즉시 검색.
  const selectSuggestion = (name: string) => {
    setInputValue(name)
    submitSearch(name)
    setSuggestOpen(false)
  }

  return (
    <section className="bg-background min-h-full px-6 pt-7 pb-8">
      <header>
        <p className="text-primary text-sm font-semibold">기업과 공고를 한 번에</p>
        <h1 className="text-ink mt-1 text-2xl font-bold">검색 결과</h1>

        <div className="relative mt-5">
          <SearchBar
            value={inputValue}
            onChange={(value) => {
              setInputValue(value)
              setSuggestOpen(true)
            }}
            onSubmit={(value) => {
              submitSearch(value)
              setSuggestOpen(false)
            }}
            placeholder="기업명 또는 업종을 검색하세요"
            ariaLabel="기업 검색"
          />

          {showSuggest && (
            <>
              {/* 바깥 클릭 시 닫기용 백드롭 */}
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                onClick={() => setSuggestOpen(false)}
                className="fixed inset-0 z-30 cursor-default"
              />
              <ul className="border-warm-border absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border bg-white shadow-lg">
                {visibleSuggestions.map((company) => (
                  <li key={company.id}>
                    <button
                      type="button"
                      // onMouseDown: 입력창 blur보다 먼저 실행돼 선택이 안정적
                      onMouseDown={() => selectSuggestion(company.name)}
                      className="hover:bg-warm-bg flex w-full items-center justify-between gap-3 px-5 py-3 text-left"
                    >
                      <span className="text-ink truncate text-sm font-semibold">
                        {company.name}
                      </span>
                      <span className="text-muted shrink-0 text-xs">{company.industry}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </header>

      <section className="mt-6">
        <h2 className="text-ink text-base font-bold">
          기업 검색 결과 · {filteredCompanies.length}개
        </h2>

        {categories.length > 1 && (
          <div
            className="-mx-6 mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto px-6 pb-1 [&::-webkit-scrollbar]:hidden"
            aria-label="업종 필터"
          >
            {categories.map((category) => {
              const isSelected = category === selectedCategory

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={isSelected}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 text-xs font-bold transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-warm-border text-muted bg-white"
                  )}
                >
                  {category}
                </button>
              )
            })}
          </div>
        )}

        {filteredCompanies.length > 0 ? (
          <>
            <div className="mt-3 space-y-3">
              {visibleCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
            {filteredCompanies.length > SEARCH_UI_LIMITS.companiesPreview && (
              <button
                type="button"
                onClick={() => setShowAllCompanies((prev) => !prev)}
                className="border-warm-border text-muted hover:bg-warm-bg mt-3 w-full rounded-2xl border bg-white py-3 text-sm font-semibold transition-colors"
              >
                {showAllCompanies ? "접기" : `전체 ${filteredCompanies.length}개 보기`}
              </button>
            )}
          </>
        ) : (
          <div className="border-warm-border mt-3 rounded-2xl border border-dashed bg-white px-5 py-12 text-center">
            {query.length === 0 ? (
              <>
                <p className="text-ink font-semibold">기업을 검색해보세요</p>
                <p className="text-muted mt-1 text-xs">기업명·업종 입력 후 돋보기를 누르세요.</p>
              </>
            ) : isFetching ? (
              <p className="text-muted text-sm">검색 중…</p>
            ) : (
              <>
                <p className="text-ink font-semibold">검색된 기업이 없어요</p>
                <p className="text-muted mt-1 text-xs">기업명이나 업종을 다시 입력해보세요.</p>
              </>
            )}
          </div>
        )}
      </section>

      <section className="mt-7">
        <div className="flex items-center gap-2">
          <h2 className="text-ink text-base font-bold">연관 채용공고</h2>
          <span className="bg-coral-light text-primary rounded-full px-2 py-0.5 text-[0.6875rem] font-bold">
            추천
          </span>
        </div>

        {relatedJobs.length > 0 ? (
          <>
            <div className="mt-3 space-y-3">
              {visibleJobs.map((jobPosting) => (
                <JobCard key={jobPosting.id} jobPosting={jobPosting} />
              ))}
            </div>
            {relatedJobs.length > SEARCH_UI_LIMITS.jobsPreview && (
              <button
                type="button"
                onClick={() => setShowAllJobs((prev) => !prev)}
                className="border-warm-border text-muted hover:bg-warm-bg mt-3 w-full rounded-2xl border bg-white py-3 text-sm font-semibold transition-colors"
              >
                {showAllJobs ? "접기" : `전체 ${relatedJobs.length}건 보기`}
              </button>
            )}
          </>
        ) : (
          <div className="border-warm-border mt-3 rounded-2xl border border-dashed bg-white px-5 py-8 text-center">
            <p className="text-ink font-semibold">
              {query.length === 0 ? "검색하면 연관 공고가 표시돼요" : "연관 채용공고가 없어요"}
            </p>
            <p className="text-muted mt-1 text-xs">검색된 기업들의 공고를 모아 보여줍니다.</p>
          </div>
        )}
      </section>
    </section>
  )
}
