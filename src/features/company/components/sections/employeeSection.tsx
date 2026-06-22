import { ReportSection } from "../reportSection"
import { formatKrwShort } from "../../lib/formatters"
import type { EmployeeSection as EmployeeData } from "../../types/company"

interface Props {
  data: EmployeeData
}

function ratio(part: number, total: number): string {
  if (total <= 0) return "0%"
  return `${Math.round((part / total) * 100)}%`
}

export function EmployeeSection({ data }: Props) {
  const stats = [
    { label: "총 임직원", value: `${data.totalCount.toLocaleString()}명` },
    {
      label: "남 / 여",
      value: `${data.maleCount.toLocaleString()} / ${data.femaleCount.toLocaleString()}명`,
    },
    { label: "평균 연봉", value: formatKrwShort(data.avgSalary) },
    {
      label: "평균 근속",
      value: data.avgTenureYears === null ? "—" : `${data.avgTenureYears}년`,
    },
  ]

  return (
    <ReportSection title="임직원 현황" meta={`${data.year} · ${data.source}`}>
      <dl className="grid grid-cols-4 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-warm-bg rounded-xl px-2 py-3 text-center">
            <dt className="text-disabled text-xs font-medium">{stat.label}</dt>
            <dd className="text-ink mt-1 text-sm font-bold">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs font-medium">
          <span style={{ color: "#2f6fed" }}>남성 {ratio(data.maleCount, data.totalCount)}</span>
          <span className="text-primary">여성 {ratio(data.femaleCount, data.totalCount)}</span>
        </div>
        <div className="bg-warm-border/40 flex h-2 w-full overflow-hidden rounded-full">
          <div
            className="h-full"
            style={{ width: ratio(data.maleCount, data.totalCount), backgroundColor: "#2f6fed" }}
          />
          <div
            className="bg-primary h-full"
            style={{ width: ratio(data.femaleCount, data.totalCount) }}
          />
        </div>
      </div>
    </ReportSection>
  )
}
