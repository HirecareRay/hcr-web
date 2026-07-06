"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ClipboardCheck, ExternalLink, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchBar } from "@/components/ui/searchBar"
import { useSearchResults } from "../hooks/useSearchResults"
import { SearchResultListSkeleton } from "./searchResultSkeleton"
import { useDelayedLoading } from "@/hooks/useDelayedLoading"
import { SEARCH_UI_LIMITS } from "../constants/search"
import type { CompanySearchResult, RelatedJobPosting } from "../types/search"
import type { HomeJobPosting } from "@/features/home/types/home"

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
  return (
    <div className="border-warm-border rounded-2xl border bg-white px-5 py-3">
      <strong className="text-ink block truncate text-sm font-semibold">{jobPosting.title}</strong>
      <span className="text-muted mt-0.5 block text-xs">
        {jobPosting.companyName} · {jobPosting.employmentType} · {jobPosting.deadline}
      </span>

      <div className="mt-3 flex gap-2">
        <a
          href={jobPosting.url}
          target="_blank"
          rel="noreferrer"
          className="border-warm-border text-muted hover:bg-warm-bg flex flex-1 items-center justify-center gap-1 rounded-lg border py-1.5 text-xs font-semibold transition-colors"
        >
          <ExternalLink className="size-3.5" />
          공고 링크
        </a>
        <Link
          href={`/jobs/${jobPosting.id}/fit?companyId=${jobPosting.companyId}`}
          className="bg-coral-light text-primary flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-bold"
        >
          <ClipboardCheck className="size-3.5" />
          적합도 분석
        </Link>
      </div>
    </div>
  )
}

// 직군별 채용공고 홈 카드와 동일한 규칙: 날짜면 마감일, 아니면 상시채용.
function formatDeadline(job: HomeJobPosting): string {
  if (job.deadlineType === "rolling" || !job.deadline) return "상시채용"
  return `${job.deadline.replaceAll("-", ".")} 마감`
}

