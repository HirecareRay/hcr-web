// TODO: 백엔드 미구현 — 연동 시 실제 엔드포인트로 교체
import axiosInstance from "@/lib/axiosInstance"
import { UploadType } from "../types/upload"

export async function uploadFile(file: File, documentType: UploadType) {
  const formData = new FormData()

  // 💡 파일명 앞에 [타입__]을 강제로 붙여서 보냅니다. (예: resume__my_resume.pdf)
  const specializedFileName = `${documentType}__${file.name}`

  // documentType은 append 하지 않고 오직 file 하나만 보냅니다.
  formData.append("file", file, specializedFileName)

  const { data } = await axiosInstance.post("/api/mypage/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  if (!data.ok) throw new Error("upload failed")

  return data.json()
}
