/**
 * interviewEntryPage.tsx
 *
 * AI 면접 진입 화면입니다(네비바 "AI면접" → 여기).
 * 면접을 시작하는 두 갈래를 한곳에 모읍니다.
 *   ① 기업 없이 바로 시작(일반 면접)        → /interview/general
 *   ② 기업으로 연습하기(트렌딩 기업 바로가기) → /interview/[companyId]
 *
 * ②의 기업 목록은 홈 피드 트렌딩을 재사용한다(InterviewCompanyPicks, 현재 데모/더미).
 * 더 풍부한 기업 선택(검색/실데이터 목록)은 백엔드가 붙는 다음 작업에서 확장한다.
 */

import Link from "next/link"
import {
  Mic,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Captions,
  FileText,
  type LucideIcon,
} from "lucide-react"
import { routes } from "@/constants/routes"
import { InterviewCompanyPicks } from "./interviewCompanyPicks"
import { InterviewHistoryPicks } from "./interviewHistoryPicks"

// 면접이 어떻게 굴러가는지 4단계로 안내 — 처음 보는 사용자의 막막함을 줄인다.
const flowSteps: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: SlidersHorizontal, title: "직무·시간 선택", desc: "지원 직무와 전체 면접 시간을 고르기" },
  { icon: Mic, title: "음성·텍스트 답변", desc: "원하는 방식으로 질문에 답하기" },
  { icon: Captions, title: "실시간 자막·분석", desc: "말하는 동안 자막과 표정·음성 분석" },
  { icon: FileText, title: "결과 리포트", desc: "끝나면 강점·보완점을 한눈에" },
]

export function InterviewEntryPage() {
  return (
    <div className="space-y-4 px-4 py-5">
      <header className="space-y-1.5">
        <span className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4" />
          AI 모의 면접
        </span>
        <h1 className="text-ink text-xl font-bold">실전처럼 면접을 연습해 보세요</h1>
        <p className="text-muted text-sm">
          기업을 고르지 않아도 바로 시작할 수 있어요. 특정 기업으로 연습하고 싶다면 아래에서 기업을
          골라 보세요.
        </p>
      </header>

      {/* ① 기업 없이 바로 시작 — 지금 동작하는 주 경로 */}
      <Link
        href={routes.generalInterview}
        className="from-coral-deep to-coral-beam group flex items-center gap-4 rounded-2xl bg-gradient-to-br px-5 py-4 text-white shadow-sm transition-opacity hover:opacity-90"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
          <Mic className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold">기업 없이 바로 시작</span>
          <span className="block text-sm text-white/85">직무·시간만 골라 일반 면접을 연습해요</span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </Link>

      {/* ② 기업으로 연습하기 — 홈 트렌딩 기업 재사용(client) */}
      <InterviewCompanyPicks />

      {/* 트렌딩에 없는 기업은 검색 → 분석 리포트의 면접 CTA 로 안내 */}
      <Link
        href={routes.search}
        className="text-muted hover:text-ink flex items-center justify-center gap-1 text-sm font-semibold transition-colors"
      >
        찾는 기업이 없나요? 기업 검색하기
        <ArrowRight className="h-4 w-4" />
      </Link>

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

      {/* 내 면접 기록 — 마이페이지 목록과 같은 데이터 재사용, 최근 몇 건 미리보기 */}
      <InterviewHistoryPicks />
    </div>
  )
}
