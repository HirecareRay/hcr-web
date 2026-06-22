/**
 * issueBriefingSection.tsx
 *
 * "기업 이슈 브리핑" 섹션. 기업 태그 + 헤드라인 + 발행일 목록을 보여줍니다.
 */

import { Newspaper } from "lucide-react"
import { SectionHeader } from "./sectionHeader"
import { formatShortDate } from "../lib/formatters"
import type { IssueBriefingItem } from "../types/home"

export function IssueBriefingSection({ issues }: { issues: IssueBriefingItem[] }) {
  return (
    <section>
      <SectionHeader icon={Newspaper} title="기업 이슈 브리핑" />

      <ul className="border-warm-border divide-warm-border divide-y overflow-hidden rounded-2xl border bg-white shadow-sm">
        {issues.map((issue) => (
          <li key={issue.id}>
            <a
              href={issue.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-warm-bg flex items-center gap-3 px-4 py-3 transition-colors"
            >
              <span className="bg-coral-light text-primary shrink-0 rounded-md px-2 py-1 text-xs font-bold">
                {issue.companyTag}
              </span>
              <p className="text-ink min-w-0 flex-1 truncate text-sm">{issue.headline}</p>
              <span className="text-disabled shrink-0 text-xs">
                {formatShortDate(issue.publishedAt)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
