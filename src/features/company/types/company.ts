/**
 * company.ts
 *
 * 회사 분석 보고서의 데이터 타입 정의입니다.
 * 이 타입은 백엔드 API(`/api/companies/[id]/report`)의 응답 contract이기도 합니다.
 *
 * 각 섹션의 필드 출처:
 *   - overview  ← 회사 크롤링(company-crawler)  [실제 데이터 형태 확인됨]
 *   - financial ← DART 재무지표                  [실제 데이터 형태 확인됨]
 *   - employees ← DART 직원현황                  [실제 데이터 형태 확인됨]
 *   - growth    ← 뉴스 파이프라인(*_chosen_articles) [실제 스키마 확인됨 · snake→camel 변환]
 *   - hiring    ← 채용공고 정규화 v2(catch/incruit) [실제 스키마 확인됨 · snake→camel 변환]
 *
 * 현재 백엔드는 DB 대신 더미 데이터를 응답합니다.
 * overview/financial/employees는 실제 데이터 모양에 맞춰 두었으므로 DB 연결 시 프론트를 거의 안 고쳐도 됩니다.
 * growth(뉴스)·hiring(채용)은 실제 파이프라인 산출물 스키마에 맞춰 두었습니다
 * (이름만 camelCase로 변환). 백엔드 연결 시 snake→camel 매핑 1회면 그대로 맞습니다.
 */

export interface Company {
  id: string
  name: string
  corpCode: string
  stockCode: string | null
  industry: string // 업종/산업 (DART 회사개황) — 요약 카드용
}

export interface CompanyReport {
  company: Company
  overview: OverviewSection
  financial: FinancialSection
  employees: EmployeeSection
  review: ReviewSection // 잡플래닛 평판 (①)
  growth: GrowthSection
  hiring: HiringSection
  insight: InsightSection // AI 인사이트 (②, 추론)
  generatedAt: string
}

// 참고: 예상 면접질문은 LLM 생성물이라 회사 보고서 계약에서 제외했습니다.
//       이후 features/interview 슬라이스에서 별도 엔드포인트로 생성/조회합니다.

// ─── 기업 개요 (company-crawler) ──────────────────────────────────────────────
//
// profile·history는 채용사이트(jobkorea/catch/incruit) 크롤러 산출물(company_profile)을
// 그대로 옮긴 것입니다. 외부 산출물이 snake_case라 키만 camelCase로 변환했고,
// 값 문자열은 원본 형태를 보존합니다(백엔드 연결 시 snake→camel 매핑 1회면 그대로 맞음).
// 미기재 항목은 빈 문자열("")/null을 보존합니다.
export interface CompanyProfile {
  industry: string // 업종 (예: "텔레비전 방송업")
  companySize: string // 기업규모 (예: "대기업")
  companyType: string // 기업형태 (예: "코스닥")
  founded: string // 설립일 원문 (예: "1994.12.16 | (33년차)")
  ceo: string // 대표자 (예: "구창근, 윤상현")
  employeeCount: string // 사원수 원문 (예: "3,078명 2025.12 | 3,078명")
  revenue: string // 매출 원문 (별도/연결 혼재된 원본 문자열)
  capital: string // 자본금 원문 (예: "1,105억 7천만원 | (2025.12.31)")
  entrySalary: string // 신입초임 (예: "2,885만원", 미기재 시 "")
  address: string // 주소 원문
  mainBusiness: string // 주요사업 (콤마·슬래시로 구분된 원본 문자열)
  creditRating: string | null // 신용등급 (미기재 시 null)
  insurance: string[] // 4대보험 등 (예: ["국민연금", "건강보험", ...])
}

// 연혁 1건 (특정 연·월에 일어난 이벤트 묶음)
export interface CompanyHistoryEvent {
  year: string // 연도 (예: "2026")
  month: string // 월 (2자리, 예: "02")
  events: string[] // 해당 시점 이벤트 목록
}

