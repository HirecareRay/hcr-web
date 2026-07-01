"use client"

import Link from "next/link"
import { Bookmark, BriefcaseBusiness, CalendarDays, ChevronLeft, MapPin } from "lucide-react"

const savedJobs = [
  {
    id: "5e9cabd040c307d7aa142e73",
    companyName: "CJ ENM",
    title: "Data Scientist 채용",
    location: "서울",
    employmentType: "정규직",
    deadline: "2026.07.03",
    status: "open" as const,
  },
  {
    id: "500116c9eb165c7a8f97fbd3",
    companyName: "CJ ENM",
    title: "[Mnet Plus] Web/App Lead 경력채용",
    location: "서울 마포구",
    employmentType: "정규직 (협의)",
    deadline: "상시채용",
    status: "rolling" as const,
  },
]

export function SavedJobsPage() {
  return (
    <section className="bg-background min-h-full pb-10">
      <header className="border-warm-border border-b bg-white px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <Link href="/mypage" aria-label="뒤로가기">
            <ChevronLeft className="text-muted size-5" />
          </Link>
          <h1 className="text-ink text-base font-bold">저장 공고</h1>
        </div>
      </header>

      {savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 pt-24 text-center">
          <div className="bg-warm-bg flex size-20 items-center justify-center rounded-full">
            <Bookmark className="text-disabled size-9" />
          </div>
          <p className="text-ink mt-5 text-base font-bold">저장한 공고가 없어요</p>
          <p className="text-muted mt-2 text-sm">관심 있는 공고를 저장해보세요</p>
          <Link
            href="/jobs"
            className="bg-primary mt-8 rounded-2xl px-6 py-3.5 text-sm font-bold text-white"
          >
            채용공고 보러가기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-5 pt-5">
          <p className="text-muted mb-1 text-xs">
            총 <strong className="text-ink">{savedJobs.length}</strong>개의 저장 공고
          </p>
          {savedJobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="border-warm-border block rounded-2xl border bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <div className="bg-coral-light text-primary flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold">
                  CJ
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-[0.625rem] font-bold ${
                        job.status === "rolling"
                          ? "bg-coral-light text-primary"
                          : "bg-coral-light text-primary"
                      }`}
                    >
                      {job.status === "rolling" ? "상시채용" : "채용중"}
                    </span>
                    <span className="text-muted text-xs">{job.companyName}</span>
                  </div>
                  <p className="text-ink mt-2 text-sm leading-5 font-bold">{job.title}</p>
                </div>
                <Bookmark className="text-primary fill-primary size-5 shrink-0" />
              </div>
              <div className="text-muted mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.6875rem]">
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
                  {job.deadline}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
