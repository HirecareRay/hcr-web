import { NextResponse } from "next/server"
import { existsAll } from "../mockDocumentStore"

// hcr-backend 서버·DB 폐쇄로 실제 조회 대신 mockDocumentStore(서버 메모리)를 쓴다.
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// import backendAxiosInstance from "@/lib/backendAxiosInstance"
// import { AxiosError } from "axios"
//
// try {
//   const res = await backendAxiosInstance.get("/documents/exists")
//   return NextResponse.json(res.data)
// } catch (error) {
//   if (error instanceof AxiosError)
//     return NextResponse.json(
//       { error: error.response?.data?.detail ?? "오류" },
//       { status: error.response?.status ?? 500 }
//     )
//   return NextResponse.json({ error: "서버 오류" }, { status: 500 })
// }

export async function GET() {
  return NextResponse.json(existsAll())
}
