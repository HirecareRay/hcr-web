/**
 * feedbackOverviewSection.tsx
 *
 * 피드백 탭 상단 개요 — 표정·음성·답변 세 영역의 종합 점수를 레이더로 한눈에 보여줍니다.
 * 세부 지표(시선/말 속도/논리 …)는 아래 각 영역 섹션의 막대에서 다루므로,
 * 여기서는 "역량 삼각형"만 보여줘 모바일에서도 라벨이 겹치지 않게 합니다.
 */

import { ResultSection } from "../resultSection"
import { FeedbackRadar } from "../feedbackRadar"
import type { FeedbackGroup } from "../../types/interviewResult"

interface Props {
  feedback: FeedbackGroup
}

export function FeedbackOverviewSection({ feedback }: Props) {
  // 영역별 종합 점수만 축으로 씁니다(축 = 영역명, 값 = 0~100).
  const radarData = [
    { label: "표정", score: feedback.expression.score },
    { label: "음성", score: feedback.voice.score },
    { label: "답변", score: feedback.answer.score },
  ]

  return (
    <ResultSection title="영역별 분석" aiBadge>
      <FeedbackRadar data={radarData} />
      <p className="text-disabled mt-2 text-center text-xs leading-relaxed">
        표정·음성은 영상/음성 분석 기반 추론으로, 실제와 다를 수 있습니다.
      </p>
    </ResultSection>
  )
}
