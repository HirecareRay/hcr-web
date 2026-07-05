/**
 * fitEntryPage.tsx
 *
 * 적합도 분석(서류 적합도 분석) 진입 화면입니다(네비바 "적합도 분석" → 여기).
 * interviewEntryPage.tsx의 구조를 그대로 따라, 분석을 시작하는 갈래를 한곳에 모읍니다.
 *   ① 채용공고 검색하기(버튼 1개)        → /search
 *   ② 인기 기업(FitCompanyPicks)         → /search?q=[회사명]&tab=company
 *   ③ 인기 기업 채용공고(FitCompanyJobPicks) → 회사별 대표 공고 1건씩, 바로 적합도 분석
 *
 * 홈의 "직군별 채용공고" 섹션을 그대로 재사용하는 대신 검색/트렌딩 기업 기반으로
 * 구성해 홈과 기능이 겹치는 걸 피한다.
 */

"use client"

import Link from "next/link"
import {
  BarChart2,
  Sparkles,
  ArrowRight,
  FileSearch,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react"
import { routes } from "@/constants/routes"
import { FitCompanyPicks } from "./fitCompanyPicks"
import { FitCompanyJobPicks } from "./fitCompanyJobPicks"
import { FitHistoryPicks } from "./fitHistoryPicks"

// 적합도 분석이 어떻게 굴러가는지 4단계로 안내 — 처음 보는 사용자의 막막함을 줄인다.
const flowSteps: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: FileSearch, title: "채용공고 선택", desc: "분석하고 싶은 채용공고를 고르기" },
  { icon: ClipboardCheck, title: "이력서 매칭", desc: "내 이력서·자소서와 자격요건을 대조" },
  { icon: Sparkles, title: "AI 기업 분석", desc: "산업·인재상·조직문화까지 함께 진단" },
  { icon: BarChart2, title: "적합도 리포트", desc: "강점·보완점을 한눈에 확인" },
]

export function FitEntryPage() {
  return (
    <div className="space-y-4 px-4 py-5">
      <header className="space-y-1.5">
        <span className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4" />
          AI 서류 적합도 분석
        </span>
        <h1 className="text-ink text-xl font-bold">내 이력서와 채용공고의 궁합을 확인해 보세요</h1>
        <p className="text-muted text-sm">
          관심 있는 채용공고를 검색해서 바로 분석을 시작해 보세요.
        </p>
      </header>

      {/* ① 채용공고 검색하기 — 지금 동작하는 주 경로 */}
      <Link
        href={routes.search}
        className="from-coral-deep to-coral-beam group flex items-center gap-4 rounded-2xl bg-gradient-to-br px-5 py-4 text-white shadow-sm transition-opacity hover:opacity-90"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
          <FileSearch className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold">채용공고 검색하기</span>
          <span className="block text-sm text-white/85">
            관심 기업·직무로 검색해 바로 분석을 시작해요
          </span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </Link>

      {/* ② 인기 기업 — 눌러서 그 기업 채용공고 검색 결과로 */}
      <FitCompanyPicks />

      {/* ③ 인기 기업의 대표 채용공고 — 회사별 1건씩, 바로 적합도 분석 */}
      <FitCompanyJobPicks />

      {/* 진행 방식 안내 */}
      <section className="border-warm-border space-y-2.5 rounded-2xl border p-4">
        <h2 className="text-ink text-sm font-bold">이렇게 진행돼요</h2>
        <ol className="space-y-2.5">
          {flowSteps.map((step, i) => (
            <li key={step.title} className="flex items-center gap-3">
              <span className="bg-coral-light text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                <step.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-ink text-sm font-semibold">
                  <span className="text-disabled mr-1.5">{i + 1}</span>
                  {step.title}
                </p>
                <p className="text-muted text-xs">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 내 분석 기록 — 마이페이지 목록과 같은 데이터 재사용, 최근 몇 건 미리보기 */}
      <FitHistoryPicks />
    </div>
  )
}
