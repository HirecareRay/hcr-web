/**
 * jobsByRoleSection.tsx
 *
 * "직군별 채용공고" 카드. 백엔드/프론트엔드/AI 탭으로 나눠
 * 각 직군의 실채용공고를 보여줍니다. 공고 1건당 원본공고·적합도분석 버튼을 제공합니다.
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { Briefcase, ClipboardCheck, ExternalLink } from "lucide-react"
import { SectionHeader } from "./sectionHeader"
import { formatShortDate } from "../lib/formatters"
import type { HomeJobPosting, JobRoleGroup } from "../types/home"

export function JobsByRoleSection({ groups }: { groups: JobRoleGroup[] }) {
  const [activeRole, setActiveRole] = useState(groups[0]?.role)
  const activeGroup = groups.find((group) => group.role === activeRole) ?? groups[0]

  if (!activeGroup) return null

  return (
    <section>
      <SectionHeader icon={Briefcase} title="직군별 채용공고" />

      <div className="border-warm-border rounded-2xl border bg-white p-4 shadow-sm">
        {/* 직군 탭 */}
        <div role="tablist" aria-label="직군 선택" className="flex gap-2">
          {groups.map((group) => {
            const isActive = group.role === activeGroup.role
            return (
              <button
                key={group.role}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveRole(group.role)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  isActive ? "bg-primary text-white" : "bg-warm-bg text-muted"
                }`}
              >
                {group.label}
              </button>
            )
          })}
        </div>

        {/* 공고 목록 */}
        {activeGroup.jobs.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {activeGroup.jobs.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </ul>
        ) : (
          <p className="text-muted mt-6 py-4 text-center text-sm">
            진행 중인 {activeGroup.label} 공고가 없어요.
          </p>
        )}
      </div>
    </section>
  )
}

/** 마감일 표기 — 상시채용이면 마감일이 없으므로 별도 라벨로 보여줍니다. */
function deadlineLabel(job: HomeJobPosting): string {
  if (job.deadlineType === "rolling" || !job.deadline) return "상시채용"
  return `~${formatShortDate(job.deadline)}`
}

function JobRow({ job }: { job: HomeJobPosting }) {
  return (
    <li className="border-warm-border rounded-xl border p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-ink min-w-0 flex-1 truncate text-sm font-semibold">{job.title}</p>
        <span className="text-primary shrink-0 text-xs font-medium">{deadlineLabel(job)}</span>
      </div>

      <div className="text-muted mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
        <span className="font-medium">{job.companyName}</span>
        {job.employmentType && (
          <>
            <span>·</span>
            <span>{job.employmentType}</span>
          </>
        )}
        {job.location && (
          <>
            <span>·</span>
            <span>{job.location}</span>
          </>
        )}
      </div>

      {job.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {job.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-warm-bg text-muted rounded-full px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
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
    </li>
  )
}
