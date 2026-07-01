import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import UploadList from "@/features/documents/components/UploadList"

export default function UploadPage() {
  return (
    <section className="bg-background min-h-full pb-24">
      {/* 상단 바 — 앱 공통 뒤로가기+제목 패턴 (다른 마이페이지 하위 화면과 동일) */}
      <header className="border-warm-border border-b bg-white px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <Link href="/mypage" aria-label="뒤로가기">
            <ChevronLeft className="text-muted size-5" />
          </Link>
          <h1 className="text-ink text-base font-bold">서류 등록</h1>
        </div>
      </header>

      <div className="p-5">
        {/* 스텝 안내 */}
        <div className="mb-6">
          <span className="bg-coral-light text-primary inline-block rounded-full px-3 py-1 text-xs font-bold">
            STEP 1 / 2
          </span>
          <h2 className="text-ink mt-2 text-xl font-bold">내 정보 입력</h2>
          <p className="text-muted mt-1 text-sm">이력서와 자기소개서를 업로드해주세요.</p>
        </div>

        <UploadList />
      </div>
    </section>
  )
}
