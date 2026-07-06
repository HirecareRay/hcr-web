/**
 * profileEditSkeleton.tsx
 *
 * 회원 정보 수정 폼 로딩 스켈레톤. 실제 값이 오기 전까지 픽스처(더미) 이름·이메일이
 * 입력창에 잠깐 보였다가 바뀌는 걸 막기 위해, 폼과 같은 골격(아바타 + 입력줄 + 칩 그룹)만 보여준다.
 */

export function ProfileEditSkeleton() {
  return (
    <div className="px-5 py-6" aria-hidden>
      <div className="flex flex-col items-center">
        <div className="bg-skeleton size-20 animate-pulse rounded-full" />
        <div className="bg-skeleton mt-3 h-3 w-24 animate-pulse rounded" />
      </div>

      <div className="mt-7 space-y-5">
        {[0, 1].map((i) => (
          <div key={i}>
            <div className="bg-skeleton mb-2 h-4 w-12 animate-pulse rounded" />
            <div className="bg-skeleton h-11 w-full animate-pulse rounded-2xl" />
          </div>
        ))}

        {[0, 1].map((i) => (
          <div key={i}>
            <div className="bg-skeleton mb-2 h-4 w-16 animate-pulse rounded" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="bg-skeleton h-7 w-16 animate-pulse rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
