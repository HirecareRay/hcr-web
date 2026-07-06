"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { routes } from "@/constants/routes"
import { useUploadFiles } from "../hooks/useUpload"
import UploadStepCard from "./UploadStepCard"
import { UploadListSkeleton } from "./uploadListSkeleton"
import { useDelayedLoading } from "@/hooks/useDelayedLoading"

export default function UploadList() {
  const { items, upload, isCheckingExists } = useUploadFiles()
  const anyUploading = items.some((item) => item.uploading)
  const resumeExists = items.find((i) => i.id === "resume")?.exists
  const showSkeleton = useDelayedLoading(isCheckingExists)

  if (showSkeleton) return <UploadListSkeleton />
  if (isCheckingExists) return null

  return (
    <div className="space-y-3">
      {resumeExists && (
        <Link
          href={routes.fitEntry}
          className="from-coral-deep to-coral-beam group flex items-center gap-4 rounded-2xl bg-gradient-to-br px-5 py-4 text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-bold">적합도 분석 하러 가기</span>
            <span className="block text-sm text-white/85">
              등록한 이력서로 맞춤 적합도 분석을 시작해요
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
      {items.map((item) => (
        <UploadStepCard
          key={item.id}
          item={item}
          onUpload={(file) => upload(item.id, file)}
          disabled={anyUploading && !item.uploading}
        />
      ))}
    </div>
  )
}
