/**
 * resultSkeleton.tsx
 *
 * 면접 결과 분석 중 로딩 상태입니다.
 * 단순 스켈레톤보다 "분석 과정"을 노출해, 멀티모달 분석 대기 UX를 자연스럽게 만듭니다.
 */

import { Sparkles } from "lucide-react"

const loadingSteps = ["표정 분석", "음성 분석", "답변 평가", "강점·보완점 도출"]

export function ResultSkeleton() {
  return (
    <div className="px-4 py-6">
      <div className="from-coral-deep to-coral-beam overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-sm">
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4 animate-pulse" />
          AI가 면접을 분석하고 있어요
        </div>
        <ul className="mt-3 space-y-1.5">
          {loadingSteps.map((step, index) => (
            <li
              key={step}
              className="flex items-center gap-2 text-sm text-white/90"
              style={{
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${index * 0.3}s`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-warm-bg h-40 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
