// TODO: 백엔드 미구현 — 연동 시 실제 엔드포인트로 교체
import axiosInstance from "@/lib/axiosInstance"
import { UploadType } from "../types/upload"

export async function uploadFile(file: File, documentType: UploadType): Promise<void> {
  const formData = new FormData()
  const specializedFileName = `${documentType}__${file.name}`
  formData.append("file", file, specializedFileName)

  const { data } = await axiosInstance.post("/api/mypage/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    // BFF→백엔드 LLM 파싱 타임아웃(120s)보다 짧으면 안 되므로 여유를 둔다.
    timeout: 360000,
  })

  if (!data.ok) throw new Error(data.error ?? "upload failed")
}
