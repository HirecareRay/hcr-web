/**
 * mockDocumentStore.ts
 *
 * hcr-backend 서버·DB 폐쇄로 이력서·자소서·포트폴리오·경력기술서를 서버 메모리에 보관하는
 * mock 저장소. 조회(GET)·저장(PUT)·삭제(DELETE)·업로드(upload) 라우트가 공유한다.
 *
 * ⚠️ 프로세스 메모리라 서버 재시작 시 초기화된다(DB 대체용 임시 mock). 실연결 시 이 파일을
 *    지우고 각 라우트를 실제 DB/백엔드 호출로 되돌리면 된다.
 */

export type DocSlug = "resume" | "cover_letter" | "portfolio" | "work_experience"

interface StoredDocument {
  content: string
  updatedAt: string
}

const store = new Map<DocSlug, StoredDocument>([
  [
    "resume",
    {
      content:
        "안녕하세요, 데이터 분석과 백엔드 개발을 함께 다뤄온 김취준입니다.\nPython·SQL 기반 데이터 분석 3년, 커머스 데이터 마트 설계 경험이 있습니다.",
      updatedAt: "2026-07-01T09:00:00.000Z",
    },
  ],
])

export function getDocument(docType: DocSlug): StoredDocument | null {
  return store.get(docType) ?? null
}

export function saveDocument(docType: DocSlug, content: string): StoredDocument {
  const doc: StoredDocument = { content, updatedAt: new Date().toISOString() }
  store.set(docType, doc)
  return doc
}

export function deleteDocument(docType: DocSlug): void {
  store.delete(docType)
}

export function existsAll(): Record<DocSlug, string | null> {
  const slugs: DocSlug[] = ["resume", "cover_letter", "portfolio", "work_experience"]
  return Object.fromEntries(slugs.map((s) => [s, store.get(s)?.updatedAt ?? null])) as Record<
    DocSlug,
    string | null
  >
}
