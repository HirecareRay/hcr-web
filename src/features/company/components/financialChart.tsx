"use client"

/**
 * financialChart.tsx
 *
 * 재무 지표를 recharts 가로 막대 차트로 시각화합니다.
 * - ResponsiveContainer가 이 환경(React 19 + turbopack)에서 폭 측정을 못 해 막대가 0으로
 *   깨지므로, 폭을 ResizeObserver로 직접 측정해 BarChart에 숫자로 넘깁니다.
 * - 가독성을 위해 수익성/안정성은 화면 폭과 무관하게 항상 1열(전체 폭)로 쌓습니다.
 *   (과거 2열에선 좁은 컬럼 + 고정 크롬 탓에 막대가 minPointSize로 붕괴했음)
 * - 컨테이너 minWidth:0 + overflow:hidden은 좁은 컨테이너에서도 폭 측정이 안전하도록 유지.
 * - 레이아웃: [항목명(좌)] · [막대(좌→우, 길이=|값|)] · [값(우)] — 3단 분리라 안 겹침
 * - 부호 구분: 양수=코랄, 음수=파랑 + 값의 − 기호 (한국 재무 관례)
 */

import { useEffect, useRef, useState } from "react"
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts"
import { formatIndicator } from "../lib/formatters"
import type { FinancialIndicator } from "../types/company"

interface Props {
  indicators: FinancialIndicator[]
}

const POSITIVE_COLOR = "#ff6b57" // --color-primary (코랄/레드, 양수)
const NEGATIVE_COLOR = "#2f6fed" // 파랑 (음수)
const INK_COLOR = "#1a1a1a" // --color-ink
const AXIS_COLOR = "#666666" // --color-muted
const ROW_HEIGHT = 34

interface ChartDatum {
  label: string
  magnitude: number // 막대 길이 = |값|
  display: string // 값 라벨(부호 포함) 예: "-11.1%"
  isNegative: boolean
}

function toChartData(indicators: FinancialIndicator[]): ChartDatum[] {
  return indicators.map((item) => ({
    label: item.label,
    magnitude: item.value === null ? 0 : Math.abs(item.value),
    display: item.value === null ? "—" : formatIndicator(item.value, item.unit),
    isNegative: item.value !== null && item.value < 0,
  }))
}

// 막대 오른쪽 끝에 부호색 값 라벨을 그립니다.
interface LabelProps {
  x?: string | number
  y?: string | number
  width?: string | number
  height?: string | number
  index?: number
}

function ValueLabel(data: ChartDatum[]) {
  return function render(props: LabelProps) {
    const x = Number(props.x ?? 0)
    const y = Number(props.y ?? 0)
    const width = Number(props.width ?? 0)
    const height = Number(props.height ?? 0)
    const datum = data[props.index ?? 0]
    if (!datum) return null

    return (
      <text
        x={x + width + 8}
        y={y + height / 2}
        dy={4}
        textAnchor="start"
        fill={datum.isNegative ? NEGATIVE_COLOR : INK_COLOR}
        fontSize={14}
        fontWeight={700}
      >
        {datum.display}
      </text>
    )
  }
}

/** 부모 폭을 직접 측정 (ResponsiveContainer 대체) */
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

export function FinancialChart({ indicators }: Props) {
  const data = toChartData(indicators)
  const maxMagnitude = Math.max(1, ...data.map((d) => d.magnitude))
  const { ref, width } = useElementWidth()
  const height = data.length * ROW_HEIGHT

  return (
    <div ref={ref} style={{ width: "100%", height, minWidth: 0, overflow: "hidden" }}>
      {width > 0 && (
        <BarChart
          width={width}
          height={height}
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 64, bottom: 4, left: 8 }}
        >
          <XAxis type="number" hide domain={[0, maxMagnitude * 1.15]} />
          <YAxis
            type="category"
            dataKey="label"
            width={84}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: AXIS_COLOR }}
          />
          <Bar
            dataKey="magnitude"
            barSize={11}
            radius={[0, 4, 4, 0]}
            minPointSize={4}
            isAnimationActive={false}
          >
            {data.map((datum) => (
              <Cell key={datum.label} fill={datum.isNegative ? NEGATIVE_COLOR : POSITIVE_COLOR} />
            ))}
            <LabelList content={ValueLabel(data)} />
          </Bar>
        </BarChart>
      )}
    </div>
  )
}
