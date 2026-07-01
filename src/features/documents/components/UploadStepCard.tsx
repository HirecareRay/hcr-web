"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, FileText, FolderOpen, PenLine, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { UploadItem, UploadType } from "../types/upload"
import { UPLOAD_TYPE_TO_SLUG } from "../hooks/useUpload"

interface Props {
  item: UploadItem
  onUpload: (file: File) => void
}

// 문서 종류별 아이콘 — 한눈에 구분되도록 각기 다른 아이콘 사용
const DOC_ICON: Record<UploadType, LucideIcon> = {
  resume: FileText,
  coverLetter: PenLine,
  portfolio: FolderOpen,
  workExperience: Briefcase,
}

export default function UploadStepCard({ item, onUpload }: Props) {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const Icon = DOC_ICON[item.id]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const handleUploadClick = () => {
    if (selectedFile) onUpload(selectedFile)
  }

  const hasFileOrDoc = Boolean(selectedFile) || Boolean(item.exists)

  return (
    <div className="border-warm-border rounded-2xl border bg-white p-4">
      {/* 상단: 아이콘 타일 + 제목/설명 + 상태 뱃지 */}
      <div className="flex items-start gap-3">
        <div className="bg-coral-light text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-ink text-base font-bold">{item.title}</p>
            {item.required && (
              <span className="bg-coral-light text-primary rounded-full px-2 py-0.5 text-xs font-bold">
                필수
              </span>
            )}
            {item.exists && (
              <span className="bg-coral-light text-primary rounded-full px-2 py-0.5 text-xs font-bold">
                등록됨
              </span>
            )}
          </div>
          <p
            className={cn(
              "mt-1 truncate text-sm",
              selectedFile ? "text-primary font-medium" : "text-muted"
            )}
          >
            {selectedFile ? `선택됨: ${selectedFile.name}` : `${item.description} · PDF`}
          </p>
        </div>
      </div>

      {/* 하단: 우측 정렬 컴팩트 액션 */}
      <div className="mt-3 flex justify-end gap-2">
        <label className="bg-warm-bg text-ink border-warm-border hover:bg-coral-light flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors">
          {hasFileOrDoc ? "다시 선택" : "파일 선택"}
          <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
        </label>

        {selectedFile ? (
          <button
            onClick={handleUploadClick}
            className="bg-primary hover:bg-coral-beam flex items-center justify-center rounded-xl px-5 py-2 text-sm font-bold text-white transition-colors"
          >
            업로드
          </button>
        ) : item.exists ? (
          <button
            onClick={() => router.push(`/mypage/documents/${UPLOAD_TYPE_TO_SLUG[item.id]}`)}
            className="border-primary text-primary hover:bg-coral-light flex items-center justify-center rounded-xl border px-5 py-2 text-sm font-bold transition-colors"
          >
            편집
          </button>
        ) : null}
      </div>
    </div>
  )
}
