"use client"

import Link from "next/link"
import { ChevronLeft, FileText, PenLine, Image } from "lucide-react"

function UploadRow({
  icon: Icon,
  title,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  sub: string
}) {
  return (
    <div className="border-warm-border flex items-center gap-4 rounded-2xl border bg-white px-4 py-4">
      <div className="bg-coral-light flex size-12 shrink-0 items-center justify-center rounded-xl">
        <Icon className="text-primary size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-ink text-sm font-bold">{title}</p>
        <p className="text-muted mt-0.5 text-xs">{sub}</p>
      </div>
      <button
        type="button"
        className="bg-primary shrink-0 rounded-xl px-4 py-2 text-xs font-bold text-white"
      >
        업로드
      </button>
    </div>
  )
}

export function ResumePage() {
  return (
    <section className="bg-background min-h-full pb-10">
      <header className="border-warm-border border-b bg-white px-5 py-4">
        <div className="flex items-center gap-2">
          <Link href="/mypage" aria-label="뒤로가기">
            <ChevronLeft className="text-muted size-5" />
          </Link>
          <h1 className="text-ink text-base font-bold">내 이력 정보</h1>
        </div>
      </header>

      <div className="px-5 pt-6">
        <span className="bg-coral-light text-primary rounded-full px-3 py-1 text-[0.625rem] font-bold">
          STEP 1 / 2
        </span>
        <h2 className="text-ink mt-3 text-xl font-extrabold">내 정보 입력</h2>
        <p className="text-muted mt-1 text-sm">이력서와 자기소개서를 업로드해주세요.</p>

        <div className="mt-6 flex flex-col gap-3">
          <UploadRow icon={FileText} title="이력서" sub="PDF 권장" />
          <UploadRow icon={PenLine} title="자기소개서" sub="PDF 권장" />
          <UploadRow icon={Image} title="포트폴리오" sub="PDF (선택)" />
        </div>

        <button
          type="button"
          className="bg-primary mt-8 w-full rounded-2xl py-4 text-sm font-bold text-white disabled:opacity-40"
          disabled
        >
          다음으로
        </button>
      </div>
    </section>
  )
}
