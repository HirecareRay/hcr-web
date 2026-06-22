import { ReportSection } from "../reportSection"
import type { OverviewSection as OverviewData, CompanyProfile } from "../../types/company"

interface Props {
  data: OverviewData
}

// 기업 기본정보 표에 노출할 항목(라벨 ↔ profile 키). 빈 값은 렌더 시 건너뜁니다.
const profileRows: { label: string; key: keyof CompanyProfile }[] = [
  { label: "대표자", key: "ceo" },
  { label: "설립", key: "founded" },
  { label: "기업규모", key: "companySize" },
  { label: "기업형태", key: "companyType" },
  { label: "사원수", key: "employeeCount" },
  { label: "매출", key: "revenue" },
  { label: "자본금", key: "capital" },
  { label: "신입초임", key: "entrySalary" },
  { label: "신용등급", key: "creditRating" },
  { label: "주소", key: "address" },
]

export function OverviewSection({ data }: Props) {
  const { profile, history } = data

  return (
    <ReportSection title="기업 개요">
      <p className="text-ink text-sm leading-relaxed">{data.businessDescription}</p>

      {data.mainProductsServices.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.mainProductsServices.map((item) => (
            <span
              key={item}
              className="bg-coral-light text-primary rounded-full px-3 py-1 text-xs font-medium"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {data.talentValues && (
        <div className="bg-warm-bg mt-5 rounded-xl px-4 py-3">
          <p className="text-disabled text-xs font-medium">인재상</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.talentValues
              .split(/[,·]/)
              .map((value) => value.trim())
              .filter(Boolean)
              .map((value) => (
                <span
                  key={value}
                  className="text-primary rounded-full bg-white px-3 py-1 text-sm font-semibold"
                >
                  {value}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* 기업 기본정보 (크롤러 company_profile) */}
      <dl className="border-warm-border divide-warm-border mt-5 divide-y border-y">
        {profileRows
          .filter((row) => Boolean(profile[row.key]))
          .map((row) => (
            <div key={row.key} className="flex gap-3 py-2.5">
              <dt className="text-disabled w-20 shrink-0 text-xs font-medium">{row.label}</dt>
              <dd className="text-ink flex-1 text-sm">{profile[row.key]}</dd>
            </div>
          ))}
        {profile.insurance.length > 0 && (
          <div className="flex gap-3 py-2.5">
            <dt className="text-disabled w-20 shrink-0 text-xs font-medium">4대보험</dt>
            <dd className="flex flex-1 flex-wrap gap-1.5">
              {profile.insurance.map((item) => (
                <span key={item} className="bg-warm-bg text-muted rounded-md px-2 py-0.5 text-xs">
                  {item}
                </span>
              ))}
            </dd>
          </div>
        )}
        {profile.mainBusiness && (
          <div className="flex gap-3 py-2.5">
            <dt className="text-disabled w-20 shrink-0 text-xs font-medium">주요사업</dt>
            <dd className="text-ink flex-1 text-sm leading-relaxed">{profile.mainBusiness}</dd>
          </div>
        )}
      </dl>

      {data.websiteUrl && (
        <dl className="mt-4">
          <dt className="text-disabled text-xs font-medium">홈페이지</dt>
          <dd className="mt-0.5 text-sm">
            <a
              href={data.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:opacity-80"
            >
              {data.websiteUrl}
            </a>
          </dd>
        </dl>
      )}

      {data.ceoMessage && (
        <blockquote className="border-warm-border text-muted mt-4 border-l-2 pl-3 text-sm italic">
          {data.ceoMessage}
        </blockquote>
      )}

      {/* 연혁 (history) — 최신순 타임라인 */}
      {history.length > 0 && (
        <div className="mt-6">
          <p className="text-ink mb-3 text-sm font-bold">연혁</p>
          <ol className="border-warm-border ml-1 border-l-2 pl-4">
            {history.map((entry) => (
              <li key={`${entry.year}-${entry.month}`} className="relative pb-4 last:pb-0">
                <span className="bg-primary absolute top-1 -left-5 h-2 w-2 rounded-full" />
                <p className="text-primary text-xs font-semibold">
                  {entry.year}.{entry.month}
                </p>
                <ul className="mt-1 space-y-1">
                  {entry.events.map((event, idx) => (
                    <li key={idx} className="text-ink text-sm leading-relaxed">
                      {event}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      )}
    </ReportSection>
  )
}
