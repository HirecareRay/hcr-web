import UploadList from "@/features/documents/components/UploadList"

export default function UploadPage() {
  return (
    <div className="p-5 pb-24">
      {/* header */}
      <div className="mb-6">
        <div className="inline-block rounded-full bg-orange-200 px-3 py-1 text-[1rem] font-bold">
          STEP 1 / 2
        </div>

        <h1 className="mt-2 text-xl font-bold">내 정보 입력</h1>
        <p className="text-gray-500">이력서와 자기소개서를 업로드해주세요.</p>
      </div>

      {/* list */}
      <UploadList />
    </div>
  )
}
