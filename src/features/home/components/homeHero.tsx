/**
 * homeHero.tsx
 *
 * 홈 상단 히어로 — 브랜드명 + 헤드라인 + 부제. 데이터 없는 정적 영역입니다.
 */

export function HomeHero() {
  return (
    <header className="px-1">
      <p className="text-primary text-sm font-bold">HireCareRay</p>

      <h1 className="text-ink mt-2 text-[1.75rem] leading-tight font-extrabold sm:text-[2.25rem]">
        기업 분석부터
        <br />
        AI 면접까지 한 번에
      </h1>

      <p className="text-muted mt-3 text-sm leading-relaxed">
        회사명과 희망직무를 선택하면
        <br />
        보이지 않던 기업 정보를 한번에 봐요.
      </p>
    </header>
  )
}
