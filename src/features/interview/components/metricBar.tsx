/**
 * metricBar.tsx
 *
 * 0~100 점수를 가로 막대로 보여주는 단일 지표 행입니다.
 * (데이터셋 차트가 아니라 단일 값 표시이므로 recharts 대신 CSS 막대를 씁니다.)
 *
 * 막대 디자인 스펙(앱 공통): 두께 8px(h-2) · 알약 모서리(rounded-full)
 *   · 연한 바탕 트랙(bg-warm-border/40). recharts 재무 차트(company/financialChart)와
 *   시각 언어를 통일한 값입니다.
 * 레이아웃: [라벨 · 값(우)] / [막대] / [코멘트]
 * 색: 80↑ success / 65↑ primary / 그 외 info
 */

import { cn } from "@/lib/utils"

interface Props {
  label: string
  score: number // 0~100
  value: string // 사람이 읽는 값 (예: "118 WPM")
  comment?: string
}

function barColor(score: number): string {
  if (score >= 80) return "bg-success"
  if (score >= 65) return "bg-primary"
  return "bg-info"
}

export function MetricBar({ label, score, value, comment }: Props) {
  const clamped = Math.max(0, Math.min(100, score))

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-ink text-sm font-medium">{label}</span>
        <span className="text-muted text-xs font-semibold">{value}</span>
      </div>
      <div className="bg-warm-border/40 mt-1.5 h-2 w-full overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full transition-all", barColor(clamped))}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {comment && <p className="text-muted mt-1.5 text-xs leading-relaxed">{comment}</p>}
    </div>
  )
}
