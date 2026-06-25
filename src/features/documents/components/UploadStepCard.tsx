"use client"

import { useState } from "react"
import { UploadItem } from "../types/upload"

interface Props {
  item: UploadItem
  onUpload: (file: File) => void
}

export default function UploadStepCard({ item, onUpload }: Props) {
  // 현재 선택된 파일을 담는 로컬 상태
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 파일 선택 input 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }
  console.log("item")
  console.log(item)

  // 업로드 버튼 클릭 핸들러
  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border p-4">
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

      {/* right */}
      <div className="flex gap-2">
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
