import { PageTopBar } from "@/components/ui/pageTopBar"
import UploadList from "@/features/documents/components/UploadList"

export default function UploadPage() {
  return (
    <section className="bg-background min-h-full pb-24">
      <PageTopBar title="서류 등록" backTo="/mypage" />

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
