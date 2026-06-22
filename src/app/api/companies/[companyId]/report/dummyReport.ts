/**
 * dummyReport.ts
 *
 * 회사 보고서 더미 데이터입니다.
 * DB/AI 백엔드가 미완성이라, 라우트 핸들러가 DB 조회 대신 이 더미를 응답합니다.
 *
 * ⚠️ 추후 진짜 DB/AI 연결 시, 이 파일(더미 생성 부분)만 실제 조회 로직으로 교체하세요.
 *    응답 타입(CompanyReport)과 프론트 코드는 그대로 유지됩니다.
 *
 * 수치는 실제 보유 데이터(DART 재무지표/직원현황, company-crawler)의 CJ ENM 값을
 * 참고해 채웠습니다.
 */

import type { CompanyReport } from "@/features/company/types/company"

/**
 * 요청된 companyId로 더미 보고서를 생성합니다.
 * 지금은 어떤 id가 와도 CJ ENM 샘플을 반환하되, 요청 id를 company.id에 그대로 반영합니다.
 */
export function buildDummyReport(companyId: string): CompanyReport {
  return {
    company: {
      id: companyId,
      name: "CJ ENM",
      corpCode: "00265324",
      stockCode: "035760",
    },
    overview: {
      businessDescription:
        "CJ ENM은 글로벌 종합 콘텐츠 기업으로, 다양한 장르의 방송 채널을 통해 K콘텐츠를 제공하며, 음악, 영화, 공연 예술, 디지털 비즈니스, 애니메이션 등 다양한 분야에서 활동하고 있습니다.",
      mainProductsServices: ["방송 채널", "음악", "영화", "디지털 콘텐츠", "뮤지컬", "애니메이션"],
      talentValues: "공감력, 독창성, 사명감",
      ceoMessage: null,
      websiteUrl: "https://www.cjenm.com",
    },
    financial: {
      year: "2024",
      source: "DART 전자공시",
      profitability: [
        { label: "매출총이익률", value: 32.71, unit: "%" },
        { label: "순이익률", value: -11.1, unit: "%" },
        { label: "ROE", value: -14.79, unit: "%" },
        { label: "판관비율", value: 30.48, unit: "%" },
      ],
      stability: [
        { label: "자기자본비율", value: 39.48, unit: "%" },
        { label: "부채비율", value: 153.3, unit: "%" },
        { label: "유동비율", value: 76.28, unit: "%" },
        { label: "비유동비율", value: 174.2, unit: "%" },
      ],
      summary:
        "2024년 매출총이익률은 32.7%로 양호하나 순이익률(-11.1%)과 ROE(-14.8%)가 마이너스로, 콘텐츠 투자 확대에 따른 수익성 부담이 나타납니다. 부채비율은 153%로 다소 높은 편입니다.",
    },
    employees: {
      year: "2024",
      source: "DART 직원현황",
      totalCount: 3372,
      maleCount: 1604,
      femaleCount: 1768,
      avgSalary: 89000000,
      avgTenureYears: 6.4,
    },
    growth: {
      summary:
        "K콘텐츠 글로벌 수요 확대와 티빙(TVING) 중심의 디지털 전환이 중장기 성장 동력으로 평가됩니다.",
      news: [
        {
          title: "CJ ENM, 글로벌 OTT 협업 확대로 K콘텐츠 수출 가속",
          url: "https://example.com/news/cjenm-global-ott",
          publishedAt: "2026-05-28",
          source: "한국경제",
        },
        {
          title: "티빙·웨이브 합병 시너지 본격화…디지털 매출 성장세",
          url: "https://example.com/news/tving-wavve",
          publishedAt: "2026-05-12",
          source: "전자신문",
        },
        {
          title: "CJ ENM, 신인 IP 발굴 위한 제작 스튜디오 신설",
          url: "https://example.com/news/cjenm-studio",
          publishedAt: "2026-04-30",
          source: "머니투데이",
        },
      ],
    },
    hiring: {
      summary: "콘텐츠 기획·데이터 직군 중심으로 신입 및 경력 채용이 진행 중입니다.",
      openings: [
        {
          title: "콘텐츠 데이터 분석가 (신입/경력)",
          url: "https://example.com/jobs/cjenm-data-analyst",
          employmentType: "정규직",
          experienceLevel: "신입·경력",
          location: "서울 마포구",
          deadline: "2026-07-10",
        },
        {
          title: "글로벌 콘텐츠 사업기획 담당자",
          url: "https://example.com/jobs/cjenm-content-planner",
          employmentType: "정규직",
          experienceLevel: "경력 3년 이상",
          location: "서울 마포구",
          deadline: "2026-06-30",
        },
      ],
    },
    generatedAt: "2026-06-21T00:00:00.000Z",
  }
}
