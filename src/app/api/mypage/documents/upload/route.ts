// src/app/api/mypage/documents/upload/route.ts
import { NextResponse } from "next/server"
import { saveDocument, type DocSlug } from "../mockDocumentStore"

// hcr-backend 서버·DB 폐쇄로 실제 LLM 파싱 업로드 대신 파일명만 확인하고
// mockDocumentStore(서버 메모리)에 "업로드됨" placeholder 텍스트를 저장한다.
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// import backendAxiosInstance from "@/lib/backendAxiosInstance"
// import axios from "axios"
//
// const fastapiFormData = new FormData()
// fastapiFormData.append(actualKey, file, file.name)
// const response = await backendAxiosInstance.post("/documents/upload", fastapiFormData, {
//   headers: { "Content-Type": "multipart/form-data" },
//   timeout: 120000, // LLM 파싱 라우트라 기본 30s로는 부족
// })
// return NextResponse.json({ ok: true, ...response.data })
// (실패 시 axios.isAxiosError(error) 로 FastAPI 에러 상태·본문을 그대로 전달)

export async function POST(request: Request) {
  try {
    const incomingFormData = await request.formData()
    const file = incomingFormData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 })
    }

    // 파일명에서 documentType과 진짜 파일명을 분리한다. 예: "resume__my_resume.pdf"
    const originalName = file.name
    const separatorIndex = originalName.indexOf("__")
    const documentType =
      separatorIndex !== -1 ? originalName.substring(0, separatorIndex) : "resume"

    // 프론트엔드의 카멜케이스 타입(UploadType)을 mock 저장소 키(DocSlug)로 매핑한다.
    const docSlugMap: Record<string, DocSlug> = {
      resume: "resume",
      coverLetter: "cover_letter",
      portfolio: "portfolio",
      workExperience: "work_experience",
    }
    const docSlug = docSlugMap[documentType] ?? "resume"
    const realFileName =
      separatorIndex !== -1 ? originalName.substring(separatorIndex + 2) : originalName

    saveDocument(docSlug, `[업로드됨] ${realFileName} — hcr-backend 폐쇄로 mock 파싱 결과입니다.`)

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    console.error("BFF Upload Error:", error)
    return NextResponse.json({ error: "업로드 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}
