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
 *
 * center=true 면 화면 세로 중앙에 크게 띄운다(전용 대기 화면용).
 * center=false(기본)면 콘텐츠 흐름에 맞춰 카드 + 스켈레톤을 위에서부터 쌓는다.
 */

"use client"

import { useEffect, useState } from "react"
import { Check, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface AiAnalyzingLoaderProps {
  /** 카드 헤더 문구 */
  title?: string
  /** 헤더 아래 보조 안내 문구 */
  subtitle?: string
  /** 순차 노출할 분석 단계 문구 */
  steps?: string[]
  /** 각 단계가 완료로 넘어가는 간격(ms) */
  stepIntervalMs?: number
  /** 카드 아래 스켈레톤 블록 개수 (0이면 카드만). center=true 면 무시 */
  skeletonCount?: number
  /** 화면 세로 중앙에 크게 띄우는 전용 대기 화면 모드 */
  center?: boolean
  className?: string
}

const defaultSteps = ["데이터 수집", "핵심 지표 분석", "인사이트 도출", "결과 정리"]

export function AiAnalyzingLoader({
  title = "AI가 분석하고 있어요",
  subtitle = "잠시만 기다려 주세요",
  steps = defaultSteps,
  stepIntervalMs = 1400,
  skeletonCount = 3,
  center = false,
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
    <div
      className={cn(
        "flex flex-col",
        // center: 보이는 영역(main) 높이를 그대로 채워 세로 정중앙에.
        // 기본: 콘텐츠 흐름 위에서부터(카드 + 스켈레톤).
        center ? "min-h-full items-center justify-center px-4 py-10" : "px-4 py-6",
        className
      )}
    >
      <div
        className={cn(
          "from-coral-deep to-coral-beam relative w-full max-w-md self-center overflow-hidden rounded-3xl bg-gradient-to-br text-white shadow-lg",
          center ? "p-7" : "p-5"
        )}
      >
        {/* 카드 위를 훑고 지나가는 광택 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-white/20 blur-md"
          style={{ animation: "aiSheen 2.6s ease-in-out infinite" }}
        />

        {/* 헤더 — 아이콘 배지 + 제목/보조문구 */}
        <div className="relative flex items-center gap-3">
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30",
              center ? "h-12 w-12" : "h-10 w-10"
            )}
          >
            <Sparkles className={cn("animate-pulse", center ? "h-6 w-6" : "h-5 w-5")} />
          </span>
          <div className="min-w-0">
            <p className={cn("leading-tight font-bold", center ? "text-lg" : "text-base")}>
              {title}
            </p>
            {subtitle && <p className="mt-0.5 text-xs text-white/75">{subtitle}</p>}
          </div>
        </div>

        <ul className={cn("relative space-y-3", center ? "mt-6" : "mt-5")}>
          {steps.map((step, index) => {
            const done = index < activeIndex
            const active = index === activeIndex
            return (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-2.5 text-sm transition-all duration-500",
                  done && "text-white/80",
                  active && "font-medium text-white",
                  !done && !active && "text-white/40"
                )}
              >
                <StepMarker done={done} active={active} />
                {step}
              </li>
            )
          })}
        </ul>

        {/* 진행 인디케이터 — 좌우로 흐르는 바 */}
        <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-white/25">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1/4 rounded-full bg-white/90"
            style={{ animation: "aiProgressFlow 1.8s ease-in-out infinite" }}
          />
        </div>
      </div>

      {!center && skeletonCount > 0 && (
        <div className="mt-4 space-y-4">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="bg-skeleton h-40 animate-pulse rounded-2xl" />
          ))}
        </div>
      )}
    </div>
  )
}

function StepMarker({ done, active }: { done: boolean; active: boolean }) {
  if (done) {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/90">
        <Check className="text-coral-deep h-3 w-3" strokeWidth={3} />
      </span>
    )
  }
  if (active) {
    return <Loader2 className="h-5 w-5 shrink-0 animate-spin text-white" />
  }
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
      <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
    </span>
  )
}
