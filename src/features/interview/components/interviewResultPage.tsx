"use client"

/**
 * interviewResultPage.tsx
 *
 * AI 모의 면접 결과 리포트의 최상위 컴포넌트입니다.
 * useInterviewResult 훅으로 데이터를 받아 로딩/에러/정상 상태를 분기하고,
 * 정상일 때 각 영역을 3개 탭(종합/피드백/복습)으로 나눠 조합 렌더링합니다.
 *
 * 탭 구성:
 *   종합   : 강점·약점 / 보완점·보완 방법
 *   피드백 : 영역별 레이더 / 표정 / 음성 / 답변
 *   복습   : 질답 스크립트 / 예상 질문 / 이전 연습과의 차이
 */

import { useState } from "react"
import Link from "next/link"
import { FileText, FlaskConical, RotateCcw } from "lucide-react"
import { routes } from "@/constants/routes"
import { useInterviewResult } from "../hooks/useInterviewResult"
import { useInterviewSummaryStore } from "../store/interviewSummaryStore"
import { LiveSummarySection } from "./sections/liveSummarySection"
import { ResultHero } from "./resultHero"
import { ResultTabs } from "./resultTabs"
import { ResultSkeleton } from "./resultSkeleton"
import { StrengthWeaknessSection } from "./sections/strengthWeaknessSection"
import { ImprovementSection } from "./sections/improvementSection"
import { FeedbackOverviewSection } from "./sections/feedbackOverviewSection"
import { ModalFeedbackSection } from "./sections/modalFeedbackSection"
import { ScriptSection } from "./sections/scriptSection"
import { RecommendedQuestionsSection } from "./sections/recommendedQuestionsSection"
import { ComparisonSection } from "./sections/comparisonSection"

interface Props {
  companyId: string
}

const resultTabs = [
  { key: "summary", label: "종합" },
  { key: "feedback", label: "피드백" },
  { key: "review", label: "복습" },
] as const

type TabKey = (typeof resultTabs)[number]["key"]

export function InterviewResultPage({ companyId }: Props) {
  const { data, isLoading, isError, refetch } = useInterviewResult(companyId)
  const [activeTab, setActiveTab] = useState<TabKey>("summary")

  // 방금 끝난 라이브 면접의 실제 채점 결과(WS summary). 없으면 더미 리포트만 노출.
  // 이 값은 "다음 면접 시작" 시점(룸페이지 handleStart)에 비워지므로, 여기서는 읽기만 한다.
  // (결과 페이지 unmount 에서 지우면 StrictMode 더블마운트 때 즉시 사라지므로 그렇게 하지 않음)
  const liveSummary = useInterviewSummaryStore((s) => s.summary)

  if (isLoading) return <ResultSkeleton />
  if (isError || !data) return <ResultError onRetry={() => refetch()} />

  return (
    <div className="px-4 py-6">
      {/* 실데이터: 방금 끝난 면접의 WS 채점 요약 (있을 때만) */}
      {liveSummary && (
        <div className="mb-4">
          <LiveSummarySection summary={liveSummary} />
        </div>
      )}

      {/* 아래 상세 리포트는 아직 더미(샘플) — 실데이터와 분리되도록 분명히 고지 */}
      <SampleReportNotice hasLiveSummary={Boolean(liveSummary)} />

      <ResultHero meta={data.meta} overall={data.overall} feedback={data.feedback} />

      {/* 스크롤해도 탭이 상단에 고정. -mx-4/px-4로 좌우를 꽉 채워 배경이 비치지 않게 함 */}
      <div className="bg-background sticky top-0 z-10 -mx-4 mt-4 mb-4 px-4 pt-1 pb-3">
        <ResultTabs
          tabs={resultTabs}
          active={activeTab}
          onChange={(key) => setActiveTab(key as TabKey)}
        />
      </div>

      <div className="space-y-4">
        {activeTab === "summary" && (
          <>
            <StrengthWeaknessSection strengths={data.strengths} weaknesses={data.weaknesses} />
            <ImprovementSection improvements={data.improvements} />
          </>
        )}

        {activeTab === "feedback" && (
          <>
            <FeedbackOverviewSection feedback={data.feedback} />
            <ModalFeedbackSection title="표정 피드백" data={data.feedback.expression} aiBadge />
            <ModalFeedbackSection title="음성 피드백" data={data.feedback.voice} aiBadge />
            <ModalFeedbackSection title="답변 피드백" data={data.feedback.answer} aiBadge />
          </>
        )}

        {activeTab === "review" && (
          <>
            <ScriptSection script={data.script} />
            <RecommendedQuestionsSection questions={data.recommendedQuestions} />
            <ComparisonSection comparison={data.comparison} />
          </>
        )}
      </div>

      {/* 후속 행동 — 다시 면접 / 기업 분석으로 */}
      <ResultActions companyId={companyId} />
    </div>
  )
}

function SampleReportNotice({ hasLiveSummary }: { hasLiveSummary: boolean }) {
  return (
    <div className="border-warm-border bg-warm-bg text-muted mb-4 flex items-start gap-2 rounded-xl border border-dashed px-3 py-2.5 text-xs leading-relaxed">
      <FlaskConical className="text-disabled mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>
        아래 상세 리포트는 <span className="text-ink font-semibold">샘플 데이터</span>입니다.
        {hasLiveSummary
          ? " 실제 채점 결과는 위 ‘실시간 채점 결과’를 확인하세요. 강점·약점, 표정·음성 점수 등은 분석 인프라 연동 후 실제 값으로 채워집니다."
          : " 강점·약점, 표정·음성 점수 등은 분석 인프라 연동 후 실제 값으로 채워집니다."}
      </span>
    </div>
  )
}

function ResultActions({ companyId }: { companyId: string }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-2">
      <Link
        href={routes.interview(companyId)}
        className="from-coral-deep to-coral-beam flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
      >
        <RotateCcw className="h-4 w-4" />
        다시 면접 보기
      </Link>
      <Link
        href={routes.company(companyId)}
        className="border-warm-border text-ink flex items-center justify-center gap-2 rounded-2xl border bg-white px-4 py-3.5 text-sm font-bold shadow-sm transition-opacity hover:opacity-90"
      >
        <FileText className="h-4 w-4" />
        기업 분석 보기
      </Link>
    </div>
  )
}

function ResultError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-muted text-sm">면접 결과를 불러오지 못했습니다.</p>
      <button
        type="button"
        onClick={onRetry}
        className="bg-primary mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        다시 시도
      </button>
    </div>
  )
}
