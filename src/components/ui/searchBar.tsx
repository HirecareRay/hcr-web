/**
 * searchBar.tsx
 *
 * 공통 검색 입력 UI. 생김새만 담당하는 프레젠테이셔널 컴포넌트.
 * value/onChange로 제어되며, 상태·이동 로직은 쓰는 쪽(홈·검색 페이지)이 소유한다.
 */

"use client"

import { Search } from "lucide-react"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  ariaLabel?: string
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "기업명 검색",
  ariaLabel = "기업명 검색",
}: SearchBarProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit?.(value)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="text-disabled pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2" />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
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
