"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getJobDetail, jobDetailFixtures } from "../services/jobService"
import type { JobDetail } from "../types/job"

const statusLabels = {
  open: "채용중",
  rolling: "상시채용",
  closed: "마감",
} as const

function formatDeadline(job: JobDetail) {
  if (job.status === "rolling") return "상시채용"
  return job.deadline?.replaceAll("-", ".") ?? "마감일 미정"
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-warm-border border-b py-5">
      <h2 className="text-ink mb-3 text-sm font-bold">{title}</h2>
      {children}
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="text-muted flex items-start gap-2 text-sm">
          <span className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function StepList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {items.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <span className="bg-coral-light text-primary rounded-full px-2.5 py-1 text-xs font-semibold">
            {step}
          </span>
          {i < items.length - 1 && <span className="text-disabled text-xs">›</span>}
        </div>
      ))}
    </div>
  )
}

function SimilarJobCard({ job }: { job: JobDetail }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="border-warm-border flex items-center gap-3 rounded-2xl border bg-white p-4"
    >
      <div className="bg-coral-light text-primary flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold">
        CJ
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[0.625rem] font-bold",
              job.status === "closed" ? "bg-warm-bg text-disabled" : "bg-coral-light text-primary"
            )}
          >
            {statusLabels[job.status]}
          </span>
          <span className="text-muted text-xs">
            {job.companyName} · {job.jobName}
          </span>
        </div>
        <p className="text-ink mt-1 text-sm leading-5 font-bold">{job.title}</p>
        <div className="text-muted mt-1 flex gap-3 text-[0.6875rem]">
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3" />
            {formatDeadline(job)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function JobDetailPage({ jobId }: { jobId: string }) {
  const job = getJobDetail(jobId)
  const [bookmarked, setBookmarked] = useState(false)

  if (!job) {
    return (
      <section className="bg-background min-h-full pb-10">
        <header className="border-warm-border border-b bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <Link href="/jobs" aria-label="뒤로가기">
              <ChevronLeft className="text-muted size-5" />
            </Link>
            <h1 className="text-ink text-base font-bold">채용공고</h1>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center px-5 pt-24 text-center">
          <p className="text-ink text-sm font-bold">공고를 찾을 수 없어요</p>
          <Link href="/jobs" className="text-primary mt-3 text-sm font-semibold">
            목록으로 돌아가기
          </Link>
        </div>
      </section>
    )
  }

  const similarJobs = jobDetailFixtures
    .filter((j) => j.category === job.category && j.id !== job.id)
    .slice(0, 2)

  return (
    <section className="bg-background min-h-full pb-10">
      <header className="border-warm-border border-b bg-white px-5 py-4">
        <div className="flex items-center gap-2">
          <Link href="/jobs" aria-label="뒤로가기">
            <ChevronLeft className="text-muted size-5" />
          </Link>
          <h1 className="text-ink text-base font-bold">채용공고</h1>
        </div>
      </header>

      <div className="bg-white px-5 pt-5 pb-6">
        <div className="flex items-start gap-3">
          <div className="bg-coral-light text-primary flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold">
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
            <h2 className="text-ink mt-2 text-base leading-snug font-extrabold">{job.title}</h2>
          </div>
          <button
            type="button"
            onClick={() => setBookmarked((prev) => !prev)}
            aria-label={bookmarked ? "찜 해제" : "찜하기"}
            className="shrink-0 p-1"
          >
            <Bookmark
              className={cn("size-5", bookmarked ? "fill-primary text-primary" : "text-disabled")}
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

        <div className="mt-3 flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="bg-warm-bg text-muted rounded-full px-2.5 py-1 text-[0.625rem]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/company/${job.companyId}`}
            className="bg-coral-light text-primary flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-3 text-sm font-bold"
          >
            <Sparkles className="size-4" />
            AI 기업 분석 리포트
          </Link>
          {job.companyWebsite && (
            <a
              href={job.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="border-warm-border text-muted flex items-center justify-center gap-1.5 rounded-2xl border bg-white px-4 py-3 text-sm font-semibold"
            >
              <ExternalLink className="size-4" />
              기업 사이트
            </a>
          )}
        </div>
      </div>

      <div className="px-5">
        <Section title="공고 소개">
          <p className="text-muted text-sm leading-relaxed">{job.description}</p>
        </Section>

        <Section title="주요 업무">
          <BulletList items={job.responsibilities} />
        </Section>

        <Section title="자격 요건">
          <BulletList items={job.requirements} />
        </Section>

        {job.preferredQualifications.length > 0 && (
          <Section title="우대 사항">
            <BulletList items={job.preferredQualifications} />
          </Section>
        )}

        <Section title="채용 절차">
          <StepList items={job.hiringProcess} />
        </Section>

        <Section title="제출 서류">
          <BulletList items={job.documents} />
        </Section>

        {similarJobs.length > 0 && (
          <div className="py-5">
            <h2 className="text-ink mb-3 text-sm font-bold">유사 직무 공고</h2>
            <div className="flex flex-col gap-3">
              {similarJobs.map((j) => (
                <SimilarJobCard key={j.id} job={j} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
