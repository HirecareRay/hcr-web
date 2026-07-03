"use client"

/**
 * interviewResultReport.tsx
 *
 * 면접 결과 리포트의 "본문"(데이터가 준비된 상태) 프레젠테이션 컴포넌트입니다.
 * 데이터 로딩/에러는 호출부가 맡고, 이 컴포넌트는 InterviewResult 를 받아
 * 히어로 + 3개 탭(종합/피드백/복습) + 후속 행동만 조합해 렌더합니다.
 *
 * 재사용처:
 *   - InterviewResultPage       : 회사 최신 결과(companyId 로 조회)
 *   - 마이페이지 면접 기록 상세  : 특정 세션(resultId 로 조회)
 *
 * 탭 구성:
 *   종합   : 강점·약점 / 보완점·보완 방법
 *   피드백 : 영역별 레이더 / 표정 / 음성 / 답변
 *   복습   : 질답 스크립트 / 예상 질문 / 이전 연습과의 차이
 */

import { useState } from "react"
import Link from "next/link"
import { FileText, RotateCcw } from "lucide-react"
import { routes } from "@/constants/routes"
import type { InterviewResult } from "../types/interviewResult"
import { ResultHero } from "./resultHero"
import { ResultTabs } from "./resultTabs"
import { StrengthWeaknessSection } from "./sections/strengthWeaknessSection"
import { ImprovementSection } from "./sections/improvementSection"
import { FeedbackOverviewSection } from "./sections/feedbackOverviewSection"
import { ModalFeedbackSection } from "./sections/modalFeedbackSection"
import { ScriptSection } from "./sections/scriptSection"
import { RecommendedQuestionsSection } from "./sections/recommendedQuestionsSection"
import { ComparisonSection } from "./sections/comparisonSection"

interface Props {
  data: InterviewResult
  /** 후속 행동(다시 면접/기업 분석) 링크에 쓰는 회사 식별자 */
  companyId: string
}

const resultTabs = [
  { key: "summary", label: "종합" },
  { key: "feedback", label: "피드백" },
  { key: "review", label: "복습" },
] as const

type TabKey = (typeof resultTabs)[number]["key"]

export function InterviewResultReport({ data, companyId }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("summary")

  return (
    <div className="px-4 py-6">
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
