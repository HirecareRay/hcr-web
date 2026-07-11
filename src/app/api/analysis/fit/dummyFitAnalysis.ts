/**
 * dummyFitAnalysis.ts
 *
 * 적합도 분석(analysis/fit) mock 데이터. hcr-backend 서버·DB 폐쇄로 LLM 5단계 파이프라인
 * 대신 이 더미를 응답한다. CJ ENM Data Scientist 채용공고(jobs mock과 동일 id)를 기준으로 채웠다.
 *
 * ⚠️ 추후 진짜 백엔드 연결 시, 이 파일만 실제 조회/생성 로직으로 교체하세요.
 *    응답 타입(FitAnalysis/FitHistoryItem)과 프론트 코드는 그대로 유지됩니다.
 */

import type { FitAnalysis, FitHistoryItem } from "@/features/analysis/types/analysis"

const CANDIDATE_PROFILE_ID = "candidate-4"
const JOB_PROFILE_ID = "job-profile-5e9cabd0"
const COMPANY_PROFILE_ID = "company-profile-cjenm"

/** 요청된 analysisId로 더미 분석 결과를 생성한다(어떤 id가 와도 동일 샘플, id만 반영). */
export function buildDummyFitAnalysis(
  analysisId: string,
  companyId?: string,
  jobId?: string
): FitAnalysis {
  return {
    analysisId,
    companyName: "CJ ENM",
    jobTitle: "Data Scientist 채용",
    jobNames: ["Data Scientist"],
    jobUrl: null,
    candidateProfileId: CANDIDATE_PROFILE_ID,
    jobProfileId: jobId ?? JOB_PROFILE_ID,
    companyProfileId: companyId ?? COMPANY_PROFILE_ID,
    overallSummary:
      "지원자는 데이터 분석·머신러닝 실무 경험과 Python 역량을 갖춰 직무 요건 대부분을 충족합니다. " +
      "콘텐츠·미디어 도메인 경험은 제한적이나, 커머스 데이터 분석 프로젝트 경험이 유사 역량으로 인정됩니다.",
    jobMatches: [
      {
        jobPostingId: "5e9cabd040c307d7aa142e73",
        matchTargetType: "required",
        matchTargetText: "Python 기반 데이터 분석 및 통계 모델링 경험",
        matchTargetEvidence: "Python, SQL을 활용한 통계 분석 3년 이상",
        matched: true,
        candidateProfileId: CANDIDATE_PROFILE_ID,
        candidateEvidence: {
          docId: "resume-4",
          field: "career",
          featureName: "python_experience_years",
          excerpt: "Python·Pandas·scikit-learn을 활용해 커머스 데이터 분석 업무를 3년간 수행",
          source: "resume",
        },
        reasoning: "이력서상 Python 실무 경력이 요건(3년 이상)을 충족합니다.",
      },
      {
        jobPostingId: "5e9cabd040c307d7aa142e73",
        matchTargetType: "preferred",
        matchTargetText: "머신러닝 프레임워크(PyTorch/TensorFlow) 활용 경험",
        matchTargetEvidence: "PyTorch 기반 추천모델 개발 우대",
        matched: false,
        candidateProfileId: CANDIDATE_PROFILE_ID,
        candidateEvidence: {
          docId: "resume-4",
          field: "skills",
          featureName: "ml_framework",
          excerpt: null,
          source: "resume",
        },
        reasoning: "이력서에 PyTorch/TensorFlow 관련 프로젝트 기재가 없어 확인되지 않습니다.",
      },
      {
        jobPostingId: "5e9cabd040c307d7aa142e73",
        matchTargetType: "tech_tool",
        matchTargetText: "SQL 및 데이터 웨어하우스 활용 경험",
        matchTargetEvidence: "BigQuery/Redshift 등 DW 환경 경험",
        matched: true,
        candidateProfileId: CANDIDATE_PROFILE_ID,
        candidateEvidence: {
          docId: "resume-4",
          field: "skills",
          featureName: "sql_dw",
          excerpt: "BigQuery 기반 커머스 데이터 마트 설계 및 쿼리 최적화 경험",
          source: "resume",
        },
        reasoning: "DW 도구 활용 경험이 명확히 기재되어 있습니다.",
      },
    ],
    companyMatches: [
      {
        companyProfileId: COMPANY_PROFILE_ID,
        dimension: "talent_values",
        criterionText: "공감력, 독창성, 사명감",
        criterionEvidence: "CJ ENM 인재상",
        matched: true,
        candidateProfileId: CANDIDATE_PROFILE_ID,
        candidateEvidence: {
          docId: "cover-letter-4",
          field: "motivation",
          featureName: "value_alignment",
          excerpt: "데이터로 콘텐츠 소비자의 니즈를 공감하고 새로운 관점을 제시하고자 지원",
          source: "cover_letter",
        },
        reasoning: "자기소개서에서 공감력·독창성 키워드와 부합하는 서술이 확인됩니다.",
      },
      {
        companyProfileId: COMPANY_PROFILE_ID,
        dimension: "industry_domain",
        criterionText: "미디어·콘텐츠 산업 이해도",
        criterionEvidence: null,
        matched: false,
        candidateProfileId: CANDIDATE_PROFILE_ID,
        candidateEvidence: {
          docId: "resume-4",
          field: "career",
          featureName: "industry_experience",
          excerpt: null,
          source: "resume",
        },
        reasoning: "커머스 도메인 경험은 있으나 미디어·콘텐츠 산업 경험은 직접 확인되지 않습니다.",
      },
    ],
    // 카테고리명은 fitAnalysisPage.tsx의 RADAR_ORDER와 정확히 일치해야 방사형 차트가 그려진다.
    categorySummary: [
      { category: "자격요건", total: 8, matched: 6 },
      { category: "주요업무", total: 5, matched: 4 },
      { category: "우대사항", total: 3, matched: 2 },
      { category: "산업 및 사업 분야", total: 2, matched: 1 },
      { category: "인재상 및 조직문화", total: 2, matched: 1 },
    ],
    strengths: [
      "Python·SQL 기반 데이터 분석 실무 경험이 직무 요건과 직접적으로 일치합니다.",
      "데이터 웨어하우스 활용 경험이 구체적인 프로젝트로 뒷받침됩니다.",
    ],
    improvements: [
      "PyTorch/TensorFlow 등 딥러닝 프레임워크 실무 경험을 보강하면 우대 요건 충족도가 높아집니다.",
      "미디어·콘텐츠 산업 관련 프로젝트나 관심 분야를 자기소개서에 구체적으로 추가하면 좋습니다.",
    ],
    recommendations: [
      "포트폴리오에 딥러닝 프레임워크를 활용한 사이드 프로젝트를 추가해보세요.",
      "CJ ENM의 콘텐츠 데이터(시청률·OTT 이용 패턴 등) 관련 관심사를 면접에서 구체적으로 준비하세요.",
    ],
  }
}

/** 마이페이지/분석 탭 "적합도 보고서" 목록 더미. */
export function buildDummyFitHistory(): FitHistoryItem[] {
  const analysisId = "fit-mock-cjenm-1"
  // 상세 페이지(fitAnalysisPage.tsx)가 categorySummary에서 matched/total 합으로 재계산하는 것과
  // 동일한 값이 나오도록, 목록의 overallPct도 같은 소스(buildDummyFitAnalysis)에서 계산한다.
  const { categorySummary } = buildDummyFitAnalysis(analysisId)
  const total = categorySummary.reduce((sum, s) => sum + s.total, 0)
  const matched = categorySummary.reduce((sum, s) => sum + s.matched, 0)
  const overallPct = total > 0 ? Math.round((matched / total) * 100) : 0

  return [
    {
      analysisId,
      companyId: "6a3ca079d7da326c0781963c",
      companyName: "CJ ENM",
      jobPostingId: "5e9cabd040c307d7aa142e73",
      jobTitle: "Data Scientist 채용",
      jobNames: ["Data Scientist"],
      analyzedAt: "2026-07-05T09:30:00.000Z",
      overallPct,
    },
  ]
}
