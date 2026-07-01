/**
 * companyLogo.tsx
 *
 * 인기기업 카드의 로고 원.
 * logoUrl이 있고 정상 로드되면 실제 로고 이미지를, 없거나 로드 실패 시
 * logoText+logoColor 이니셜 원으로 폴백합니다.
 *
 * next/image 대신 일반 <img>를 쓰는 이유: 외부 도메인을 next.config에
 * 등록할 필요 없이 onError 폴백만으로 처리하기 위함입니다.
 *
 * ⚠️ onError만으로는 부족한 케이스: Google 파비콘 등은 로고가 없으면 HTTP 404를
 * 내면서도 본문에 16×16 회색 지구본 PNG를 같이 준다. 브라우저는 이를 "로드 성공"으로
 * 처리해 onError가 안 터지고 지구본이 그대로 그려진다. 그래서 onLoad에서 크기를 보고
 * 너무 작은 이미지(=로고 없음 폴백)는 이니셜 원으로 돌린다. 카드는 80px로 표시하므로
 * 16px급은 로고로 쓸 수 없다(출처 무관하게 동작).
 */

"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type CompanyLogoProps = {
  logoUrl: string | null
  logoText: string
  logoColor: string
  // 로고 원 크기(Tailwind size-* 클래스). 기본은 홈 트렌딩 카드 크기(size-20).
  // 면접 진입 기업칩 등 더 작은 자리에서는 size-16 처럼 넘겨 재사용한다.
  sizeClass?: string
}

export function CompanyLogo({
  logoUrl,
  logoText,
  logoColor,
  sizeClass = "size-20",
}: CompanyLogoProps) {
  const [errored, setErrored] = useState(false)

  if (logoUrl && !errored) {
    return (
      <img
        src={logoUrl}
        alt=""
        onError={() => setErrored(true)}
        onLoad={(e) => {
          // 16px급 이하로 로드된 건 Google 파비콘의 "없음" 지구본 → 이니셜 원으로 폴백
          if (e.currentTarget.naturalWidth <= 16) setErrored(true)
        }}
        className={cn(sizeClass, "rounded-full bg-white object-contain")}
      />
    )
  }

  return (
    <div
      className={cn(
        sizeClass,
        "flex items-center justify-center rounded-full text-sm font-bold text-white"
      )}
      style={{ backgroundColor: logoColor }}
    >
      {logoText}
    </div>
  )
}
