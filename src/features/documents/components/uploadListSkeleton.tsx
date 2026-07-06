/**
 * uploadListSkeleton.tsx
 *
 * 서류 등록 카드(UploadStepCard) 존재 여부 조회 중 스켈레톤. 이게 없으면 4개 카드가
 * 전부 "미등록" 상태로 먼저 그려졌다가 실제 존재 여부로 바뀌는 깜빡임이 있었다.
 */

function CardSkeleton() {
  return (
    <div className="border-warm-border rounded-2xl border bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="bg-skeleton size-11 shrink-0 animate-pulse rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="bg-skeleton h-4 w-20 animate-pulse rounded" />
          <div className="bg-skeleton h-3 w-40 animate-pulse rounded" />
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <div className="bg-skeleton h-9 w-20 animate-pulse rounded-xl" />
      </div>
    </div>
  )
}

export function UploadListSkeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