function JobSearchCard({ job }: { job: HomeJobPosting }) {
  return (
    <div className="border-warm-border rounded-2xl border bg-white px-5 py-3">
      <div className="flex items-center gap-2">
        <span className="bg-warm-bg text-muted rounded-full px-2 py-0.5 text-[0.625rem] font-bold">
          {job.jobRoleLabel}
        </span>
        <span className="text-primary text-xs font-medium">{formatDeadline(job)}</span>
      </div>
      <strong className="text-ink mt-1.5 block truncate text-sm font-semibold">{job.title}</strong>
      <span className="text-muted mt-0.5 block text-xs">
        {job.companyName} · {job.employmentType} · {job.location}
      </span>

      <div className="mt-3 flex gap-2">
        <a
          href={job.url}
          target="_blank"
          rel="noreferrer"
          className="border-warm-border text-muted hover:bg-warm-bg flex flex-1 items-center justify-center gap-1 rounded-lg border py-1.5 text-xs font-semibold transition-colors"
        >
          <ExternalLink className="size-3.5" />
          공고 링크
        </a>
        <Link
          href={`/jobs/${job.id}/fit?companyId=${job.companyId}`}
          className="bg-coral-light text-primary flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-bold"
        >
          <ClipboardCheck className="size-3.5" />
          적합도 분석
        </Link>
      </div>
    </div>
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
    activeTab,
    setActiveTab,
    jobResults,
    isFetchingJobs,
  } = useSearchResults()

  const showCompanySkeleton = useDelayedLoading(isFetching)
  const showJobSkeleton = useDelayedLoading(isFetchingJobs)

  // 연관 채용공고는 도배 방지로 기본 N개만, "더보기"로 전체 펼침
  const [showAllJobs, setShowAllJobs] = useState(false)
  const visibleJobs = showAllJobs ? relatedJobs : relatedJobs.slice(0, SEARCH_UI_LIMITS.jobsPreview)
  const [showAllJobResults, setShowAllJobResults] = useState(false)
  const visibleJobResults = showAllJobResults
    ? jobResults
    : jobResults.slice(0, SEARCH_UI_LIMITS.jobsPreview)
  const [showAllCompanies, setShowAllCompanies] = useState(false)
  const visibleCompanies = showAllCompanies
    ? filteredCompanies
    : filteredCompanies.slice(0, SEARCH_UI_LIMITS.companiesPreview)

  useEffect(() => {
    setShowAllCompanies(false)
  }, [query, selectedCategory])

  // 기업 결과가 0건이면 채용공고 탭으로 자동 전환(검색어당 1회) — 사용자가 다시
  // 기업 탭으로 돌아와도 같은 검색어로는 재전환하지 않는다.
  // ponytail: 느려서 임시 주석 처리. 원인 파악 후 복구할지 결정.
  // const autoSwitchedRef = useRef(false)
  // useEffect(() => {
  //   autoSwitchedRef.current = false
  // }, [query])
  // useEffect(() => {
  //   if (
  //     query.length > 0 &&
  //     !isFetching &&
  //     filteredCompanies.length === 0 &&
  //     !autoSwitchedRef.current
  //   ) {
  //     autoSwitchedRef.current = true
  //     setActiveTab("job")
  //   }
  // }, [query, isFetching, filteredCompanies, setActiveTab])

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
            placeholder={
              activeTab === "company"
                ? "기업명 또는 업종을 검색하세요"
                : "직무·직군(AI, 백엔드 등) 또는 공고명을 검색하세요"
            }
            ariaLabel="검색"
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

        <div role="tablist" aria-label="검색 결과 유형" className="mt-4 flex gap-2">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "company"}
            onClick={() => setActiveTab("company")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-bold transition-colors",
              activeTab === "company" ? "bg-primary text-white" : "bg-warm-bg text-muted"
            )}
          >
            기업
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "job"}
            onClick={() => setActiveTab("job")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-bold transition-colors",
              activeTab === "job" ? "bg-primary text-white" : "bg-warm-bg text-muted"
            )}
          >
            채용공고
          </button>
        </div>
      </header>

      {activeTab === "company" && (
        <>
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

            {showCompanySkeleton ? (
              <SearchResultListSkeleton variant="company" />
            ) : filteredCompanies.length > 0 ? (
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
            ) : isFetching ? null : (
              <div className="border-warm-border mt-3 rounded-2xl border border-dashed bg-white px-5 py-12 text-center">
                {query.length === 0 ? (
                  <>
                    <p className="text-ink font-semibold">기업을 검색해보세요</p>
                    <p className="text-muted mt-1 text-xs">
                      기업명·업종 입력 후 돋보기를 누르세요.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-ink font-semibold">기업 검색 결과가 없습니다</p>
                    <p className="text-muted mt-1 text-xs">기업명이나 업종을 다시 입력해보세요.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("job")}
                      className="text-primary mt-3 text-sm font-semibold"
                    >
                      채용공고 탭에서 찾아보기
                    </button>
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
        </>
      )}

      {activeTab === "job" && (
        <section className="mt-6">
          <h2 className="text-ink text-base font-bold">
            채용공고 검색 결과 · {jobResults.length}건
          </h2>

          {showJobSkeleton ? (
            <SearchResultListSkeleton variant="job" />
          ) : jobResults.length > 0 ? (
            <>
              <div className="mt-3 space-y-3">
                {visibleJobResults.map((job) => (
                  <JobSearchCard key={job.id} job={job} />
                ))}
              </div>
              {jobResults.length > SEARCH_UI_LIMITS.jobsPreview && (
                <button
                  type="button"
                  onClick={() => setShowAllJobResults((prev) => !prev)}
                  className="border-warm-border text-muted hover:bg-warm-bg mt-3 w-full rounded-2xl border bg-white py-3 text-sm font-semibold transition-colors"
                >
                  {showAllJobResults ? "접기" : `전체 ${jobResults.length}건 보기`}
                </button>
              )}
            </>
          ) : isFetchingJobs ? null : (
            <div className="border-warm-border mt-3 rounded-2xl border border-dashed bg-white px-5 py-12 text-center">
              {query.length === 0 ? (
                <>
                  <p className="text-ink font-semibold">직무·직군으로 채용공고를 검색해보세요</p>
                  <p className="text-muted mt-1 text-xs">
                    예: AI, 백엔드, 프론트엔드 입력 후 돋보기를 누르세요.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-ink font-semibold">검색된 채용공고가 없어요</p>
                  <p className="text-muted mt-1 text-xs">
                    다른 직무·직군 키워드로 다시 입력해보세요.
                  </p>
                </>
              )}
            </div>
          )}
        </section>
      )}
    </section>
  )
}
