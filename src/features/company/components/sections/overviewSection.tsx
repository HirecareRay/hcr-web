import { ReportSection } from "../reportSection"
import type { OverviewSection as OverviewData } from "../../types/company"

interface Props {
  data: OverviewData
}

export function OverviewSection({ data }: Props) {
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

      <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {data.talentValues && (
          <div>
            <dt className="text-disabled text-xs font-medium">인재상</dt>
            <dd className="text-ink mt-0.5 text-sm">{data.talentValues}</dd>
          </div>
        )}
        {data.websiteUrl && (
          <div>
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
          </div>
        )}
      </dl>

      {data.ceoMessage && (
        <blockquote className="border-warm-border text-muted mt-4 border-l-2 pl-3 text-sm italic">
          {data.ceoMessage}
        </blockquote>
      )}
    </ReportSection>
  )
}
