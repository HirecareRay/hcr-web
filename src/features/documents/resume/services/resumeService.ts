// app/api/documents/resume/services/resumeService.ts
import { NextResponse } from "next/server"
import backendAxiosInstance from "@/lib/backendAxiosInstance" // 인스턴스 경로 확인 필요

export async function GET() {
  try {
    // 인터셉터가 쿠키에서 토큰을 추출해 FastAPI(8000번)로 알아서 토싱합니다.
    const response = await backendAxiosInstance.get("/api/mypage/documents/resume")

    return NextResponse.json(response.data)
  } catch (error: any) {
    const status = error.response?.status ?? 500
    const message = error.response?.data?.detail ?? "Internal Server Error"
    return NextResponse.json({ error: message }, { status })
  }
}
