import { ReportSection } from "../reportSection"
import { FinancialChart } from "../financialChart"
import { AiSummary } from "../aiSummary"
import type { FinancialSection as FinancialData } from "../../types/company"

interface Props {
  data: FinancialData
}

export function FinancialSection({ data }: Props) {
  return (
    <ReportSection title="재무 분석" meta={`${data.year} · ${data.source}`}>
      <div className="grid grid-cols-1 gap-6">
        <div className="min-w-0">
          <h3 className="text-muted mb-3 text-sm font-semibold">수익성</h3>
          <FinancialChart indicators={data.profitability} />
        </div>
        <div className="min-w-0">
          <h3 className="text-muted mb-3 text-sm font-semibold">안정성</h3>
          <FinancialChart indicators={data.stability} />
        </div>
      </div>

      <div className="mt-5">
        <AiSummary>{data.summary}</AiSummary>
      </div>
    </ReportSection>
  )
}
