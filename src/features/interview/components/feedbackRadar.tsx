"use client"

/**
 * feedbackRadar.tsx
 *
 * 표정·음성·답변 세부 지표를 recharts 레이더 차트로 시각화합니다.
 * - financialChart와 동일하게, ResponsiveContainer가 이 환경(React 19 + turbopack)에서
 *   폭 측정을 못 해 차트가 깨지므로 ResizeObserver로 폭을 직접 측정해 숫자로 넘깁니다.
 * - 각 축 = 세부 지표(시선 처리/말 속도/논리 구조 …), 값 = 0~100 정규화 점수.
 */

import { useEffect, useRef, useState } from "react"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts"

interface RadarDatum {
  label: string
  score: number
}

interface Props {
  data: RadarDatum[]
}

const PRIMARY_COLOR = "#ff6b57" // --color-primary
const GRID_COLOR = "#f1d8cf" // --color-warm-border
const AXIS_COLOR = "#666666" // --color-muted
const CHART_HEIGHT = 260

// 부모 폭을 직접 측정 (ResponsiveContainer 대체).
// financialChart.tsx에도 동일 훅이 있어, 두 feature가 더 공유하게 되면
// 공통 위치(lib/hooks)로 추출할 후보입니다(지금은 feature 독립성 위해 로컬 유지).
function useElementWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}

export function FeedbackRadar({ data }: Props) {
  const { ref, width } = useElementWidth()

  return (
    <div ref={ref} style={{ width: "100%", height: CHART_HEIGHT, minWidth: 0, overflow: "hidden" }}>
      {width > 0 && (
        <RadarChart
          width={width}
          height={CHART_HEIGHT}
          data={data}
          margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
        >
          <PolarGrid stroke={GRID_COLOR} />
          <PolarAngleAxis dataKey="label" tick={{ fontSize: 12, fill: AXIS_COLOR }} />
          {/* 0~100 고정 도메인 — 점수가 비율대로 그려지도록(자동 스케일 방지) */}
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="score"
            stroke={PRIMARY_COLOR}
            fill={PRIMARY_COLOR}
            fillOpacity={0.25}
            isAnimationActive={false}
          />
        </RadarChart>
      )}
    </div>
  )
}