export interface OverviewSection {
  businessDescription: string
  mainProductsServices: string[]
  talentValues: string | null
  ceoMessage: string | null
  websiteUrl: string | null
  profile: CompanyProfile // 기업 기본정보 (크롤러 company_profile)
  history: CompanyHistoryEvent[] // 연혁 (최신순)
}

// ─── 재무 분석 (DART 재무지표) ────────────────────────────────────────────────
export interface FinancialIndicator {
  label: string
  value: number | null
  unit: string
}

export interface FinancialSection {
  year: string
  source: string
  profitability: FinancialIndicator[]
  stability: FinancialIndicator[]
  summary: string
}

// ─── 임직원 현황 (DART 직원현황) ──────────────────────────────────────────────
export interface EmployeeSection {
  year: string
  source: string
  totalCount: number
  maleCount: number
  femaleCount: number
  avgSalary: number | null
  avgTenureYears: number | null
}

// ─── 평판 / 리뷰 (잡플래닛) ───────────────────────────────────────────────────
//
// 출처: 잡플래닛 크롤링. 재직자·전직자 평가 기반 사실 데이터(①)입니다.
// 종합 평점/세부 평점은 5점 만점, pros·cons는 리뷰에서 추출한 요약 키워드입니다.
export interface ReviewRating {
  label: string // "워라밸", "복지·급여", "사내문화", "승진·성장", "경영진" 등
  score: number // 0~5
}

// 개별 리뷰의 항목별 평점 (잡플래닛 score, 1~5)
export interface ReviewScore {
  advancement: number // 승진·성장 (advancement_rating)
  compensation: number // 복지·급여 (compensation_rating)
  worklifeBalance: number // 워라밸 (worklife_balance_rating)
  culture: number // 사내문화 (culture_rating)
  management: number // 경영진 (management_rating)
}

// 개별 리뷰 1건 (잡플래닛 reviews.json 원본을 camelCase로 평탄화)
export interface ReviewItem {
  id: number // 리뷰 id
  rating: number // 종합 평점 (overall, 1~5)
  title: string // 한줄 제목
  pros: string // 장점 본문 (줄바꿈 포함 원문)
  cons: string // 단점 본문 (줄바꿈 포함 원문)
  occupation: string // 직군 (occupation_name)
  employStatus: string // "현직원" | "전직원" (employ_status_name 불리언 변환)
  date: string // 작성 시점 "YYYY. MM"
  helpfulCount: number // 도움돼요 수 (helpful_count)
  scores: ReviewScore // 항목별 평점
}

export interface ReviewSection {
  source: string // 출처명 (예: "잡플래닛")
  overallRating: number // 종합 평점 (5점 만점)
  reviewCount: number // 누적 리뷰 수
  ratings: ReviewRating[] // 항목별 세부 평점 (전체 평균)
  pros: string[] // 장점 요약 키워드
  cons: string[] // 단점 요약 키워드
  summary: string // 한 줄 총평
  reviews: ReviewItem[] // 개별 리뷰 목록 (대표 리뷰)
}

// ─── 성장성 / 뉴스 (뉴스 크롤링 + RAG 선별) ─────────────────────────────────
//
// 출처: 팀 뉴스 파이프라인 산출물(ChromaDB 검색 결과 = 회사별 chosen_articles).
// 원본은 Chroma query 응답으로, metadata(snake_case) + documents(본문) 구조입니다.
// 한 기사 = 1건이며, article_type으로 대표/최장 청크를 선별합니다.
// 실제 출력 모양 확정(2번 임베딩 모델 검색 결과 기준): metadata에는 date만 있고
// year·month 분리 필드는 없습니다. 프론트 컨벤션(camelCase)에 맞춰 평탄화하고
// documents → content로 옮겼습니다. (백엔드 연결 시 snake→camel 매핑 1회)
// 참고: query별 distance(유사도)는 표시에 안 쓰므로 계약에서 제외했습니다.
export interface NewsItem {
  id: string // 청크 id (예: "CJ_ENM-000246_0")
  articleId: string // 기사 id (article_id, 예: "CJ_ENM-000246")
  company: string
  title: string
  media: string // 언론사명
  url: string
  date: string // 보도일 YYYY-MM-DD
  articleIdx: number // 원본 수집 인덱스 (article_idx)
  articleType: string // 선별 유형 ("representative" | "longest")
  paragraphStart: number // 청크 시작 문단 (paragraph_start)
  newsCount: number // 동일 기사군 묶음 수 (news_count)
  content: string // 기사 본문 (원본 documents)
}

