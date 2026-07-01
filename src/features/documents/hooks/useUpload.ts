import { useEffect } from "react"
import { useUploadStore } from "../store/uploadStore"
import { uploadFile } from "../services/uploadService"
import { UploadType } from "../types/upload"
import { documentService, DocSlug } from "../services/documentService"

export const UPLOAD_TYPE_TO_SLUG: Record<UploadType, DocSlug> = {
  resume: "resume",
  coverLetter: "cover_letter",
  portfolio: "portfolio",
  workExperience: "work_experience",
}

export function useUploadFiles() {
  const { items, setFile, setExists } = useUploadStore()

  useEffect(() => {
    items.forEach(({ id }) => {
      documentService
        .exists(UPLOAD_TYPE_TO_SLUG[id])
        .then((exists) => setExists(id, exists))
        .catch(() => {})
    })
    // ponytail: 마운트 1회만 조회
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function upload(type: UploadType, file: File) {
    setFile(type, file)
    try {
      const result = await uploadFile(file, type)
      setExists(type, true)
      return result
    } catch (error) {
      console.log("파일 형식이 잘못되었습니다.", error)
    }
  }

  return { items, upload }
}
