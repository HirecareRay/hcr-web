import { createSwaggerSpec } from "next-swagger-doc"

/**
 * OpenAPI 컴포넌트 스키마.
 *
 * src/features/company/types/company.ts 의 타입과 1:1로 맞춥니다.
 * 응답 형태를 백엔드/팀과 공유하기 위한 계약이므로, 타입을 고치면 여기도 함께 맞추세요.
 * (큰 중첩 스키마라 주석 YAML 대신 JS로 둡니다.)
 */
const schemas = {
  // ─── 공통 ────────────────────────────────────────────────────────────────
  ErrorResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      error: { type: "string", example: "보고서를 불러오는 중 오류가 발생했습니다" },
    },
    required: ["success", "error"],
  },

  // ─── 인증 (auth BFF: 프론트↔FastAPI 중계) ─────────────────────────────────
  AuthUser: {
    type: "object",
    description: "응답에 실리는 사용자 정보(비밀번호 제외)",
    properties: {
      id: { type: "string", example: "1" },
      name: { type: "string", example: "홍길동" },
      email: { type: "string", format: "email", example: "user@example.com" },
    },
    required: ["id", "name", "email"],
  },

  AuthResponse: {
    type: "object",
    description:
      "로그인·회원가입 성공 응답. 토큰은 본문뿐 아니라 httpOnly 쿠키(hcr_token)로도 내려가며, 이후 인증은 쿠키로 한다.",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "object",
        properties: {
          token: {
            type: "string",
            description: "JWT(참고용). 실제 인증은 httpOnly 쿠키 사용",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          user: { $ref: "#/components/schemas/AuthUser" },
        },
        required: ["token", "user"],
      },
    },
    required: ["success", "data"],
  },

  AuthUserResponse: {
    type: "object",
    description: "현재 로그인 사용자 조회(/api/auth/me) 성공 응답",
    properties: {
      success: { type: "boolean", example: true },
      data: { $ref: "#/components/schemas/AuthUser" },
    },
    required: ["success", "data"],
  },

  AuthErrorResponse: {
    type: "object",
    description: "인증 실패 응답(BFF 는 error 가 아니라 message 필드를 쓴다)",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string", example: "이메일 또는 비밀번호가 올바르지 않습니다" },
    },
    required: ["success", "message"],
  },

  CompanyReportResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: { $ref: "#/components/schemas/CompanyReport" },
    },
    required: ["success", "data"],
  },

  CompanyReport: {
    type: "object",
    properties: {
      company: { $ref: "#/components/schemas/Company" },
      overview: { $ref: "#/components/schemas/OverviewSection" },
      financial: { $ref: "#/components/schemas/FinancialSection" },
      employees: { $ref: "#/components/schemas/EmployeeSection" },
      review: { $ref: "#/components/schemas/ReviewSection" },
      growth: { $ref: "#/components/schemas/GrowthSection" },
      hiring: { $ref: "#/components/schemas/HiringSection" },
      generatedAt: { type: "string", format: "date-time" },
    },
    required: [
      "company",
      "overview",
      "financial",
      "employees",
      "review",
      "growth",
      "hiring",
      "generatedAt",
    ],
  },

  Company: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string", example: "CJ ENM" },
      corpCode: { type: "string", example: "00265324" },
      stockCode: { type: "string", nullable: true, example: "035760" },
      industry: { type: "string", example: "방송·미디어·콘텐츠" },
    },
    required: ["id", "name", "corpCode", "stockCode", "industry"],
  },

  // ─── 개요 (company-crawler) ───────────────────────────────────────────────
  CompanyProfile: {
    type: "object",
    description:
      "채용사이트(jobkorea/catch/incruit) 크롤러 산출물(company_profile). 키만 camelCase로 변환하고 값 문자열은 원본 형태 보존.",
    properties: {
      industry: { type: "string", example: "텔레비전 방송업" },
      companySize: { type: "string", example: "대기업" },
      companyType: { type: "string", example: "코스닥" },
      founded: { type: "string", example: "1994.12.16 | (33년차)" },
      ceo: { type: "string", example: "구창근, 윤상현" },
      employeeCount: { type: "string", example: "3,078명 2025.12 | 3,078명" },
      revenue: {
        type: "string",
        example: "별도 2조 7,838억 2025.12 | 2조 7,838억 | 연결 5조 1,345억 2025.12 | 5조 1,345억",
      },
      capital: { type: "string", example: "1,105억 7천만원 | (2025.12.31)" },
      entrySalary: { type: "string", description: "미기재 시 빈 문자열", example: "2,885만원" },
      address: { type: "string", example: "(06761) 서울특별시 서초구 과천대로 870-13 (방배동)" },
      mainBusiness: { type: "string" },
      creditRating: { type: "string", nullable: true, description: "미기재 시 null" },
      insurance: {
        type: "array",
        items: { type: "string" },
        example: ["국민연금", "건강보험", "고용보험", "산재보험"],
      },
    },
    required: [
      "industry",
      "companySize",
      "companyType",
      "founded",
      "ceo",
      "employeeCount",
      "revenue",
      "capital",
      "entrySalary",
      "address",
      "mainBusiness",
      "creditRating",
      "insurance",
    ],
  },

  CompanyHistoryEvent: {
    type: "object",
    description: "연혁 1건(특정 연·월 이벤트 묶음, 최신순)",
    properties: {
      year: { type: "string", example: "2026" },
      month: { type: "string", example: "02" },
      events: { type: "array", items: { type: "string" } },
    },
    required: ["year", "month", "events"],
  },

  OverviewSection: {
    type: "object",
    properties: {
      businessDescription: { type: "string" },
      mainProductsServices: { type: "array", items: { type: "string" } },
      talentValues: { type: "string", nullable: true, example: "공감력, 독창성, 사명감" },
      ceoMessage: { type: "string", nullable: true },
      websiteUrl: { type: "string", nullable: true, example: "https://www.cjenm.com" },
      profile: { $ref: "#/components/schemas/CompanyProfile" },
      history: { type: "array", items: { $ref: "#/components/schemas/CompanyHistoryEvent" } },
    },
    required: [
      "businessDescription",
      "mainProductsServices",
      "talentValues",
      "ceoMessage",
      "websiteUrl",
      "profile",
      "history",
    ],
  },

  // ─── 재무 (DART 재무지표) ─────────────────────────────────────────────────
  FinancialIndicator: {
    type: "object",
    properties: {
      label: { type: "string", example: "ROE" },
      value: { type: "number", nullable: true, example: -14.79 },
      unit: { type: "string", example: "%" },
    },
    required: ["label", "value", "unit"],
  },

  FinancialSection: {
    type: "object",
    properties: {
      year: { type: "string", example: "2024" },
      source: { type: "string", example: "DART 전자공시" },
      profitability: {
        type: "array",
        items: { $ref: "#/components/schemas/FinancialIndicator" },
      },
      stability: {
        type: "array",
        items: { $ref: "#/components/schemas/FinancialIndicator" },
      },
      summary: { type: "string" },
    },
    required: ["year", "source", "profitability", "stability", "summary"],
  },

  // ─── 임직원 (DART 직원현황) ───────────────────────────────────────────────
  EmployeeSection: {
    type: "object",
    properties: {
      year: { type: "string", example: "2024" },
      source: { type: "string", example: "DART 직원현황" },
      totalCount: { type: "integer", example: 3372 },
      maleCount: { type: "integer", example: 1604 },
      femaleCount: { type: "integer", example: 1768 },
      avgSalary: { type: "integer", nullable: true, example: 89000000 },
      avgTenureYears: { type: "number", nullable: true, example: 6.4 },
    },
    required: [
      "year",
      "source",
      "totalCount",
      "maleCount",
      "femaleCount",
      "avgSalary",
      "avgTenureYears",
    ],
  },

  // ─── 평판/리뷰 (잡플래닛) ─────────────────────────────────────────────────
  ReviewRating: {
    type: "object",
    properties: {
      label: { type: "string", example: "워라밸" },
      score: { type: "number", description: "0~5", example: 2.7 },
    },
    required: ["label", "score"],
  },

  ReviewScore: {
    type: "object",
    description: "개별 리뷰 항목별 평점(잡플래닛 score, 1~5)",
    properties: {
      advancement: { type: "integer", example: 3 },
      compensation: { type: "integer", example: 5 },
      worklifeBalance: { type: "integer", example: 1 },
      culture: { type: "integer", example: 4 },
      management: { type: "integer", example: 2 },
    },
    required: ["advancement", "compensation", "worklifeBalance", "culture", "management"],
  },

  ReviewItem: {
    type: "object",
    description: "잡플래닛 reviews.json 원본을 camelCase로 평탄화한 개별 리뷰",
    properties: {
      id: { type: "integer", example: 5250944 },
      rating: { type: "integer", description: "종합 평점(overall, 1~5)", example: 4 },
      title: { type: "string" },
      pros: { type: "string", description: "장점 본문(줄바꿈 포함 원문)" },
      cons: { type: "string", description: "단점 본문(줄바꿈 포함 원문)" },
      occupation: { type: "string", example: "미디어/홍보" },
      employStatus: { type: "string", enum: ["현직원", "전직원"], example: "현직원" },
      date: { type: "string", example: "2025. 08" },
      helpfulCount: { type: "integer", example: 10 },
      scores: { $ref: "#/components/schemas/ReviewScore" },
    },
    required: [
      "id",
      "rating",
      "title",
      "pros",
      "cons",
      "occupation",
      "employStatus",
      "date",
      "helpfulCount",
      "scores",
    ],
  },

  ReviewSection: {
    type: "object",
    properties: {
      source: { type: "string", example: "잡플래닛" },
      overallRating: { type: "number", description: "종합 평점(5점 만점)", example: 3.0 },
      reviewCount: { type: "integer", example: 120 },
      ratings: { type: "array", items: { $ref: "#/components/schemas/ReviewRating" } },
      pros: { type: "array", items: { type: "string" } },
      cons: { type: "array", items: { type: "string" } },
      summary: { type: "string" },
      reviews: { type: "array", items: { $ref: "#/components/schemas/ReviewItem" } },
    },
    required: [
      "source",
      "overallRating",
      "reviewCount",
      "ratings",
      "pros",
      "cons",
      "summary",
      "reviews",
    ],
  },

  // ─── 성장성/뉴스 (뉴스 파이프라인 *_chosen_articles) ─────────────────────
  NewsItem: {
    type: "object",
    description: "원본 langchain Document(metadata + page_content)를 camelCase로 평탄화",
    properties: {
      id: { type: "string", example: "CJ_ENM-000001_0" },
      articleId: { type: "string", example: "CJ_ENM-000001" },
      company: { type: "string", example: "CJ ENM" },
      title: { type: "string" },
      media: { type: "string", example: "아이뉴스24" },
      url: { type: "string" },
      date: { type: "string", format: "date", example: "2024-05-09" },
      year: { type: "string", example: "2024" },
      month: { type: "string", example: "05" },
      articleIdx: { type: "integer" },
      articleType: {
        type: "string",
        enum: ["representative", "longest"],
        example: "representative",
      },
      paragraphStart: { type: "integer" },
      newsCount: { type: "integer" },
      content: { type: "string", description: "기사 본문(원본 page_content)" },
    },
    required: [
      "id",
      "articleId",
      "company",
      "title",
      "media",
      "url",
      "date",
      "year",
      "month",
      "articleIdx",
      "articleType",
      "paragraphStart",
      "newsCount",
      "content",
    ],
  },

  GrowthSection: {
    type: "object",
    properties: {
      summary: { type: "string" },
      news: { type: "array", items: { $ref: "#/components/schemas/NewsItem" } },
    },
    required: ["summary", "news"],
  },

  // ─── 채용 (채용공고 크롤링 산출물: 한 공고 = 한 직무 평탄 구조) ───────────
  JobDetail: {
    type: "object",
    properties: {
      name: { type: "string", example: "추천 플랫폼 엔지니어" },
      headcount: {
        type: "string",
        description: '원문 표현 보존("00명", "○명", "" 등)',
        example: "00명",
      },
      locations: { type: "array", items: { type: "string" }, example: ["서울"] },
      responsibilities: { type: "array", items: { type: "string" } },
      requirements: { type: "array", items: { type: "string" } },
      preferred: { type: "array", items: { type: "string" } },
    },
    required: ["name", "headcount", "locations", "responsibilities", "requirements", "preferred"],
  },

  JobQualification: {
    type: "object",
    properties: {
      education: { type: "string", description: "미기재 시 빈 문자열" },
      major: { type: "string", description: "미기재 시 빈 문자열" },
      documents: { type: "array", items: { type: "string" } },
    },
    required: ["education", "major", "documents"],
  },

  JobWorkConditions: {
    type: "object",
    properties: {
      employmentType: { type: "string", example: "정규직" },
      workType: { type: "string", description: "미기재 시 빈 문자열" },
      salary: { type: "string", description: "미기재 시 빈 문자열", example: "회사 내규에 따름" },
      benefits: { type: "array", items: { type: "string" } },
      deadline: {
        type: "string",
        nullable: true,
        description: "YYYY-MM-DD, 상시채용이면 null",
        example: "2026-06-21",
      },
      deadlineType: { type: "string", enum: ["fixed_date", "rolling"], example: "fixed_date" },
    },
    required: ["employmentType", "workType", "salary", "benefits", "deadline", "deadlineType"],
  },

  JobPosting: {
    type: "object",
    description: "채용공고 1건(한 공고 = 한 직무)",
    properties: {
      id: { type: "string" },
      companyName: { type: "string", example: "(주)CJ ENM" },
      title: { type: "string" },
      url: {
        type: "string",
        description: "원본 공고 링크(posting_refs.source_url, 없으면 빈 문자열)",
        example: "https://job.incruit.com/jobdb_info/jobpost.asp?job=2606110000017",
      },
      job: { $ref: "#/components/schemas/JobDetail" },
      qualification: { $ref: "#/components/schemas/JobQualification" },
      process: { type: "array", items: { type: "string" } },
      workConditions: { $ref: "#/components/schemas/JobWorkConditions" },
    },
    required: [
      "id",
      "companyName",
      "title",
      "url",
      "job",
      "qualification",
      "process",
      "workConditions",
    ],
  },

  HiringSection: {
    type: "object",
    properties: {
      summary: { type: "string" },
      openings: { type: "array", items: { $ref: "#/components/schemas/JobPosting" } },
    },
    required: ["summary", "openings"],
  },
}

export const getApiDocs = async () => {
  return createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "HCR API",
        version: "1.0.0",
        description: "HireCareRay 백엔드 API 문서 (현재 일부 엔드포인트는 더미 데이터 응답)",
      },
      components: { schemas },
    },
  })
}