export interface GrowthSection {
  summary: string
  news: NewsItem[]
}

// ─── 채용 정보 (채용공고 크롤링 산출물) ──────────────────────────────────────
//
// 출처: 팀 채용 크롤링 파이프라인(실제 산출물 = JobPostingFixture 구조).
// 실데이터 모양 확정(2026-06): 한 공고 = 한 직무(job 단수)이며,
// 신입/경력 트랙 분리·common/jobs[] 중첩 없이 평탄합니다.
// (이전 v2 추측 스키마는 폐기하고 실제 모양에 맞춰 단순화함)
// 백엔드 연결 시: 같은 구조면 그대로, snake_case면 매핑 1회.

// 모집 직무 상세 (job)
export interface JobDetail {
  name: string // 직무명
  headcount: string // 원문 모집인원 표현("00명", "○명", "" 등 보존)
  locations: string[]
  responsibilities: string[] // 담당 업무
  requirements: string[] // 자격 요건
  preferred: string[] // 우대 사항
}

// 지원 자격 (qualification)
export interface JobQualification {
  education: string // 학력 (미기재 시 "")
  major: string // 전공 (미기재 시 "")
  documents: string[] // 제출 서류
}

// 고용 및 근무 조건 (workConditions)
export interface JobWorkConditions {
  employmentType: string // 고용형태
  workType: string // 근무형태 (미기재 시 "")
  salary: string // 급여 (미기재 시 "")
  benefits: string[]
  deadline: string | null // 마감일 YYYY-MM-DD, 상시채용이면 null
  deadlineType: string // "fixed_date" | "rolling"
}

// 채용공고 1건 (한 공고 = 한 직무)
export interface JobPosting {
  id: string // 공고 식별자
  companyName: string
  title: string // 공고 제목
  url: string // 원본 공고 링크 (posting_refs.source_url, 없으면 "")
  job: JobDetail
  qualification: JobQualification
  process: string[] // 채용 전형 순서
  workConditions: JobWorkConditions
}

export interface HiringSection {
  summary: string
  openings: JobPosting[]
}

// ─── AI 인사이트 (LLM 추론 ②) ────────────────────────────────────────────────
//
// ⚠️ 사실 데이터(①)가 아니라 LLM이 뉴스·재무 등을 근거로 "추론"한 내용입니다.
//    출처가 단정되지 않으므로, UI에서는 반드시 "AI 분석" 라벨로 ①과 분리해
//    취준생이 확정된 사실로 오인하지 않게 합니다.
// 업계 현황·경쟁사는 환각 위험이 있으므로, 백엔드에서 생성 시 반드시
// 뉴스·공시 등 사실 근거에 한정(grounding)하고 근거 없는 수치·순위는 배제할 것.
export interface SwotAnalysis {
  strengths: string[] // 강점 (S)
  weaknesses: string[] // 약점 (W)
  opportunities: string[] // 기회 (O)
  threats: string[] // 위협 (T)
}

// 주요 경쟁사 1건
export interface Competitor {
  name: string // 경쟁사명
  description: string // 경쟁 포인트/관계 (한 줄)
}

export interface InsightSection {
  headline: string // AI 한 줄 총평 (상단 히어로용)
  keyPoints: string[] // 지원 전 알아둘 핵심 (히어로용)
  vision: string // 비전·성장 가능성 (서술형)
  industry: string // 업계 현황 (서술형, 뉴스 근거)
  competitors: Competitor[] // 주요 경쟁사
  swot: SwotAnalysis
}
