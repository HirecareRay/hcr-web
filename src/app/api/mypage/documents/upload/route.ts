// src/app/api/upload/route.ts
import backendAxiosInstance from "@/lib/backendAxiosInstance"
import axios from "axios"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // 1. 클라이언트가 보낸 FormData 읽기
    const incomingFormData = await request.formData()
    const file = incomingFormData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 })
    }

    // 💡 파일명에서 documentType과 진짜 파일명을 분리합니다.
    const originalName = file.name // 예: "resume__my_resume.pdf"
    const separatorIndex = originalName.indexOf("__")

    let documentType = "resume" // 기본값 방어 코드
    // const realFileName = originalName

    if (separatorIndex !== -1) {
      documentType = originalName.substring(0, separatorIndex) // "resume" 추출
      // realFileName = originalName.substring(separatorIndex + 2) // "my_resume.pdf" 추출
    }

    // 2. FastAPI로 보낼 새로운 FormData 객체 생성
    const fastapiFormData = new FormData()

    // 프론트엔드의 카멜케이스 타입을 파이썬 백엔드 매개변수명(스네이크케이스)으로 매핑합니다.
    const backendKeyMap: Record<string, string> = {
      resume: "resume",
      coverLetter: "cover_letter",
      portfolio: "portfolio",
      workExperience: "work_experience",
    }

    // 매핑된 키를 찾고, 없을 경우 기본값으로 원래 값을 사용합니다.
    const actualKey = backendKeyMap[documentType] || documentType

    // Web File 객체를 그대로 append 하면 Next.js(Node.js/Bun)가 내부적으로 처리합니다.
    // 기존의 고정된 'documentType' 문자열 대신, 파이썬 규격에 맞는 actualKey("cover_letter" 등)를 키로 꽂아줍니다.
    fastapiFormData.append(actualKey, file, file.name)

    // 3. FastAPI 백엔드로 외부 요청 송신
    const response = await backendAxiosInstance.post("/documents/upload", fastapiFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    // // 환경변수(예: FASTAPI_URL)가 없다면 실제 FastAPI 주소(예: http://localhost:8000)를 입력하세요.
    // const fastapiUrl = process.env.FASTAPI_URL ?? "http://localhost:8000/documents/upload"

    // const response = await fetch(fastapiUrl, {
    //   method: "POST",
    //   body: fastapiFormData,
    //   // ⚠️ 주의: 'Content-Type' 헤더를 수동으로 지정하지 마세요.
    //   // fetch가 멀티파트 경계선(boundary)을 자동으로 생성해야 FastAPI가 올바르게 파싱합니다.
    // })

    // // 4. FastAPI의 응답 상태에 따른 처리
    // if (!response.ok) {
    //   const errorText = await response.text()
    //   return NextResponse.json(
    //     { error: `FastAPI 서버 에러: ${errorText}` },
    //     { status: response.status }
    //   )
    // }

    const data = await response.data

    // 5. 클라이언트에 최종 성공 응답 반환
    return NextResponse.json({ ok: true, ...data })
  } catch (error: unknown) {
    // 💡 [변경 구간] FastAPI 서버에서 에러 상태 코드(4xx, 5xx)를 반환한 경우 처리
    if (axios.isAxiosError(error) && error.response) {
      const errorText =
        typeof error.response.data === "string"
          ? error.response.data
          : JSON.stringify(error.response.data)

      console.error("FastAPI Server Error:", errorText)
      return NextResponse.json(
        { error: `FastAPI 서버 에러: ${errorText}` },
        { status: error.response.status }
      )
    }
    if (axios.isAxiosError(error)) {
      // 일반 네트워크 에러 또는 기타 BFF 내부 오류 처리
      console.error("BFF Upload Error:", error)
      return NextResponse.json(
        { error: error.message || "BFF 내부 서버 오류가 발생했습니다." },
        { status: 500 }
      )
    }
  }
}
