// app/loading.tsx
//
// 전역 라우트 전환 로딩 폴백. 앱 어디로 이동하든 뜰 수 있으므로,
// 빙글빙글 스피너는 쓰지 않는다(스피너는 실제 LLM 처리·파일 업로드/분석 화면 전용).
// 특정 라우트에 맞는 스켈레톤이 필요하면 그 세그먼트에 loading.tsx 를 따로 둔다.
export default function Loading() {
  return (
    <div className="space-y-4 px-4 py-6">
      <div className="bg-skeleton h-8 w-1/2 animate-pulse rounded-lg" />
      <div className="bg-skeleton h-40 w-full animate-pulse rounded-2xl" />
      <div className="bg-skeleton h-40 w-full animate-pulse rounded-2xl" />
    </div>
  )
}
