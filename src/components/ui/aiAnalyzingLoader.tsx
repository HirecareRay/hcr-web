/**
 * aiAnalyzingLoader.tsx
 *
 * LLM 분석 대기 공용 로딩 UI (생김새만 — 어디서나 재사용).
 * 단순 스피너 대신 "분석 과정"을 순차적으로 노출해, 긴 LLM 대기 시간을
 * 자연스럽게 채운다. 기업 리포트·면접 결과 등 분석 대기 화면에서 공용으로 쓴다.
 *
 * 단계는 steps 순서대로 진행되며,
 *   - 완료된 단계: 체크 표시 + 뚜렷하게
 *   - 진행 중 단계: 회전 스피너로 강조
 *   - 대기 단계: 흐린 점
 * 마지막 단계는 응답이 올 때까지 계속 "진행 중"으로 남겨 둔다.
 */

"use client"

import { useEffect, useState } from "react"
import { Check, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AiAnalyzingLoaderProps {
  /** 카드 헤더 문구 */
  title?: string
  /** 순차 노출할 분석 단계 문구 */
  steps?: string[]
  /** 각 단계가 완료로 넘어가는 간격(ms) */
  stepIntervalMs?: number
  /** 카드 아래 스켈레톤 블록 개수 (0이면 카드만) */
  skeletonCount?: number
  className?: string
}

const defaultSteps = ["데이터 수집", "핵심 지표 분석", "인사이트 도출", "결과 정리"]

export function AiAnalyzingLoader({
  title = "AI가 분석하고 있어요",
  steps = defaultSteps,
  stepIntervalMs = 1400,
  skeletonCount = 3,
  className,
}: AiAnalyzingLoaderProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    // 마지막 단계는 응답 도착 전까지 계속 진행 중으로 남긴다.
    if (activeIndex >= steps.length - 1) return
    const timer = setTimeout(() => setActiveIndex((prev) => prev + 1), stepIntervalMs)
    return () => clearTimeout(timer)
  }, [activeIndex, steps.length, stepIntervalMs])

  return (
    <div className={cn("px-4 py-6", className)}>
      <div className="from-coral-deep to-coral-beam relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-sm">
        {/* 카드 위를 훑고 지나가는 광택 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-white/20 blur-md"
          style={{ animation: "aiSheen 2.6s ease-in-out infinite" }}
        />

        <div className="relative flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4 animate-pulse" />
          {title}
        </div>

        <ul className="relative mt-4 space-y-2.5">
          {steps.map((step, index) => {
            const done = index < activeIndex
            const active = index === activeIndex
            return (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-2 text-sm transition-all duration-500",
                  done && "text-white/80",
                  active && "font-medium text-white",
                  !done && !active && "text-white/45"
                )}
              >
                <StepMarker done={done} active={active} />
                {step}
              </li>
            )
          })}
        </ul>

        {/* 진행 인디케이터 — 좌우로 흐르는 바 */}
        <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-white/25">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1/4 rounded-full bg-white/90"
            style={{ animation: "aiProgressFlow 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>

      {skeletonCount > 0 && (
        <div className="mt-4 space-y-4">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="bg-warm-bg h-40 animate-pulse rounded-2xl" />
          ))}
        </div>
      )}
    </div>
  )
}

function StepMarker({ done, active }: { done: boolean; active: boolean }) {
  if (done) {
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/90">
        <Check className="text-coral-deep h-2.5 w-2.5" strokeWidth={3} />
      </span>
    )
  }
  if (active) {
    return <Loader2 className="h-4 w-4 shrink-0 animate-spin text-white" />
  }
  return <span className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
}
