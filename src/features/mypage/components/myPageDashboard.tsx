"use client"

import Link from "next/link"
import {
  BarChart2,
  Bell,
  BookOpen,
  ChevronRight,
  FileText,
  Lock,
  LogOut,
  MessageCircle,
  Settings,
  Sparkles,
} from "lucide-react"
import { useAuthStore } from "@/features/auth/store/authStore"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { useFitHistory } from "@/features/analysis/hooks/useFitHistory"
import { useInterviewHistory } from "@/features/interview/hooks/useInterviewHistory"
import type { FitHistoryItem } from "@/features/analysis/types/analysis"
import type { InterviewHistoryItem } from "@/features/interview/types/interviewHistory"

// 가장 최근에 본 직무 적합도 분석 1건 — 어떤 기업·공고인지 바로 알 수 있게 표시.
function FitStatusCard({
  item,
  isLoading,
}: {
  item: FitHistoryItem | undefined
  isLoading: boolean
}) {
  const header = (
    <div className="flex items-center gap-1.5">
      <BarChart2 className="text-success size-4" />
      <span className="text-ink text-xs font-bold">직무 적합도</span>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
        {header}
        <div className="bg-skeleton mt-4 h-4 w-24 animate-pulse rounded" />
        <div className="bg-skeleton mt-2 h-3 w-32 animate-pulse rounded" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
        {header}
        <p className="text-muted mt-4 text-xs leading-relaxed">아직 분석한 공고가 없어요</p>
      </div>
    )
  }

  const href =
    item.jobPostingId && item.companyId
      ? `/jobs/${item.jobPostingId}/fit?companyId=${item.companyId}`
      : "/mypage/analysis"

  return (
    <Link href={href} className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
      {header}
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-success text-3xl leading-none font-extrabold">
          {item.overallPct ?? "-"}
        </span>
        {item.overallPct !== null && <span className="text-muted text-sm font-bold">%</span>}
      </div>
      <p className="text-ink mt-1.5 truncate text-xs font-semibold">
        {item.companyName ?? "기업 미상"}
      </p>
      <p className="text-muted truncate text-[0.6875rem]">{item.jobTitle ?? "직무 미상"}</p>
    </Link>
  )
}

// 가장 최근에 본 AI 면접 결과 1건 — 어떤 기업·공고인지 바로 알 수 있게 표시.
function InterviewStatusCard({
  item,
  isLoading,
}: {
  item: InterviewHistoryItem | undefined
  isLoading: boolean
}) {
  const header = (
    <div className="flex items-center gap-1.5">
      <Sparkles className="text-primary size-4" />
      <span className="text-ink text-xs font-bold">AI 면접 결과</span>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
        {header}
        <div className="bg-skeleton mt-4 h-8 w-12 animate-pulse rounded" />
        <div className="bg-skeleton mt-2 h-3 w-28 animate-pulse rounded" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
        {header}
        <p className="text-muted mt-4 text-xs leading-relaxed">아직 면접 기록이 없어요</p>
      </div>
    )
  }

  return (
    <Link
      href={`/mypage/interview/${item.resultId}`}
      className="flex-1 rounded-2xl bg-white p-4 shadow-sm"
    >
      {header}
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-primary text-3xl leading-none font-extrabold">{item.score}</span>
        <span className="text-muted text-sm font-bold">점</span>
      </div>
      <p className="text-ink mt-1.5 truncate text-xs font-semibold">{item.companyName}</p>
      <p className="text-muted truncate text-[0.6875rem]">{item.jobTitle}</p>
    </Link>
  )
}

function ManageRow({
  icon: Icon,
  title,
  subtitle,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  href: string
}) {
  return (
    <Link href={href} className="flex h-14 items-center gap-3 rounded-2xl bg-white px-4 shadow-sm">
      <div className="bg-coral-light flex size-9 shrink-0 items-center justify-center rounded-xl">
        <Icon className="text-primary size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-ink text-sm font-bold">{title}</p>
        <p className="text-muted text-xs">{subtitle}</p>
      </div>
      <ChevronRight className="text-muted size-4 shrink-0" />
    </Link>
  )
}

function SupportRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: string
}) {
  return (
    <div className="border-warm-border flex cursor-pointer items-center gap-3.5 border-b py-3.5 last:border-b-0">
      <Icon className="text-muted size-4 shrink-0" />
      <span className="text-ink flex-1 text-sm">{label}</span>
      {value && <span className="text-muted text-xs">{value}</span>}
    </div>
  )
}

