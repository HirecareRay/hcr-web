"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronLeft } from "lucide-react"

function ToggleRow({
  label,
  sub,
  value,
  onChange,
}: {
  label: string
  sub?: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="border-warm-border flex items-center justify-between border-b py-4 last:border-b-0">
      <div>
        <p className="text-ink text-sm font-bold">{label}</p>
        {sub && <p className="text-muted mt-0.5 text-xs">{sub}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          value ? "bg-primary" : "bg-warm-bg"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}

export function NotificationsPage() {
  const [settings, setSettings] = useState({
    newJob: true,
    deadline: true,
    report: false,
    interview: true,
    marketing: false,
  })

  const update = (key: keyof typeof settings) => (v: boolean) =>
    setSettings((prev) => ({ ...prev, [key]: v }))

  return (
    <section className="bg-background min-h-full pb-10">
      <header className="border-warm-border border-b bg-white px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <Link href="/mypage" aria-label="뒤로가기">
            <ChevronLeft className="text-muted size-5" />
          </Link>
          <h1 className="text-ink text-base font-bold">알림 설정</h1>
        </div>
      </header>

      <div className="px-5 pt-6">
        <div className="rounded-2xl bg-white px-4">
          <p className="text-muted pt-4 pb-2 text-xs font-bold">채용 알림</p>
          <ToggleRow
            label="신규 공고 알림"
            sub="관심 직무 신규 공고 등록 시"
            value={settings.newJob}
            onChange={update("newJob")}
          />
          <ToggleRow
            label="마감 임박 알림"
            sub="저장한 공고 마감 3일 전"
            value={settings.deadline}
            onChange={update("deadline")}
          />
        </div>

        <div className="mt-4 rounded-2xl bg-white px-4">
          <p className="text-muted pt-4 pb-2 text-xs font-bold">분석·면접 알림</p>
          <ToggleRow
            label="AI 리포트 알림"
            sub="기업 분석 리포트 업데이트 시"
            value={settings.report}
            onChange={update("report")}
          />
          <ToggleRow
            label="AI 면접 결과 알림"
            sub="면접 분석 완료 시"
            value={settings.interview}
            onChange={update("interview")}
          />
        </div>

        <div className="mt-4 rounded-2xl bg-white px-4">
          <p className="text-muted pt-4 pb-2 text-xs font-bold">마케팅</p>
          <ToggleRow
            label="이벤트·혜택 알림"
            sub="프로모션 및 서비스 소식"
            value={settings.marketing}
            onChange={update("marketing")}
          />
        </div>
      </div>
    </section>
  )
}
