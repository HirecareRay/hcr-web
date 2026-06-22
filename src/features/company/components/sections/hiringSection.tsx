import { ReportSection } from "../reportSection"
import { formatDate } from "../../lib/formatters"
import type { HiringSection as HiringData } from "../../types/company"

interface Props {
  data: HiringData
}

export function HiringSection({ data }: Props) {
  return (
    <ReportSection title="채용 정보">
      <p className="text-ink text-sm leading-relaxed">{data.summary}</p>

      {data.openings.length > 0 && (
        <ul className="mt-4 space-y-3">
          {data.openings.map((job) => (
            <li
              key={job.url}
              className="border-warm-border hover:border-primary rounded-xl border p-4 transition-colors"
            >
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-primary text-sm font-semibold"
              >
                {job.title}
              </a>
              <div className="text-muted mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <span>{job.employmentType}</span>
                <span>·</span>
                <span>{job.experienceLevel}</span>
                <span>·</span>
                <span>{job.location}</span>
                <span>·</span>
                <span>마감 {formatDate(job.deadline)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ReportSection>
  )
}
