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

function StatusCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  unit: string
  color: "primary" | "success"
}) {
  return (
    <div className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-1.5">
        <Icon className={`size-4 ${color === "primary" ? "text-primary" : "text-green-500"}`} />
        <span className="text-ink text-xs font-bold">{label}</span>
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <span
          className={`text-3xl leading-none font-extrabold ${
            color === "primary" ? "text-primary" : "text-green-500"
          }`}
        >
          {value}
        </span>
        <span className="text-muted text-sm font-bold">{unit}</span>
      </div>
    </div>
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

export function MyPageDashboard() {
  // 로그인한 사용자 정보 — 미들웨어가 비로그인 진입을 막으므로 보통 채워져 있다.
  const user = useAuthStore((s) => s.user)
  const { handleLogout, isLoading: isLoggingOut } = useLogout()

  return (
    <section className="bg-background min-h-full pb-10">
      {/* 프로필 헤더 바 */}
      <div className="border-warm-border border-b bg-white px-5 pt-10 pb-0">
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
            {["프론트엔드", "스타트업", "신입"].map((tag) => (
              <span key={tag} className="text-primary text-base font-extrabold">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 pb-8">
        {/* 내 분석 현황 */}
        <h2 className="text-ink mt-5 mb-3 text-base font-bold">내 분석 현황</h2>
        <div className="flex gap-3">
          <StatusCard icon={BarChart2} label="직무 적합도" value="85" unit="점" color="success" />
          <StatusCard icon={Sparkles} label="AI 면접 결과" value="82" unit="점" color="primary" />
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
