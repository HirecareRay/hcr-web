"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Pencil } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import DocumentForm from "@/features/documents/components/DocumentForm"
import DocumentView from "@/features/documents/components/DocumentView"
import { documentService } from "@/features/documents/services/documentService"
import { useAuthStore } from "@/features/auth/store/authStore"
import { PageTopBar } from "@/components/ui/pageTopBar"

const DOC_LABELS: Record<string, string> = {
  resume: "이력서",
  cover_letter: "자기소개서",
  portfolio: "포트폴리오",
  work_experience: "경력기술서",
}

export default function DocumentEditPage() {
  const { docType } = useParams<{ docType: string }>()
  const router = useRouter()
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const setDocExists = useAuthStore((s) => s.setDocExists)

  useEffect(() => {
    axiosInstance
      .get(`/api/mypage/documents/${docType}`)
      .then((r) => setData(r.data.data))
      .catch((e) => {
        const status = e.response?.status
        if (status === 401) router.replace("/login")
        else if (status === 404) {
          alert("등록된 문서가 없습니다.")
          router.replace("/mypage/documents")
        } else {
          setError("문서를 불러오지 못했습니다.")
        }
      })
      .finally(() => setLoading(false))
  }, [docType, router])

  async function handleSave(formData: Record<string, unknown>) {
    setSaving(true)
    setError("")
    try {
      await axiosInstance.put(`/api/mypage/documents/${docType}`, formData)
      setData(formData)
      setIsEditing(false)
    } catch {
      setError("저장에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`${DOC_LABELS[docType] ?? docType} 문서를 삭제하시겠습니까?`)) return
    try {
      await axiosInstance.delete(`/api/mypage/documents/${docType}`)
      setDocExists(await documentService.existsAll())
      router.replace("/mypage/documents")
    } catch {
      setError("삭제에 실패했습니다.")
    }
  }

  const title = DOC_LABELS[docType] ?? docType

  if (loading) {
    return (
      <section className="bg-background flex min-h-full flex-col">
        <PageTopBar title={title} backTo="/mypage/documents" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted text-sm">불러오는 중...</p>
        </div>
      </section>
    )
  }

  if (!data) return null

  return (
    <section className="bg-background min-h-full pb-24">
      <PageTopBar title={title} backTo="/mypage/documents" />
      <div className="px-5 pt-5">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setError("")
              }}
              className="text-muted mb-4 text-sm font-medium"
            >
              취소
            </button>
            <DocumentForm
              docType={docType}
              initialData={data}
              saving={saving}
              error={error}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          </>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-primary hover:bg-coral-beam flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white transition-colors"
              >
                <Pencil className="size-4" />
                편집
              </button>
            </div>
            <DocumentView docType={docType} data={data} />
          </>
        )}
      </div>
    </section>
  )
}
