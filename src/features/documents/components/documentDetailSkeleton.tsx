/**
 * documentDetailSkeleton.tsx
 *
 * 이력서·자기소개서·포트폴리오·경력기술서 상세(DocumentView) 로딩 스켈레톤.
 * 문서 종류별로 필드 구성이 달라 정확한 골격 대신, 공통 형태(라벨+값 줄 여러 개를
 * 카드 2~3개로 묶은 형태)로 근사한다.
 */

export function DocumentDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="bg-skeleton h-9 w-20 animate-pulse rounded-xl" />
      </div>
      {[0, 1].map((section) => (
        <div key={section} className="border-warm-border space-y-4 rounded-2xl border bg-white p-4">
          <div className="bg-skeleton h-4 w-24 animate-pulse rounded" />
          {[0, 1, 2].map((row) => (
            <div key={row} className="space-y-1.5">
              <div className="bg-skeleton h-3 w-16 animate-pulse rounded" />
              <div className="bg-skeleton h-4 w-2/3 animate-pulse rounded" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
