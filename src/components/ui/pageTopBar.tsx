"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

interface PageTopBarProps {
  title: string
  /** 지정하면 해당 경로로 이동(Link), 생략하면 브라우저 히스토리 뒤로가기(router.back()) */
  backTo?: string
}

/**
 * 앱 공통 상단 바 — 뒤로가기 + 제목.
 *
 * company·mypage·jobs·면접 등에서 반복되던 동일 헤더 마크업을 단일 출처로 통합한다.
 * - `backTo` 지정 → 고정 경로로 이동(Link)
 * - `backTo` 생략 → 들어왔던 화면으로 복귀(router.back())
 */
export function PageTopBar({ title, backTo }: PageTopBarProps) {
  return (
    <header className="border-warm-border border-b bg-white px-5 pt-5 pb-4">
      <div className="flex items-center gap-2">
        <BackControl backTo={backTo} />
        <h1 className="text-ink text-base font-bold">{title}</h1>
      </div>
    </header>
  )
}

function BackControl({ backTo }: { backTo?: string }) {
  const router = useRouter()

  if (backTo) {
    return (
      <Link href={backTo} aria-label="뒤로가기">
        <ChevronLeft className="text-muted size-5" />
      </Link>
    )
  }

  return (
    <button type="button" onClick={() => router.back()} aria-label="뒤로가기">
      <ChevronLeft className="text-muted size-5" />
    </button>
  )
}
