import { ReportSection } from "../reportSection"
import { formatDate } from "../../lib/formatters"
import type { GrowthSection as GrowthData } from "../../types/company"

interface Props {
  data: GrowthData
}

export function GrowthSection({ data }: Props) {
  return (
    <ReportSection title="성장성 · 뉴스">
      <p className="text-ink text-sm leading-relaxed">{data.summary}</p>

      {data.news.length > 0 && (
        <ul className="divide-warm-border mt-4 divide-y">
          {data.news.map((item) => (
            <li key={item.url} className="py-3">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-primary text-sm font-semibold"
              >
                {item.title}
              </a>
              <p className="text-disabled mt-0.5 text-xs">
                {item.source} · {formatDate(item.publishedAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </ReportSection>
  )
}
