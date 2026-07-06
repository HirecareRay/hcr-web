import { useEffect, useState } from "react"
import { useUploadStore } from "../store/uploadStore"
import { uploadFile } from "../services/uploadService"
import { UploadType } from "../types/upload"
import { DocExists, DocSlug, documentService } from "../services/documentService"
import { useAuthStore } from "@/features/auth/store/authStore"
import { logger } from "@/lib/logger"

export const UPLOAD_TYPE_TO_SLUG: Record<UploadType, DocSlug> = {
  resume: "resume",
  coverLetter: "cover_letter",
  portfolio: "portfolio",
  workExperience: "work_experience",
}

export function useUploadFiles() {
  const { items, setFile, setExists, setUploading } = useUploadStore()
  const setDocExists = useAuthStore((s) => s.setDocExists)
  const [isCheckingExists, setIsCheckingExists] = useState(true)

  // existsAll()은 문서별 등록 여부 + 마지막 업데이트(created_datetime)를 한 번에 준다.
  // 전역(authStore)과 카드별(uploadStore) 상태를 여기서 같이 동기화해 중복 조회를 없앤다.
  function syncDocExists(docExists: DocExists) {
    setDocExists(docExists)
    ;(Object.keys(UPLOAD_TYPE_TO_SLUG) as UploadType[]).forEach((type) => {
      const createdAt = docExists[UPLOAD_TYPE_TO_SLUG[type]]
      setExists(type, Boolean(createdAt), createdAt ?? undefined)
    })
  }

  // 페이지 진입마다 서버에서 최신 존재 여부를 가져와 스토어와 동기화
  useEffect(() => {
    documentService
      .existsAll()
      .then(syncDocExists)
      .catch((e) => logger.error("문서 존재 여부 조회 실패", e))
      .finally(() => setIsCheckingExists(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function upload(type: UploadType, file: File): Promise<boolean> {
    // 동시 업로드 방지 — UI에서도 막지만, 훅 레벨에서도 한 번 더 막는다.
    if (items.some((item) => item.uploading)) return false
    setFile(type, file)
    setUploading(type, true)
    try {
      await uploadFile(file, type)
      documentService
        .existsAll()
        .then(syncDocExists)
        .catch((e) => logger.error("문서 존재 여부 조회 실패", e))
      return true
    } catch (error) {
      console.error("업로드 실패:", error)
      return false
    } finally {
      setUploading(type, false)
    }
  }

  return { items, upload, isCheckingExists }
}
