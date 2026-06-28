import axiosInstance from "@/lib/axiosInstance"

export type DocSlug = "resume" | "cover_letter" | "portfolio" | "work_experience"

export interface DocumentData {
  exists: boolean
  title?: string
  pages?: number
  content?: string
  tables?: Array<{ headers: string[]; rows: string[][] }>
}

// 값이 string이면 존재(= created_datetime), null이면 미등록
export interface DocExists {
  resume: string | null
  cover_letter: string | null
  portfolio: string | null
  work_experience: string | null
}

const base = (docType: DocSlug) => `/api/mypage/documents/${docType}`

export const documentService = {
  exists: (): Promise<DocExists> =>
    axiosInstance.get("/api/mypage/documents/exists").then((r) => r.data),

  get: (docType: DocSlug): Promise<DocumentData> =>
    axiosInstance.get(base(docType)).then((r) => r.data),

  save: (docType: DocSlug, content: string): Promise<DocumentData> =>
    axiosInstance.put(base(docType), { content }).then((r) => r.data),

  deleteAll: (docType: DocSlug): Promise<void> =>
    axiosInstance.delete(base(docType)).then((r) => r.data),
}
