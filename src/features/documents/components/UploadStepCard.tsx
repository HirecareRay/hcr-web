"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Briefcase,
  CheckCircle2,
  FileText,
  FolderOpen,
  PenLine,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { UploadItem, UploadType } from "../types/upload"
import { UPLOAD_TYPE_TO_SLUG } from "../hooks/useUpload"

interface Props {
  item: UploadItem
  onUpload: (file: File) => Promise<boolean>
  /** 다른 문서가 업로드(파싱) 중이라 이 카드의 조작을 막아야 하면 true */
  disabled?: boolean
}

// 문서 종류별 아이콘 — 한눈에 구분되도록 각기 다른 아이콘 사용
const DOC_ICON: Record<UploadType, LucideIcon> = {
  resume: FileText,
  coverLetter: PenLine,
  portfolio: FolderOpen,
  workExperience: Briefcase,
}

// 완료 배지 노출 시간(ms) — 너무 오래 남아있지 않게 짧게만 보여준다.
const COMPLETE_BADGE_MS = 3000

// MongoDB created_datetime(ISO 문자열) → "YYYY.MM.DD". 파싱 실패 시 원본 반환.
function formatUpdatedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}.${m}.${d}`
}

export default function UploadStepCard({ item, onUpload, disabled = false }: Props) {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showConsent, setShowConsent] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const Icon = DOC_ICON[item.id]

  // 파싱이 끝나는 순간(uploading true → false)을 잡아 완료 배지를 잠깐 띄운다.
  useEffect(() => {
    if (item.uploading) return
    if (!justCompleted) return
    const timer = setTimeout(() => setJustCompleted(false), COMPLETE_BADGE_MS)
    return () => clearTimeout(timer)
  }, [item.uploading, justCompleted])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const openConsent = () => {
    if (!selectedFile) return
    setAgreed(false)
    setShowConsent(true)
  }

  const handleConfirmUpload = async () => {
    if (!selectedFile || !agreed) return
    setShowConsent(false)
    const ok = await onUpload(selectedFile)
    if (ok) {
      setSelectedFile(null)
      setJustCompleted(true)
    }
  }

  const hasFileOrDoc = Boolean(selectedFile) || Boolean(item.exists)

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-colors",
        item.uploading
          ? "border-primary bg-coral-light animate-pulse"
          : "border-warm-border bg-white"
      )}
    >
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
            {item.uploading && (
              <span className="bg-primary rounded-full px-2 py-0.5 text-xs font-bold text-white">
                파싱 중...
              </span>
            )}
            {!item.uploading && justCompleted && (
              <span className="bg-success flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold text-white">
                <CheckCircle2 className="size-3" />
                완료됐어요
              </span>
            )}
          </div>
          <p
            className={cn(
              "mt-1 truncate text-sm",
              selectedFile ? "text-primary font-medium" : "text-muted"
            )}
          >
            {item.uploading
              ? "문서를 분석하고 있어요. 잠시만 기다려 주세요."
              : selectedFile
                ? `선택됨: ${selectedFile.name}`
                : `${item.description} · PDF`}
          </p>
          {!item.uploading && item.exists && item.createdAt && (
            <p className="text-disabled mt-0.5 text-xs">
              마지막 업데이트: {formatUpdatedAt(item.createdAt)}
            </p>
          )}
        </div>
      </div>

      {/* 하단: 우측 정렬 컴팩트 액션 */}
      <div className="mt-3 flex justify-end gap-2">
        <label
          className={cn(
            "bg-warm-bg text-ink border-warm-border flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
            disabled || item.uploading
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-coral-light cursor-pointer"
          )}
        >
          {hasFileOrDoc ? "다시 선택" : "파일 선택"}
          <input
            type="file"
            accept="application/pdf"
            hidden
            disabled={disabled || item.uploading}
            onChange={handleFileChange}
          />
        </label>

        {selectedFile ? (
          <button
            onClick={openConsent}
            disabled={disabled || item.uploading}
            className="bg-primary hover:bg-coral-beam flex items-center justify-center rounded-xl px-5 py-2 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            업로드
          </button>
        ) : item.exists ? (
          <button
            onClick={() => router.push(`/mypage/documents/${UPLOAD_TYPE_TO_SLUG[item.id]}`)}
            disabled={disabled || item.uploading}
            className="border-primary text-primary hover:bg-coral-light flex items-center justify-center rounded-xl border px-5 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            편집
          </button>
        ) : null}
      </div>

      {showConsent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5">
            <p className="text-ink text-base font-bold">제3자 정보 제공 동의</p>
            <p className="text-muted mt-2 text-sm leading-relaxed">
              업로드한 문서는 서류 분석을 위해 AI 분석 처리 업체(제3자)에 제공되며, 분석 목적으로
              이용되며 학습 용도로 사용될 수도 있습니다. 동의하지 않으면 업로드를 진행할 수
              없습니다.
            </p>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="accent-primary size-4"
              />
              <span className="text-ink">제3자 정보 제공에 동의합니다</span>
            </label>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowConsent(false)}
                className="border-warm-border text-muted flex flex-1 items-center justify-center rounded-xl border py-2.5 text-sm font-semibold"
              >
                취소
              </button>
              <button
                onClick={handleConfirmUpload}
                disabled={!agreed}
                className="bg-primary hover:bg-coral-beam flex flex-1 items-center justify-center rounded-xl py-2.5 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
