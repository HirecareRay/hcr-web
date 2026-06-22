/**
 * reportSection.tsx
 *
 * 보고서 각 섹션을 감싸는 공통 카드 래퍼입니다.
 * 제목 + 우측 부가정보(출처/연도 등) + 본문 영역을 일관된 스타일로 보여줍니다.
 */

interface Props {
  title: string
  meta?: string
  children: React.ReactNode
}

export function ReportSection({ title, meta, children }: Props) {
  return (
    <section className="border-warm-border rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-ink text-base font-bold">{title}</h2>
        {meta && <span className="text-disabled text-xs">{meta}</span>}
      </div>
      {children}
    </section>
  )
}
