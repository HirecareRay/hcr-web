"use client"

import Link from "next/link"
import {
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useJobList } from "../hooks/useJobList"
import { fetchJobs, jobListFixtures } from "../services/jobService"
import type { JobCategory, JobListItem, JobSort } from "../types/job"

const categories: JobCategory[] = ["전체", "개발·데이터", "디자인", "보안"]

const statusLabels = {
  open: "채용중",
  rolling: "상시채용",
  closed: "마감",
} as const

function formatDeadline(job: JobListItem) {
  if (job.status === "rolling") return "상시채용"
  return job.deadline?.replaceAll("-", ".") ?? "마감일 미정"
}

function JobCard({
  job,
  isBookmarked,
  onToggleBookmark,
}: {
  job: JobListItem
  isBookmarked: boolean
  onToggleBookmark: () => void
}) {
  return (
    <article className="border-warm-border rounded-2xl border bg-white p-4">
      <Link href={`/jobs/${job.id}`} className="block">
        <div className="flex items-start gap-3">
          <div className="bg-coral-light text-primary flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold">
            CJ
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-[0.625rem] font-bold",
                  job.status === "closed"
                    ? "bg-warm-bg text-disabled"
                    : "bg-coral-light text-primary"
                )}
              >
                {statusLabels[job.status]}
              </span>
              <span className="text-muted text-xs font-semibold">{job.companyName}</span>
            </div>
            <h2 className="text-ink mt-2 text-sm leading-5 font-bold">{job.title}</h2>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              onToggleBookmark()
            }}
            aria-label={`${job.title} ${isBookmarked ? "찜 해제" : "찜하기"}`}
            className="shrink-0 p-1"
          >
            <Bookmark
              className={cn("size-5", isBookmarked ? "fill-primary text-primary" : "text-disabled")}
            />
          </button>
        </div>

        <div className="text-muted mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[0.6875rem]">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <BriefcaseBusiness className="size-3.5" />
            {job.employmentType}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            {formatDeadline(job)}
          </span>
        </div>
      </Link>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="bg-warm-bg text-muted rounded-full px-2.5 py-1 text-[0.625rem]"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={`/company/${job.companyId}`}
          className="bg-coral-light text-primary flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[0.625rem] font-semibold"
        >
          <Sparkles className="size-3" />
          AI 리포트
        </Link>
      </div>
    </article>
  )
}

export function JobListPage() {
  const [jobs, setJobs] = useState(jobListFixtures)

  useEffect(() => {
    fetchJobs().then(setJobs)
  }, [])

  const {
    keyword,
    updateKeyword,
    category,
    updateCategory,
    showClosed,
    updateShowClosed,
    sort,
    updateSort,
    page,
    setPage,
    totalPages,
    filteredCount,
    paginatedJobs,
    bookmarkedIds,
    toggleBookmark,
  } = useJobList(jobs)

  async function handleToggleBookmark(jobId: string) {
    toggleBookmark(jobId)
    await axiosInstance.post("/api/mypage/saved-jobs", { jobId })
  }

  return (
    <section className="bg-background min-h-full pb-8">
      <header className="border-warm-border border-b bg-white px-5 py-4">
        <p className="text-primary text-xs font-semibold">나에게 맞는 기회를 찾아보세요</p>
        <h1 className="text-ink mt-1 text-lg font-bold">채용공고</h1>

        <label className="border-warm-border bg-warm-bg mt-4 flex items-center gap-2 rounded-2xl border px-4 py-3">
          <Search className="text-disabled size-4 shrink-0" />
          <span className="sr-only">채용공고 검색</span>
          <input
            type="search"
            value={keyword}
            onChange={(event) => updateKeyword(event.target.value)}
            placeholder="직무, 기업, 기술을 검색하세요"
            className="text-ink placeholder:text-disabled min-w-0 flex-1 bg-transparent text-sm"
          />
        </label>
      </header>

      <div className="px-5 py-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => updateCategory(item)}
              aria-pressed={category === item}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold",
                category === item
                  ? "border-primary bg-primary text-white"
                  : "border-warm-border text-muted bg-white"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <label className="text-muted flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={showClosed}
              onChange={(event) => updateShowClosed(event.target.checked)}
              className="size-4 accent-[#ff6b57]"
            />
            마감 공고 포함
          </label>

          <select
            value={sort}
            onChange={(event) => updateSort(event.target.value as JobSort)}
            aria-label="채용공고 정렬"
            className="border-warm-border text-muted rounded-xl border bg-white px-3 py-2 text-xs"
          >
            <option value="recommended">추천순</option>
            <option value="deadline">마감 임박순</option>
            <option value="latest">최신순</option>
          </select>
        </div>

        <p className="text-muted mt-5 mb-3 text-xs">
          총 <strong className="text-ink">{filteredCount}</strong>개의 공고
        </p>

        {paginatedJobs.length > 0 ? (
          <div className="space-y-3">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isBookmarked={bookmarkedIds.includes(job.id)}
                onToggleBookmark={() => handleToggleBookmark(job.id)}
              />
            ))}
          </div>
        ) : (
          <div className="border-warm-border rounded-2xl border border-dashed bg-white px-5 py-14 text-center">
            <p className="text-ink text-sm font-bold">검색 결과가 없어요</p>
            <p className="text-muted mt-1 text-xs">검색어나 필터를 변경해보세요.</p>
          </div>
        )}

        {filteredCount > 0 && (
          <nav aria-label="채용공고 페이지" className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              aria-label="이전 페이지"
              className="border-warm-border text-muted rounded-xl border bg-white p-2 disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-muted text-xs font-semibold">
              <strong className="text-primary">{page}</strong> / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              aria-label="다음 페이지"
              className="border-warm-border text-muted rounded-xl border bg-white p-2 disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </nav>
        )}
      </div>
    </section>
  )
}
