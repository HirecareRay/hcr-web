import { NextRequest, NextResponse } from "next/server"
import { deleteDocument, getDocument, saveDocument, type DocSlug } from "../mockDocumentStore"

const VALID_DOC_TYPES = new Set(["resume", "cover_letter", "portfolio", "work_experience"])

// hcr-backend 서버·DB 폐쇄로 실제 조회/저장/삭제 대신 mockDocumentStore(서버 메모리)를 쓴다.
// 아래는 원래 FastAPI 프록시 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// import backendAxiosInstance from "@/lib/backendAxiosInstance"
// import { AxiosError } from "axios"
//
// function errorResponse(error: unknown) {
//   if (error instanceof AxiosError) {
//     return NextResponse.json(
//       { error: error.response?.data?.detail ?? "백엔드 통신 오류" },
//       { status: error.response?.status ?? 500 }
//     )
//   }
//   return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 })
// }
//
// GET: backendAxiosInstance.get("/documents/read", { params: { doc_type: docType } })
// PUT: backendAxiosInstance.put("/documents/update", body, { params: { doc_type: docType } })
// DELETE: backendAxiosInstance.delete("/documents/delete", { params: { doc_type: docType } })
//   // ponytail: FastAPI DELETE /documents/delete 미구현이었음 — 실연결 시 구현 여부 재확인

type Context = { params: Promise<{ docType: string }> }

export async function GET(_req: NextRequest, { params }: Context) {
  const { docType } = await params
  if (!VALID_DOC_TYPES.has(docType))
    return NextResponse.json({ error: "잘못된 문서 타입" }, { status: 400 })

  const doc = getDocument(docType as DocSlug)
  if (!doc) {
    return NextResponse.json({ exists: false })
  }
  return NextResponse.json({ exists: true, content: doc.content })
}

export async function PUT(req: NextRequest, { params }: Context) {
  const { docType } = await params
  if (!VALID_DOC_TYPES.has(docType))
    return NextResponse.json({ error: "잘못된 문서 타입" }, { status: 400 })

  const body = await req.json()
  const doc = saveDocument(docType as DocSlug, body.content ?? "")
  return NextResponse.json({ exists: true, content: doc.content })
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const { docType } = await params
  if (!VALID_DOC_TYPES.has(docType))
    return NextResponse.json({ error: "잘못된 문서 타입" }, { status: 400 })

  deleteDocument(docType as DocSlug)
  return NextResponse.json({ exists: false })
}
