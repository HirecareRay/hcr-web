"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadItem } from "../types/upload"

interface Props {
  item: UploadItem
  onUpload: (file: File) => void
}

export default function UploadStepCard({ item, onUpload }: Props) {
  const router = useRouter()

  // 현재 선택된 파일을 담는 로컬 상태
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 파일 선택 input 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  // 업로드 버튼 클릭 핸들러
  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }

  // 카드 전체 클릭 핸들러 (상세/편집 페이지 이동)
  const handleCardClick = () => {
    /**
     * [보안 및 URL 최적화 로직]
     * 1. 외부 주소창에는 식별하기 쉽고 깔끔한 item.title 기반의 가독성 좋은 URL을 띄웁니다.
     * 2. 실제 API 통신이나 백엔드 조회에 필요한 난해한 고유 키값(item.id 등)은
     *    브라우저 임시 저장소(sessionStorage)에 키-값 형태로 은밀하게 보관하여 넘깁니다.
     */
    // if (typeof window !== "undefined") {
    //   // 세션 스토리지에 이 문서의 실제 식별 키값을 임시 저장
    //   sessionStorage.setItem("current_document_key", item.id)
    // }

    // URL에는 유저의 title이 들어가 `documents/보고서_최종본` 같은 형태로 이쁘게 노출됩니다.
    // 공백이나 특수문자가 있을 수 있으므로 encodeURIComponent로 안전하게 인코딩합니다.
    router.push(`/documents/${encodeURIComponent(item.id)}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-colors hover:bg-gray-50"
    >
      {/* left */}
      <div className="flex items-center gap-3">
        {/* 기존 bg-gray-100에서 토큰 기준 bg-gutter로 변경 */}
        <div className="bg-gutter h-10 w-10 flex-shrink-0 rounded-lg" />

        <div>
          {/* 강한 본문 컬러 토큰인 text-ink 적용 */}
          <div className="text-ink font-semibold">{item.title}</div>

          {/* 상황에 맞는 텍스트 컬러 분기 처리 */}
          <div className={`text-sm ${selectedFile ? "text-primary font-medium" : "text-muted"}`}>
            {/* 파일이 선택되면 파일명을, 없으면 기본 설명을 보여줍니다 */}
            {selectedFile ? `선택됨: ${selectedFile.name}` : item.description}
          </div>
        </div>
      </div>

      {/* right - 이벤트 전파 방지 적용 */}
      <div
        className="flex gap-2"
        onClick={(e) => e.stopPropagation()} // 버튼 클릭 시 최상위 div로 클릭 이벤트가 퍼지는 것을 막음
      >
        {/* 1. 파일 선택 버튼 */}
        <label className="bg-warm-bg text-ink border-warm-border hover:bg-coral-light flex min-w-[14ch] cursor-pointer items-center justify-center rounded-xl border px-4 py-2 text-center text-sm whitespace-nowrap transition-colors">
          {selectedFile ? "파일 재선택" : "파일 선택"}
          <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
        </label>

        {/* 2. 실제 업로드 버튼 (선택된 파일이 없으면 비활성화) */}
        <button
          onClick={handleUploadClick}
          disabled={!selectedFile}
          className={`flex min-w-[10ch] items-center justify-center rounded-xl px-4 py-2 text-center text-sm whitespace-nowrap transition-colors ${
            selectedFile
              ? "bg-primary hover:bg-coral-beam cursor-pointer text-white"
              : "bg-gutter text-disabled cursor-not-allowed"
          }`}
        >
          업로드
        </button>
      </div>
    </div>
  )
}
