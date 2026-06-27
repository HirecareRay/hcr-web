"use client"

import { Suspense } from "react"
import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchBar } from "@/components/ui/searchBar"
import { useSearchResults } from "../hooks/useSearchResults"
import { relatedJobPostingCount, relatedJobPostings } from "../services/searchService"
import type { CompanyCategory, CompanySearchResult, RelatedJobPosting } from "../types/search"

const categories: CompanyCategory[] = ["전체", "미디어"]

function CompanyCard({ company }: { company: CompanySearchResult }) {
  return (
    <article className="border-warm-border bg-warm-bg flex items-center gap-3 rounded-2xl border p-4">
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

      <Link
        href={`/company/${company.id}`}
        className="flex shrink-0 items-center gap-1 rounded-full bg-[#f1ecff] px-3 py-1.5 text-[0.6875rem] font-bold text-[#6d4ae8]"
      >
        <Sparkles className="size-3" />
        AI 리포트
      </Link>
    </article>
  )
}

function JobCard({ jobPosting }: { jobPosting: RelatedJobPosting }) {
  return (
    <button
      type="button"
      className="border-warm-border hover:bg-warm-bg flex w-full items-center justify-between rounded-2xl border bg-white px-5 py-3 text-left transition-colors"
    >
      <span>
        <strong className="text-ink block text-sm font-semibold">{jobPosting.title}</strong>
        <span className="text-muted mt-0.5 block text-xs">
          {jobPosting.employmentType} · {jobPosting.deadline}
        </span>
      </span>
      <ChevronRight className="text-disabled size-4 shrink-0" />
    </button>
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
  const { keyword, setKeyword, selectedCategory, setSelectedCategory, filteredCompanies } =
    useSearchResults()

  return (
    <section className="bg-background min-h-full px-6 pt-7 pb-8">
      <header>
        <p className="text-primary text-sm font-semibold">기업과 공고를 한 번에</p>
        <h1 className="text-ink mt-1 text-2xl font-bold">검색 결과</h1>

        <div className="mt-5">
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            placeholder="기업명 또는 업종을 검색하세요"
            ariaLabel="기업 검색"
          />
        </div>
      </header>

      <section className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-ink text-base font-bold">
            기업 검색 결과 · {filteredCompanies.length}개
          </h2>
          <div className="flex gap-2" aria-label="업종 필터">
            {categories.map((category) => {
              const isSelected = category === selectedCategory

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={isSelected}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-bold transition-colors",
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
        </div>

        {filteredCompanies.length > 0 ? (
          <div className="mt-3 space-y-3">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        ) : (
          <div className="border-warm-border mt-3 rounded-2xl border border-dashed bg-white px-5 py-12 text-center">
            <p className="text-ink font-semibold">검색된 기업이 없어요</p>
            <p className="text-muted mt-1 text-xs">기업명이나 업종을 다시 입력해보세요.</p>
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

        {relatedJobPostings.length > 0 ? (
          <div className="mt-3 space-y-3">
            {relatedJobPostings.map((jobPosting) => (
              <JobCard key={jobPosting.id} jobPosting={jobPosting} />
            ))}
          </div>
        ) : (
          <div className="border-warm-border mt-3 rounded-2xl border border-dashed bg-white px-5 py-8 text-center">
            <p className="text-ink font-semibold">수집된 채용공고 {relatedJobPostingCount}건</p>
            <p className="text-muted mt-1 text-xs leading-5">
              전달받은 데이터에는 공고 제목과 마감일이 없어
              <br />
              목록은 API 연동 후 표시됩니다.
            </p>
          </div>
        )}
      </section>
    </section>
  )
}
