import { ReportSection } from "../reportSection"
import { AiSummary } from "../aiSummary"
import { formatDate } from "../../lib/formatters"
import type { HiringSection as HiringData, JobPosting } from "../../types/company"

interface Props {
  data: HiringData
}

export function HiringSection({ data }: Props) {
  return (
    <ReportSection title="채용 정보" meta={`진행 중 ${data.openings.length}건`}>
      <AiSummary>{data.summary}</AiSummary>

      {data.openings.length > 0 && (
        <ul className="mt-4 space-y-3">
          {data.openings.map((posting) => (
            <JobCard key={posting.id} posting={posting} />
          ))}
        </ul>
      )}
    </ReportSection>
  )
}

/** 마감일 표기 — 상시채용이면 마감일이 없으므로 별도 라벨로 보여줍니다. */
function deadlineLabel(posting: JobPosting): string {
  const { deadline, deadlineType } = posting.workConditions
  if (deadlineType === "rolling" || !deadline) return "상시채용"
  return `마감 ${formatDate(deadline)}`
}

function JobCard({ posting }: { posting: JobPosting }) {
  const { job, qualification, workConditions, process } = posting
  const qualSummary = [qualification.education, qualification.major].filter(Boolean).join(" · ")

  // 공고 링크가 있으면 카드 전체를 새 탭으로 여는 링크로, 없으면 일반 카드로 렌더합니다.
  const Wrapper = posting.url ? "a" : "div"
  const linkProps = posting.url
    ? { href: posting.url, target: "_blank", rel: "noopener noreferrer" }
    : {}

  return (
    <li>
      <Wrapper
        {...linkProps}
        className={`border-warm-border block rounded-xl border p-4 ${
          posting.url ? "hover:border-primary group transition-colors" : ""
        }`}
      >
        <p className="text-ink group-hover:text-primary text-sm font-semibold">{posting.title}</p>

        <div className="text-muted mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {workConditions.employmentType && <span>{workConditions.employmentType}</span>}
          {job.locations.length > 0 && (
            <>
              <span>·</span>
              <span>{job.locations.join(", ")}</span>
            </>
          )}
          <span>·</span>
          <span className="text-primary font-medium">{deadlineLabel(posting)}</span>
        </div>

        {qualSummary && <p className="text-muted mt-2 text-xs">{qualSummary}</p>}

        {job.requirements.length > 0 && (
          <div className="mt-3">
            <p className="text-disabled text-xs font-medium">자격요건</p>
            <ul className="mt-1 space-y-0.5">
              {job.requirements.map((req) => (
                <li key={req} className="text-ink text-xs leading-relaxed">
                  · {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.preferred.length > 0 && (
          <div className="mt-3">
            <p className="text-disabled text-xs font-medium">우대사항</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {job.preferred.map((item) => (
                <span key={item} className="bg-warm-bg text-muted rounded-full px-2.5 py-1 text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {process.length > 0 && (
          <p className="text-disabled mt-3 text-xs leading-relaxed">전형 · {process.join(" → ")}</p>
        )}

        {qualification.documents.length > 0 && (
          <p className="text-disabled mt-1 text-xs">서류 · {qualification.documents.join(", ")}</p>
        )}
      </Wrapper>
    </li>
  )
}
