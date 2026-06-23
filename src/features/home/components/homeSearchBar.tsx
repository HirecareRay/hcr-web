/**
 * homeSearchBar.tsx
 *
 * 홈 기업명 검색바. 제출 시 검색 결과 페이지로 이동합니다.
 * (검색 페이지는 자체적으로 결과를 다루므로 여기서는 이동만 담당)
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { routes } from "@/constants/routes"

export function HomeSearchBar() {
  const router = useRouter()
  const [keyword, setKeyword] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    router.push(routes.search)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="text-disabled pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2" />

      <input
        type="text"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="기업명 검색"
        aria-label="기업명 검색"
        className="border-warm-border text-ink placeholder:text-disabled focus:border-primary h-14 w-full rounded-full border bg-white pr-16 pl-13 text-sm transition-colors"
      />

      <button
        type="submit"
        aria-label="검색"
        className="bg-primary absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
      >
        <Search className="size-5" />
      </button>
    </form>
  )
}
