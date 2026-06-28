// hooks/useUpload.ts
import { useUploadStore } from "../store/uploadStore"
import { uploadFile } from "../services/uploadService"
import { UploadType } from "../types/upload"

export function useUploadFiles() {
  const { items, setFile } = useUploadStore()

  // type 인자를 any 대신 정확한 타입으로 지정합니다.
  async function upload(type: UploadType, file: File) {
    setFile(type, file)
    try {
      // 서비스 함수에 파일과 타입을 함께 전달합니다.
      const result = await uploadFile(file, type)
      console.log("parsed result:", result)
      return result
    } catch (error) {
      console.log("파일 형식이 잘못되었습니다.", error)
    }
  }

  return { items, upload }
}
