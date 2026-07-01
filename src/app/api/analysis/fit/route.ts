import { isAxiosError } from "axios"
import { NextRequest, NextResponse } from "next/server"
import backendApi from "@/lib/backendAxiosInstance"
import { authCookieName } from "@/features/auth/authCookie"
import type { FitAnalysis } from "@/features/analysis/types/analysis"

function toEvidenceRef(e: Record<string, unknown>) {
  return {
    docId: e.doc_id,
    field: e.field ?? null,
    featureName: e.feature_name ?? null,
    excerpt: e.excerpt ?? null,
    source: e.source ?? null,
  }
}

function toJobMatch(m: Record<string, unknown>) {
  return {
    jobPostingId: m.job_posting_id,
    matchTargetType: m.match_target_type,
    matchTargetText: m.match_target_text,
    matchTargetEvidence: m.match_target_evidence ?? null,
    matched: m.matched,
    candidateProfileId: m.candidate_profile_id,
    candidateEvidence: toEvidenceRef(m.candidate_evidence as Record<string, unknown>),
    reasoning: m.reasoning ?? null,
  }
}

function toCompanyMatch(m: Record<string, unknown>) {
  return {
    companyProfileId: m.company_profile_id,
    dimension: m.dimension,
    criterionText: m.criterion_text,
    criterionEvidence: m.criterion_evidence ?? null,
    matched: m.matched,
    candidateProfileId: m.candidate_profile_id,
    candidateEvidence: toEvidenceRef(m.candidate_evidence as Record<string, unknown>),
    reasoning: m.reasoning ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFitAnalysis(raw: Record<string, any>): FitAnalysis {
  return {
    analysisId: raw.analysis_id,
    companyName: raw.company_name ?? null,
    jobTitle: raw.job_title ?? null,
    jobNames: raw.job_names ?? [],
    candidateProfileId: raw.candidate_profile_id,
    jobProfileId: raw.job_profile_id,
    companyProfileId: raw.company_profile_id,
    overallSummary: raw.overall_summary,
    jobMatches: (raw.job_matches ?? []).map(toJobMatch),
    companyMatches: (raw.company_matches ?? []).map(toCompanyMatch),
    categorySummary: raw.category_summary ?? [],
    strengths: raw.strengths ?? null,
    improvements: raw.improvements ?? null,
    recommendations: raw.recommendations ?? null,
  }
}

export async function POST(req: NextRequest) {
  try {
    const { companyId, jobId } = await req.json()

    if (!companyId || !jobId) {
      return NextResponse.json(
        { success: false, error: "companyId, jobId가 필요합니다" },
        { status: 400 }
      )
    }

    const token = req.cookies.get(authCookieName)?.value
    const { data } = await backendApi.post(
      "/analysis/fit",
      { company_id: companyId, job_posting_id: jobId },
      {
        timeout: 300000, // LLM 5단계 파이프라인 — 최대 5분
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      }
    )

    return NextResponse.json({ success: true, data: toFitAnalysis(data.data) })
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
