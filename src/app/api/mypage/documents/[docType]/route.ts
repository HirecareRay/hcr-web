import { NextRequest, NextResponse } from "next/server"
import backendAxiosInstance from "@/lib/backendAxiosInstance"
import { AxiosError } from "axios"

const VALID_DOC_TYPES = new Set(["resume", "cover_letter", "portfolio", "work_experience"])

function errorResponse(error: unknown) {
  if (error instanceof AxiosError) {
    return NextResponse.json(
      { error: error.response?.data?.detail ?? "백엔드 통신 오류" },
      { status: error.response?.status ?? 500 }
    )
  }
  return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 })
}

type Context = { params: Promise<{ docType: string }> }

export async function GET(_req: NextRequest, { params }: Context) {
  const { docType } = await params
  if (!VALID_DOC_TYPES.has(docType))
    return NextResponse.json({ error: "잘못된 문서 타입" }, { status: 400 })

  try {
    const response = await backendAxiosInstance.get("/documents/read", {
      params: { doc_type: docType },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PUT(req: NextRequest, { params }: Context) {
  const { docType } = await params
  if (!VALID_DOC_TYPES.has(docType))
    return NextResponse.json({ error: "잘못된 문서 타입" }, { status: 400 })

  try {
    const body = await req.json()
    const response = await backendAxiosInstance.put("/documents/update", body, {
      params: { doc_type: docType },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const { docType } = await params
  if (!VALID_DOC_TYPES.has(docType))
    return NextResponse.json({ error: "잘못된 문서 타입" }, { status: 400 })

  try {
    // ponytail: FastAPI DELETE /documents/delete 미구현 — 구현 시 연동
    const response = await backendAxiosInstance.delete("/documents/delete", {
      params: { doc_type: docType },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    return errorResponse(error)
  }
}
