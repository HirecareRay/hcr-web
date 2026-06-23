/**
 * techStackSection.tsx
 *
 * "채용담당자가 기대하는 기술 스택" 랭킹 카드.
 * 1위는 잠금(로그인 유도)으로 흐릿하게 가리고, 2·3위만 공개합니다.
 * 나머지는 "전체 보기"로 유도합니다.
 */

import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
import { routes } from "@/constants/routes"
import type { TechStackRanking } from "../types/home"

export function TechStackSection({ ranking }: { ranking: TechStackRanking }) {
  const lockedItem = ranking.items.find((item) => item.locked)
  const openItems = ranking.items.filter((item) => !item.locked).slice(0, 2)

  return (
    <section className="border-warm-border rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-ink text-base leading-snug font-bold whitespace-pre-line">
        {ranking.question}
      </h2>

      {lockedItem && (
        <div className="bg-warm-bg mt-4 flex items-center gap-3 rounded-xl px-4 py-3">
          <span className="text-primary text-sm font-bold">{lockedItem.rank}위</span>
          <span className="bg-warm-border h-5 flex-1 rounded-full blur-[0.15rem]" aria-hidden />
          <Lock className="text-disabled size-4 shrink-0" />
        </div>
      )}

      <div className="mt-2 grid grid-cols-2 gap-2">
        {openItems.map((item) => (
          <div key={item.rank} className="bg-warm-bg flex items-center gap-2 rounded-xl px-4 py-3">
            <span className="text-muted text-sm font-bold">{item.rank}위</span>
            <span className="text-ink truncate text-sm">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <Link
          href={routes.login}
          className="text-primary flex items-center gap-1 text-xs font-bold"
        >
          전체 보기
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  )
}
