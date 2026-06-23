/**
 * homeSearchBar.tsx
 *
 * 홈 기업명 검색바. 제출 시 검색어를 쿼리(`?q=`)로 실어 검색 결과 페이지로 이동한다.
 * 입력 UI는 공통 SearchBar를 쓰고, 여기서는 상태와 이동만 담당한다.
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchBar } from "@/components/ui/searchBar"
import { routes } from "@/constants/routes"

export function HomeSearchBar() {
  const router = useRouter()
  const [keyword, setKeyword] = useState("")

  const handleSubmit = (value: string) => {
    router.push(routes.searchWithKeyword(value))
  }

  return <SearchBar value={keyword} onChange={setKeyword} onSubmit={handleSubmit} />
}
