import { useEffect } from "react"
import { useUploadStore } from "../store/uploadStore"
import { uploadFile } from "../services/uploadService"
import { UploadType } from "../types/upload"
import { DocSlug, documentService } from "../services/documentService"
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
  const docExists = useAuthStore((s) => s.docExists)
  const setDocExists = useAuthStore((s) => s.setDocExists)

  // 페이지 진입마다 서버에서 최신 존재 여부를 가져와 스토어와 동기화
  useEffect(() => {
    documentService
      .exists()
      .then(setDocExists)
      .catch((e) => logger.error("문서 존재 여부 조회 실패", e))
  }, [])

  useEffect(() => {
    if (!docExists) return
    items.forEach(({ id }) => {
      const val = docExists[UPLOAD_TYPE_TO_SLUG[id]]
      setExists(id, val !== null, val ?? undefined)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docExists])

  async function upload(type: UploadType, file: File): Promise<boolean> {
    setFile(type, file)
    setUploading(type, true)
    try {
      await uploadFile(file, type)
      setExists(type, true)
      documentService
        .exists()
        .then(setDocExists)
        .catch((e) => logger.error("문서 존재 여부 조회 실패", e))
      return true
    } catch (error) {
      console.error("업로드 실패:", error)
      return false
    } finally {
      setUploading(type, false)
    }
  }

  return { items, upload }
}