// 직무 적합도 분석 기록의 jobNames를 빈도순으로 집계 — 자주 본 직무 태그가 위로.
// AI 면접 기록은 jobTitle이 공고 제목 원문이라 태그로 쓰기엔 너무 길어 집계 대상에서 제외.
function topJobTags(fitHistory: FitHistoryItem[] | undefined, max = 3): string[] {
  if (!fitHistory?.length) return []
  const counts = new Map<string, number>()
  for (const item of fitHistory) {
    for (const name of item.jobNames) {
      counts.set(name, (counts.get(name) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([name]) => name)
}

export function MyPageDashboard() {
  // 로그인한 사용자 정보 — 미들웨어가 비로그인 진입을 막으므로 보통 채워져 있다.
  const user = useAuthStore((s) => s.user)
  const { handleLogout, isLoading: isLoggingOut } = useLogout()
  // 각 목록은 최신순 정렬이라 첫 항목이 "가장 최근에 본" 것이다.
  const { data: fitHistory, isLoading: isFitLoading } = useFitHistory()
  const { data: interviewHistory, isLoading: isInterviewLoading } = useInterviewHistory()
  const recentFit = fitHistory?.[0]
  const recentInterview = interviewHistory?.items[0]
  const jobTags = topJobTags(fitHistory)

  return (
    <section className="bg-background min-h-full pb-10">
      {/* 프로필 헤더 바 */}
      <div className="border-warm-border border-b bg-white px-5 pt-5 pb-0">
        <div className="flex items-center justify-between">
          <p className="text-primary text-sm font-extrabold tracking-tight">HireCareRay</p>
          <Link href="/mypage/profile" aria-label="설정">
            <Settings className="text-muted size-5" />
          </Link>
        </div>
        <div className="border-warm-border mt-3 border-b pb-4">
          <p className="text-ink text-2xl font-extrabold">
            {user?.name ?? "사용자"}
            <span className="text-muted text-base font-semibold"> 님</span>
          </p>
        </div>
        <div className="py-4">
          <div className="flex flex-wrap gap-1.5">
            {jobTags.length > 0 ? (
              jobTags.map((tag) => (
                <span key={tag} className="text-primary text-base font-extrabold">
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-muted text-sm">분석 기록이 쌓이면 관심 분야가 표시돼요</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 pb-8">
        {/* 내 분석 현황 */}
        <h2 className="text-ink mt-5 mb-3 text-base font-bold">내 최근 분석 현황</h2>
        <div className="flex gap-3">
          <FitStatusCard item={recentFit} isLoading={isFitLoading} />
          <InterviewStatusCard item={recentInterview} isLoading={isInterviewLoading} />
        </div>

        {/* 내 관리 목록 */}
        <h2 className="text-ink mt-8 mb-3 text-base font-bold">내 관리 목록</h2>
        <div className="flex flex-col gap-2.5">
          <ManageRow
            icon={FileText}
            title="내 이력 정보"
            subtitle="이력서·자기소개서·포트폴리오·경력기술서"
            href="/mypage/documents"
          />
          <ManageRow
            icon={MessageCircle}
            title="AI 면접 기록"
            subtitle="지난 면접 피드백"
            href="/mypage/interview"
          />
          <ManageRow
            icon={BarChart2}
            title="적합도 보고서"
            subtitle="직무 적합도 분석 기록"
            href="/mypage/analysis"
          />
          <ManageRow
            icon={Bell}
            title="알림 설정"
            subtitle="채용·리포트 알림"
            href="/mypage/notifications"
          />
          <ManageRow
            icon={BookOpen}
            title="관심 기업"
            subtitle="찜한 기업 모아보기"
            href="/mypage/saved-companies"
          />
          <ManageRow
            icon={FileText}
            title="저장 공고"
            subtitle="찜한 채용공고 모아보기"
            href="/mypage/saved-jobs"
          />
        </div>

        {/* 고객 지원 */}
        <h2 className="text-ink mt-8 mb-1 text-base font-bold">고객 지원</h2>
        <div className="flex flex-col">
          <SupportRow icon={MessageCircle} label="문의하기" />
          <SupportRow icon={FileText} label="서비스 이용약관" />
          <SupportRow icon={Lock} label="개인정보 처리방침" />
        </div>

        {/* 버전 */}
        <div className="border-warm-border mt-4 flex items-center justify-between border-t pt-4">
          <span className="text-muted text-sm">앱 버전</span>
          <span className="text-primary text-sm font-semibold">version 1.0.0</span>
        </div>

        {/* 로그아웃 */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-muted hover:text-ink border-warm-border mt-6 flex w-full items-center justify-center gap-2 rounded-xl border bg-white py-3 text-sm font-semibold transition-colors disabled:opacity-60"
        >
          <LogOut className="size-4" />
          {isLoggingOut ? "로그아웃 중…" : "로그아웃"}
        </button>
      </div>
    </section>
  )
}
