"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadItem } from "../types/upload"
import { UPLOAD_TYPE_TO_SLUG } from "../hooks/useUpload"

interface Props {
  item: UploadItem
  onUpload: (file: File) => void
}

export default function UploadStepCard({ item, onUpload }: Props) {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const handleUploadClick = () => {
    if (selectedFile) onUpload(selectedFile)
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border p-4">
      {/* left */}
      <div className="flex items-center gap-3">
        <div className="bg-gutter h-10 w-10 flex-shrink-0 rounded-lg" />
        <div>
          <div className="text-ink font-semibold">{item.title}</div>
          <div className={`text-sm ${selectedFile ? "text-primary font-medium" : "text-muted"}`}>
            {selectedFile ? `선택됨: ${selectedFile.name}` : item.description}
          </div>
          {item.exists && (
            <span className="text-xs font-medium text-green-600">
              {item.createdAt ? `${item.createdAt}에 등록됨` : "등록됨"} ✓
            </span>
          )}
        </div>
      </div>

      {/* right */}
      <div className="flex gap-2">
        <label className="bg-warm-bg text-ink border-warm-border hover:bg-coral-light flex min-w-[14ch] cursor-pointer items-center justify-center rounded-xl border px-4 py-2 text-center text-sm whitespace-nowrap transition-colors">
          {selectedFile ? "파일 재선택" : "파일 선택"}
          <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
        </label>

        <button
          onClick={handleUploadClick}
          disabled={!selectedFile || !!item.uploading}
          className={`flex min-w-[10ch] items-center justify-center rounded-xl px-4 py-2 text-center text-sm whitespace-nowrap transition-colors ${
            selectedFile && !item.uploading
              ? "bg-primary hover:bg-coral-beam cursor-pointer text-white"
              : "bg-gutter text-disabled cursor-not-allowed"
          }`}
        >
          {item.uploading ? "파싱 중..." : "업로드"}
        </button>

        {item.exists && (
          <button
            onClick={() => router.push(`/mypage/documents/${UPLOAD_TYPE_TO_SLUG[item.id]}`)}
            className="border-primary text-primary flex min-w-[10ch] items-center justify-center rounded-xl border px-4 py-2 text-center text-sm whitespace-nowrap transition-colors hover:bg-orange-50"
          >
            편집
          </button>
        )}
      </div>
    </div>
  )
}
