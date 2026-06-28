"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axiosInstance from "@/lib/axiosInstance"
import DocumentForm from "@/features/documents/components/DocumentForm"

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
      router.replace("/mypage/documents")
    } catch {
      setError("삭제에 실패했습니다.")
    }
  }

  if (loading) return <div className="p-5">불러오는 중...</div>
  if (!data) return null

  return (
    <div className="p-5 pb-24">
      <h1 className="mb-6 text-xl font-bold">{DOC_LABELS[docType] ?? docType} 편집</h1>
      <DocumentForm
        docType={docType}
        initialData={data}
        saving={saving}
        error={error}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
