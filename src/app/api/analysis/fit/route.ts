import { isAxiosError } from "axios"
import { NextRequest, NextResponse } from "next/server"
import backendApi from "@/lib/backendAxiosInstance"
import { fetchJobDetail } from "@/features/jobs/services/jobService"
import { authCookieName } from "@/features/auth/authCookie"

export async function POST(req: NextRequest) {
  try {
    const { companyId, jobId } = await req.json()

    if (!companyId || !jobId) {
      return NextResponse.json(
        { success: false, error: "companyId, jobId가 필요합니다" },
        { status: 400 }
      )
    }

    const job = await fetchJobDetail(jobId)
    if (!job) {
      return NextResponse.json(
        { success: false, error: "채용공고를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    const token = req.cookies.get(authCookieName)?.value
    const { data } = await backendApi.post(
      "/analysis/fit",
      {
        company_id: companyId,
        job_title: job.title,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        preferred_qualifications: job.preferredQualifications,
      },
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    )

    return NextResponse.json({ success: true, data: data.data })
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return NextResponse.json(
        { success: false, error: error.response.data?.detail ?? "분석 실패" },
        { status: error.response.status }
      )
    }
    console.error("적합도 분석 실패:", error)
    return NextResponse.json({ success: false, error: "서버 오류" }, { status: 500 })
  }
}
