/**
 * homePage.tsx
 *
 * 메인(홈) 화면 조립부.
 * 정적 영역(히어로·검색바)은 항상 렌더하고, 피드 영역만
 * 로딩(스켈레톤)·에러(재시도)·정상 상태로 분기합니다.
 */

"use client"

import { RotateCw } from "lucide-react"
import { useHomeFeed } from "../hooks/useHomeFeed"
import { HomeHero } from "./homeHero"
import { HomeSearchBar } from "./homeSearchBar"
import { HomeFeedSkeleton } from "./homeFeedSkeleton"
import { TrendingSection } from "./trendingSection"
import { JobsByRoleSection } from "./jobsByRoleSection"
import { IssueBriefingSection } from "./issueBriefingSection"

export function HomePage() {
  const { data, isLoading, isError, refetch } = useHomeFeed()

  return (
    <div className="space-y-8 px-5 py-6">
      <HomeHero />
      <HomeSearchBar />

      {isLoading && <HomeFeedSkeleton />}

      {isError && (
        <div className="border-warm-border flex flex-col items-center gap-3 rounded-2xl border bg-white py-10">
          <p className="text-muted text-sm">홈 정보를 불러오지 못했어요.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="bg-primary flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white"
          >
            <RotateCw className="size-3.5" />
            다시 시도
          </button>
        </div>
      )}

      {data && (
        <div className="space-y-8">
          <TrendingSection companies={data.trending} />
          <JobsByRoleSection groups={data.jobsByRole} />
          <IssueBriefingSection issues={data.issues} />
        </div>
      )}
    </div>
  )
}
