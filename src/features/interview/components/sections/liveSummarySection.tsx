/**
 * liveSummarySection.tsx
 *
 * 방금 끝난 라이브 면접의 "실제" 채점 결과를 보여주는 블록입니다(WS summary 이벤트).
 * 백엔드(LLM + 비언어 집계)가 내려준 4필드만 그대로 렌더합니다:
 *   종합 점수 · 언어(내용) 피드백 · 비언어(태도) 피드백 · 개선점
 *
 * 아래에 이어지는 11영역 상세 리포트는 아직 더미(샘플)이므로, 이 블록을 "실시간 채점 결과"로
 * 분명히 구분 표기해 사실(실데이터)과 샘플이 섞이지 않게 합니다.
 */

import { Radio, MessageSquare, Eye, ArrowUpRight } from "lucide-react"
import { scoreToGrade } from "../../lib/formatters"
import type { SummaryEvent } from "../../types/interviewProtocol"

interface Props {
  summary: SummaryEvent
}

export function LiveSummarySection({ summary }: Props) {
  const grade = scoreToGrade(summary.overallScore)

  return (
    <section className="from-coral-deep to-coral-beam overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-sm">
      {/* 실데이터임을 분명히 — 아래 샘플 리포트와 구분 */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
        <Radio className="h-3.5 w-3.5" />
        실시간 채점 결과
      </div>

      {/* 종합 점수 + 등급 */}
      <div className="mt-3 flex items-end gap-2">
        <span className="text-4xl leading-none font-extrabold">{summary.overallScore}</span>
        <span className="text-lg font-semibold text-white/80">/ 100</span>
        <span className="ml-1 rounded-full bg-white/20 px-2.5 py-0.5 text-sm font-bold">
          {grade}
        </span>
      </div>

      {/* 언어 · 비언어 피드백 */}
      <div className="mt-4 space-y-2">
        <FeedbackCard icon={<MessageSquare className="h-3.5 w-3.5" />} label="언어 피드백">
          {summary.languageFeedback}
        </FeedbackCard>
        <FeedbackCard icon={<Eye className="h-3.5 w-3.5" />} label="비언어 피드백">
          {summary.nonverbalFeedback}
        </FeedbackCard>
      </div>

      {/* 개선점 */}
      {summary.improvements.length > 0 && (
        <div className="mt-4 rounded-xl bg-white/15 px-3 py-3">
          <p className="text-xs font-semibold text-white/80">개선점</p>
          <ul className="mt-2 space-y-1.5">
            {summary.improvements.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm leading-relaxed">
                <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/80" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function FeedbackCard({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl bg-white/15 px-3 py-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
        {icon}
        {label}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-white/95">{children}</p>
    </div>
  )
}
