/**
 * resultHero.tsx
 *
 * 결과 리포트 최상단 히어로입니다.
 * 종합 점수·등급·AI 총평 + 면접 메타(회사/직무/일시/소요시간) +
 * 표정·음성·답변 3영역 미니 스코어를 한눈에 보여줍니다.
 */

import { Sparkles } from "lucide-react"
import { formatDuration, formatResultDate } from "../lib/formatters"
import type { FeedbackGroup, OverallScore, ResultMeta } from "../types/interviewResult"

interface Props {
  meta: ResultMeta
  overall: OverallScore
  feedback: FeedbackGroup
}

export function ResultHero({ meta, overall, feedback }: Props) {
  const modalScores = [
    { label: "표정", score: feedback.expression.score },
    { label: "음성", score: feedback.voice.score },
    { label: "답변", score: feedback.answer.score },
  ]

  const modeLabel = meta.mode === "voice" ? "음성 면접" : "텍스트 면접"

  return (
    <section className="from-coral-deep to-coral-beam overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-sm">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
        <Sparkles className="h-3.5 w-3.5" />
        AI 면접 분석 결과
      </div>

      {/* 종합 점수 + 등급 */}
      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl leading-none font-extrabold">{overall.score}</span>
        <span className="text-lg font-semibold text-white/80">/ 100</span>
        <span className="ml-1 rounded-full bg-white/20 px-2.5 py-0.5 text-sm font-bold">
          {overall.grade}
        </span>
      </div>

      {/* AI 총평 */}
      <p className="mt-3 text-sm leading-relaxed text-white/95">{overall.headline}</p>

      {/* 3영역 미니 스코어 */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {modalScores.map((item) => (
          <div key={item.label} className="rounded-xl bg-white/15 px-3 py-2.5 text-center">
            <p className="text-xs font-medium text-white/80">{item.label}</p>
            <p className="mt-0.5 text-lg font-bold">{item.score}</p>
          </div>
        ))}
      </div>

      {/* 면접 메타 */}
      <p className="mt-4 text-xs text-white/75">
        {meta.companyName} · {meta.jobTitle} · {formatResultDate(meta.conductedAt)} ·{" "}
        {formatDuration(meta.durationSec)} · {modeLabel} · 질문 {meta.questionCount}개
      </p>
    </section>
  )
}
