import axiosInstance from "@/lib/axiosInstance"

export type DocSlug = "resume" | "cover_letter" | "portfolio" | "work_experience"

export interface DocumentData {
  exists: boolean
  title?: string
  pages?: number
  content?: string
  tables?: Array<{ headers: string[]; rows: string[][] }>
}

const base = (docType: DocSlug) => `/api/mypage/documents/${docType}`

export const documentService = {
  get: (docType: DocSlug): Promise<DocumentData> =>
    axiosInstance.get(base(docType)).then((r) => r.data),

  save: (docType: DocSlug, content: string): Promise<DocumentData> =>
    axiosInstance.put(base(docType), { content }).then((r) => r.data),

  deleteAll: (docType: DocSlug): Promise<void> =>
    axiosInstance.delete(base(docType)).then((r) => r.data),
}
