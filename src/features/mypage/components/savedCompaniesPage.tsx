"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, ChevronLeft, Sparkles } from "lucide-react"

const savedCompanies = [
  {
    id: "6a3ca079d7da326c0781963c",
    name: "CJ ENM",
    category: "엔터테인먼트·커머스",
    openJobs: 3,
  },
]

export function SavedCompaniesPage() {
  const router = useRouter()
  return (
    <section className="bg-background min-h-full pb-10">
      <header className="border-warm-border border-b bg-white px-5 pt-10 pb-4">
        <div className="flex items-center gap-2">
          <Link href="/mypage" aria-label="뒤로가기">
            <ChevronLeft className="text-muted size-5" />
          </Link>
          <h1 className="text-ink text-base font-bold">관심 기업</h1>
        </div>
      </header>

      {savedCompanies.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 pt-24 text-center">
          <div className="bg-warm-bg flex size-20 items-center justify-center rounded-full">
            <BookOpen className="text-disabled size-9" />
          </div>
          <p className="text-ink mt-5 text-base font-bold">찜한 기업이 없어요</p>
          <p className="text-muted mt-2 text-sm">관심 있는 기업을 찜해보세요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-5 pt-5">
          {savedCompanies.map((company) => (
            <Link
              key={company.id}
              href={`/company/${company.id}`}
              className="border-warm-border flex items-center gap-4 rounded-2xl border bg-white p-4"
            >
              <div className="bg-coral-light text-primary flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold">
                {company.name.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-ink text-sm font-bold">{company.name}</p>
                <p className="text-muted mt-0.5 text-xs">{company.category}</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="bg-coral-light text-primary rounded-full px-2 py-0.5 text-[0.625rem] font-semibold">
                    채용중 {company.openJobs}건
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="bg-coral-light text-primary flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[0.625rem] font-semibold"
                onClick={(e) => {
                  e.preventDefault()
                  router.push(`/company/${company.id}`)
                }}
              >
                <Sparkles className="size-3" />
                AI 리포트
              </button>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
