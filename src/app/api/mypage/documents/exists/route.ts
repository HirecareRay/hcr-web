import { NextResponse } from "next/server"
import backendAxiosInstance from "@/lib/backendAxiosInstance"
import { AxiosError } from "axios"

export async function GET() {
  try {
    const res = await backendAxiosInstance.get("/documents/exists")
    return NextResponse.json(res.data)
  } catch (error) {
    if (error instanceof AxiosError)
      return NextResponse.json(
        { error: error.response?.data?.detail ?? "오류" },
        { status: error.response?.status ?? 500 }
      )
    return NextResponse.json({ error: "서버 오류" }, { status: 500 })
  }
}
