/**
 * modalFeedbackSection.tsx
 *
 * 멀티모달 피드백 한 영역(표정/음성/답변 중 하나)을 보여주는 공통 섹션입니다.
 * 영역 종합 점수 + 총평 + 세부 지표 막대 목록으로 구성됩니다.
 * 표정·음성은 비전/오디오 추론이므로 aiBadge로 사실과 분리 표시합니다.
 */

import { ResultSection } from "../resultSection"
import { MetricBar } from "../metricBar"
import type { ModalFeedback } from "../../types/interviewResult"

interface Props {
  title: string
  data: ModalFeedback
  aiBadge?: boolean
}

export function ModalFeedbackSection({ title, data, aiBadge }: Props) {
  return (
    <ResultSection title={title} meta={`${data.score}점`} aiBadge={aiBadge}>
      <p className="text-ink text-sm leading-relaxed">{data.summary}</p>

      <div className="mt-4 space-y-4">
        {data.metrics.map((metric) => (
          <MetricBar
            key={metric.label}
            label={metric.label}
            score={metric.score}
            value={metric.value}
            comment={metric.comment}
          />
        ))}
      </div>
    </ResultSection>
  )
}
