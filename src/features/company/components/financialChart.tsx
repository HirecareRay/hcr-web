import { FinancialSection } from "@/features/company/types/company"

interface Props {
  data: FinancialSection
}

export function FinancialChart({ data }: Props) {
  return (
    <div>
      <p className="text-sm text-gray-500">{data.source} · {data.year}</p>
      <p>{data.summary}</p>
    </div>
  )
}
