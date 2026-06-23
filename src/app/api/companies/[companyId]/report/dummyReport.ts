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
import { cjEnmNewsFixtures } from "@/features/company/services/cjEnmNewsFixtures"

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
      industry: "방송·미디어·콘텐츠",
    },
    overview: {
      businessDescription:
        "CJ ENM은 글로벌 종합 콘텐츠 기업으로, 다양한 장르의 방송 채널을 통해 K콘텐츠를 제공하며, 음악, 영화, 공연 예술, 디지털 비즈니스, 애니메이션 등 다양한 분야에서 활동하고 있습니다.",
      mainProductsServices: ["방송 채널", "음악", "영화", "디지털 콘텐츠", "뮤지컬", "애니메이션"],
      talentValues: "공감력, 독창성, 사명감",
      ceoMessage: null,
      websiteUrl: "https://www.cjenm.com",
      // 채용사이트(jobkorea/catch/incruit) 크롤러 산출물(company_profile)을 그대로 옮긴 값.
      // 키만 camelCase로 바꿨고 값 문자열은 원본 형태 보존(백엔드 연결 시 snake→camel 1회).
      profile: {
        industry: "텔레비전 방송업",
        companySize: "대기업",
        companyType: "코스닥",
        founded: "1994.12.16 | (33년차)",
        ceo: "구창근, 윤상현",
        employeeCount: "3,078명 2025.12 | 3,078명",
        revenue: "별도 2조 7,838억 2025.12 | 2조 7,838억 | 연결 5조 1,345억 2025.12 | 5조 1,345억",
        capital: "1,105억 7천만원 | (2025.12.31)",
        entrySalary: "2,885만원",
        address: "(06761) 서울특별시 서초구 과천대로 870-13 (방배동)",
        mainBusiness:
          "방송채널,콘텐츠 제작,광고/상품 판매 커머스사업/영화 제작,투자,배급,뮤지컬 공연/음반,음원 제작,유통,콘서트,매니지먼트",
        creditRating: null,
        insurance: ["국민연금", "건강보험", "고용보험", "산재보험"],
      },
      // 연혁(history) — 크롤러 산출물, 최신순.
      history: [
        {
          year: "2026",
          month: "02",
          events: ["중국 NCC엔터테인먼트와 합작법인(JV) ''원시드(ONECEAD)'' 설립"],
        },
        {
          year: "2025",
          month: "10",
          events: ["제로베이스원 '제16회 대한민국 대중문화예술상' 문화체육관광부장관 표창 수상"],
        },
        {
          year: "2025",
          month: "09",
          events: [
            "<커플팰리스> '베니스 TV 어워즈(Venice TV Awards) 2025' 라이트 엔터테인먼트 골드 트로피 수상",
            "<Severance 시즌2> '제77회 프라임타임 에미상' 여우주연상 등 8개 부문 수상",
          ],
        },
        {
          year: "2025",
          month: "08",
          events: ["일본 하쿠호도와 합작법인(JV) '챕터아이(Chapter-I)' 설립"],
        },
        {
          year: "2025",
          month: "05",
          events: [
            "한국컴플라이언스협회 '2025년 상반기 대한민국 컴플라이언스 어워즈' 기업부문 대상 수상",
            "영화 <하얼빈> 제 61회 백상예술대상 영화부문 작품상 수상",
          ],
        },
        {
          year: "2025",
          month: "04",
          events: ["제로베이스원 미니 5집 앨범, '빌보드200' 28위 진입"],
        },
        {
          year: "2024",
          month: "11",
          events: [
            "CJ온스타일 2024년 민관 협력 오픈 이노베이션 지원사업 '중소벤처기업부 장관상' 수상",
          ],
        },
        { year: "2024", month: "10", events: ["티빙 MAU(월간 활성 이용자 수) 800만명 기록"] },
        {
          year: "2024",
          month: "07",
          events: ["INI 일본 싱글 앨범, 日 골든 디스크 '밀리언' 인증 획득"],
        },
        {
          year: "2024",
          month: "06",
          events: ["INI 및 JO1 일본 싱글 앨범, 각각 日 골든 디스크 '트리플 플래티넘' 인증 획득"],
        },
        {
          year: "2024",
          month: "04",
          events: [
            "<선재 업고 튀어> Rakuten Viki 공개 첫 주 133개국 1위 기록",
            "(주)씨제이이엔엠 윤상현, 구창근 각자 대표에서 윤상현 단독 대표로 변경",
          ],
        },
        {
          year: "2024",
          month: "03",
          events: ["제로베이스원 일본 데뷔 앨범 日 골든 디스크 '더블 플래티넘' 인증 획득"],
        },
        { year: "2023", month: "12", events: ["Fifth Season, 일 TOHO 대상 제3자배정 유상증자"] },
        {
          year: "2023",
          month: "11",
          events: [
            "<패스트라이브즈> 제 49회 뉴욕 비평가 협회상 신인상, 제 16회 아시아 태평양 스크린 어워드 감독상 수상",
          ],
        },
        {
          year: "2023",
          month: "07",
          events: [
            "제로베이스원 데뷔앨범 초동 판매량 182만장 판매기록, 'KPOP그룹 데뷔앨범' 기준 최다",
          ],
        },
        {
          year: "2023",
          month: "05",
          events: ["티빙 오리지널 시리즈 <몸값> 제 6회 칸 시리즈 국제 페스티벌 각본상 수상"],
        },
        { year: "2023", month: "03", events: ["(주)씨제이이엔엠 대표이사 구창근 선임"] },
        {
          year: "2022",
          month: "12",
          events: [
            "(주)만화가족, (주)에그이즈커밍 합병",
            "씨제이이엔엠 스튜디오스(주), (주)본팩토리, (주)엠메이커스, (주)모호필름, (주)제이케이필름, (주)블라드스튜디오, (주)용필름, (주)만화가족, (주)에그이즈",
            "(주)티빙, (주)케이티스튜디오지니의 OTT 플랫폼 (주)케이티시즌 합병",
          ],
        },
        { year: "2022", month: "07", events: ["<2022 K-ESG 경영대상> 사회부문 ESG 대상 수상"] },
        {
          year: "2022",
          month: "05",
          events: ["제 75회 칸 영화제 <헤어질 결심> 감독상, <브로커> 남우주연상 수상"],
        },
        { year: "2022", month: "04", events: ["'씨제이이엔엠 스튜디오스(주)' 설립"] },
        { year: "2022", month: "03", events: ["(주)씨제이이엔엠 대표이사 윤상현 선임"] },
        {
          year: "2022",
          month: "01",
          events: ["Endeavor Content Parent, LLC 인수", "01월 Endeavor Content Parent, LLC 인수"],
        },
        { year: "2021", month: "10", events: ["한국IR협의회 '한국 IR대상' 최우수상 수상"] },
        {
          year: "2021",
          month: "05",
          events: [
            "TV 커머스 & 온라인 몰 통합 브랜드 <CJ ONSTYLE> 론칭",
            "신규 방송 채널 <tvN STORY> 개국",
          ],
        },
        { year: "2021", month: "03", events: ["(주)씨제이이엔엠 대표이사 강호성 선임"] },
        { year: "2020", month: "12", events: ["미디어커머스 법인 (주)다다엠앤씨(DADA M&C) 설립"] },
        {
          year: "2020",
          month: "10",
          events: [
            "OTT 사업부문 티빙 물적분할 및 (주)티빙 설립",
            "OTT 사업부 티빙 물적분할 및 (주)티빙 설립",
          ],
        },
        {
          year: "2020",
          month: "02",
          events: ["영화 <기생충> 제92회 미국 아카데미 시상식 작품상 등 4개 부문 수상"],
        },
        { year: "2019", month: "12", events: ["(주)씨제이헬로, (주)엘지유플러스에 양도"] },
        { year: "2019", month: "05", events: ["영화 <기생충> 제72회 칸 영화제 황금종려상 수상"] },
        {
          year: "2019",
          month: "03",
          events: [
            "(주) 씨제이이엔엠 각자대표체제, 대표이사 허민회, 허민호 선임",
            "한국거래소 코스닥시장 공시우수법인 수상",
          ],
        },
        { year: "2018", month: "10", events: ["씨제이디지털뮤직(주), (주)지니뮤직에 흡수합병"] },
        {
          year: "2018",
          month: "07",
          events: [
            "(주)씨제이이엔엠 대표이사 허민회 취임",
            "(주)씨제이오쇼핑, 씨제이이앤엠(주) 합병 및 사명 변경 : (주)씨제이이엔엠 (CJ ENM)",
          ],
        },
        { year: "2001", month: "07", events: ["본점소재지 변경:  서울시 서초구 과천대로 870-13"] },
        { year: "2000", month: "05", events: ["최대주주 변경: 씨제이(주)"] },
      ],
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
    // 잡플래닛 리뷰 크롤링 산출물(reviews.json) 기반.
    // 집계값(overallRating·ratings)은 수집된 120건 평균이며, reviews는 도움돼요 상위 대표 리뷰입니다.
    // 원본 키(advancement_rating 등)는 camelCase로 변환했고, employ_status_name 불리언은
    // "현직원"/"전직원"으로 매핑했습니다. (백엔드 연결 시 snake→camel + bool→라벨 매핑)
    review: {
      source: "잡플래닛",
      overallRating: 3.0,
      reviewCount: 120,
      ratings: [
        { label: "복지·급여", score: 3.0 },
        { label: "워라밸", score: 2.7 },
        { label: "사내문화", score: 2.8 },
        { label: "승진·성장", score: 2.3 },
        { label: "경영진", score: 1.9 },
      ],
      pros: [
        "CJ 계열사 임직원 할인(올리브영·CGV)",
        "엔터다운 유연한 근무·격주 휴무",
        "부서 이동 등 다양한 경험",
      ],
      cons: ["대기업 이름값 대비 낮은 급여", "야근·주말근무 부담", "승진 한계와 줄서기 문화"],
      summary:
        "유연한 근무와 CJ 계열사 복지는 강점이나, 급여 수준·승진 기회·경영진 평가가 낮다는 의견이 많습니다.",
      reviews: [
        {
          id: 5250944,
          rating: 4,
          title: "여기서 배워놓으면 어디로 이직하던 인정받음",
          pros: "복지가 꽤 좋은편이었고 씨제이이엔엠 다닌다고 하면 다들 부러워 했음",
          cons: "워라밸이 없었고, 보고를 위한 보고, 업무를 위한 업무가 많았음",
          occupation: "미디어/홍보",
          employStatus: "현직원",
          date: "2025. 08",
          helpfulCount: 10,
          scores: {
            advancement: 3,
            compensation: 5,
            worklifeBalance: 1,
            culture: 4,
            management: 2,
          },
        },
        {
          id: 4361676,
          rating: 5,
          title: "그냥 평범합니다 방송국입니다 가족회사",
          pros: "올리브영할인이 되는건 좋은거 같아요 그거말곤 잘모르겠음",
          cons: "그냥 뭐 가족회사에요 여기도 할말이 없네요 그냥 이럴듯",
          occupation: "개발",
          employStatus: "현직원",
          date: "2024. 04",
          helpfulCount: 9,
          scores: {
            advancement: 1,
            compensation: 1,
            worklifeBalance: 1,
            culture: 1,
            management: 1,
          },
        },
        {
          id: 5610784,
          rating: 2,
          title: "트랜드를 쫓아가고 싶지만 항상 몇 발 늦음. 리더가 아닌 따라쟁이가 됨..",
          pros: "현기준 워라벨만큼은 타기업이 보면 부러워 할 정도\n몇몇을 제외하곤 정시퇴근, 격주 금요일 휴무\n계열사 할인 등",
          cons: "복지가지고 간을 엄청봄 \n항상 연초만 되면 격주 금요일 휴무가 없어질거라는 소문이 들림 \n연봉 인상률 짬, 성과급은 안주려고 불가능한 목표를 세우는 것 같음. 그치만 특정 본부는 항상 잘나오는 것 같음..",
          occupation: "미디어/홍보",
          employStatus: "현직원",
          date: "2026. 03",
          helpfulCount: 8,
          scores: {
            advancement: 2,
            compensation: 2,
            worklifeBalance: 4,
            culture: 2,
            management: 1,
          },
        },
        {
          id: 5629336,
          rating: 3,
          title: "외부에서는 최고의 대기업으로 보지만 실제 재직을 하면 슬퍼지는 묘한 회사",
          pros: "올리브영, 몽중헌, CGV 등 임직원 할인 복지 혜택이 주어짐",
          cons: "이름은 대기업이지만 연봉은 왠만한 중소 기업급 밖에 안됨. 업무도 비정상적으로 많아서 야근은 무조건 필수이고 주말과 연휴 때고 거의 일을 해야하는 구조. 최근에는 사람도 많이 나갔는데 새로 뽑지는 않아서 인력도 상당히 부족…",
          occupation: "마케팅/시장조사",
          employStatus: "전직원",
          date: "2026. 03",
          helpfulCount: 7,
          scores: {
            advancement: 1,
            compensation: 4,
            worklifeBalance: 2,
            culture: 3,
            management: 2,
          },
        },
        {
          id: 5412940,
          rating: 3,
          title: "제자리 걸음에 지친다. 직원은 그저 소모품",
          pros: "올리브영할인, 개인 편집실, 리프레쉬 휴가, 시즌제 운영",
          cons: "윗선에 잘 보이고 빽(?)이 있어야 오래 다닐 수 있음. 절대 능력만으로는 살아남을 수 없는 곳",
          occupation: "미디어/홍보",
          employStatus: "현직원",
          date: "2025. 11",
          helpfulCount: 6,
          scores: {
            advancement: 2,
            compensation: 3,
            worklifeBalance: 3,
            culture: 3,
            management: 1,
          },
        },
        {
          id: 5368627,
          rating: 3,
          title: "엔터회사다운 자유롭고 유연한 근무환경",
          pros: "BI 제도가 있어서 4.5일제 체감 가능하고, 임직원카드를 통한 cj 계열사 할인혜택이 매우 쏠쏠함",
          cons: "급여가 너무 짜고, 계약직 정규직의 업무구분이 희미하다",
          occupation: "금융/재무",
          employStatus: "전직원",
          date: "2025. 10",
          helpfulCount: 6,
          scores: {
            advancement: 2,
            compensation: 4,
            worklifeBalance: 3,
            culture: 3,
            management: 2,
          },
        },
        {
          id: 4963941,
          rating: 2,
          title: "10년전 기준으론 복지는 좋았으나 ..",
          pros: "그래도 큰 회사라 부서 이동이 가능한점. 여차하면 다른데로 튈수 있음",
          cons: "급여가 너무 낮고, 연봉역전. 승진기회도 없고 님문화 임",
          occupation: "미디어/홍보",
          employStatus: "현직원",
          date: "2025. 02",
          helpfulCount: 6,
          scores: {
            advancement: 1,
            compensation: 1,
            worklifeBalance: 2,
            culture: 2,
            management: 1,
          },
        },
      ],
    },
    growth: {
      summary:
        "K콘텐츠 글로벌 수요 확대와 티빙(TVING) 중심의 디지털 전환이 중장기 성장 동력으로 평가됩니다.",
      // 팀 뉴스 파이프라인(ChromaDB) 실데이터 — 홈 이슈 브리핑과 동일한 단일 출처를 참조합니다.
      news: cjEnmNewsFixtures,
    },
    hiring: {
      summary: "커머스·데이터·디자인 등 IT·기술 직군을 중심으로 경력 채용이 활발합니다.",
      // 팀 채용 크롤링 산출물(JobPostingFixture) 실데이터입니다.
      openings: [
        {
          id: "4337b91b45eba194235b",
          companyName: "(주)CJ ENM",
          title: "CJ ENM 커머스부문 [추천 플랫폼 엔지니어] 경력사원 채용",
          url: "https://job.incruit.com/jobdb_info/jobpost.asp?job=2606110000017",
          job: {
            name: "추천 플랫폼 엔지니어",
            headcount: "00명",
            locations: ["서울"],
            responsibilities: [
              "추천 모델 서비스화 및 Java/Python 기반 백엔드 시스템 개발",
              "추천 모델과 추천 로직을 서비스 환경에 연결하는 백엔드 아키텍처 설계 및 개발",
              "대용량 트래픽 환경의 추천 서빙 API 설계 및 레이턴시 최적화",
              "Airflow 기반 데이터 배치 프로세스 운영 및 관리",
              "실시간 사용자 행동 데이터 수집 파이프라인 구축 및 운영",
              "AWS 컨테이너 환경의 추천 서비스 인프라 운영 및 최적화",
            ],
            requirements: [
              "Java/Spring 기반 서비스 개발 및 운영 경력",
              "대규모 데이터 파이프라인 개발 및 운영 경험",
              "대용량 API 시스템 성능 최적화 경험",
              "Airflow 기반 Python 데이터 배치 운영 경험",
              "AWS, Docker, ECS 등 클라우드 인프라 이해",
            ],
            preferred: [
              "AWS Athena, Glue 등 빅데이터 쿼리 엔진 활용 경험",
              "Kafka, Kinesis 등 실시간 스트리밍 처리 경험",
              "추천 모델 서빙 및 MLOps 경험",
              "이커머스 추천 플랫폼 경험",
            ],
          },
          qualification: {
            education: "",
            major: "",
            documents: [],
          },
          process: ["서류 접수: 2026.06.10 ~ 2026.06.21"],
          workConditions: {
            employmentType: "정규직",
            workType: "",
            salary: "",
            benefits: [],
            deadline: "2026-06-21",
            deadlineType: "fixed_date",
          },
        },
        {
          id: "a63f1ca8292ecdd80c30",
          companyName: "CJ ENM",
          title: "Data Scientist 채용",
          url: "https://www.catch.co.kr/NCS/RecruitInfoDetails/549990",
          job: {
            name: "Data Scientist",
            headcount: "00명",
            locations: ["서울"],
            responsibilities: [
              "Python 및 SQL을 활용한 콘텐츠 Value Chain 데이터 분석",
              "시청 지표와 사용자 반응 데이터 기반 콘텐츠 성과 분석",
              "비즈니스 핵심 문제 정의 및 데이터 기반 의사결정 지원",
              "분석용 데이터셋과 데이터 마트 설계 협업",
              "BI 도구를 활용한 사내 대시보드 구축 및 운영",
              "LLM 기반 AI Agent와 자연어 데이터 조회 구조 설계",
              "Databricks 환경의 대용량 데이터 탐색 및 모델링",
            ],
            requirements: [
              "데이터 분석 또는 데이터 사이언스 관련 경력 3년 이상",
              "Python 기반 데이터 처리 및 분석 역량",
              "SQL 활용 데이터 추출 및 가공 능력",
              "비정형 데이터 처리 및 활용 경험",
              "LLM, RAG, 벡터DB 또는 임베딩 검색 구조 이해",
            ],
            preferred: [
              "엔터테인먼트 산업 데이터 분석 경험",
              "LLM 기반 서비스 또는 AI Agent 개발 경험",
              "Databricks 또는 Spark 기반 분석 경험",
              "데이터 분석 관련 자격증 또는 프로젝트 경험",
            ],
          },
          qualification: {
            education: "4년제 대학 졸업자 이상",
            major: "통계학, 컴퓨터공학, 산업공학, 수학 등 관련 전공",
            documents: ["포트폴리오 제출 필수"],
          },
          process: [
            "서류전형",
            "1차 면접",
            "2차 면접",
            "평판조회",
            "채용검진",
            "처우협의",
            "합격자 발표",
          ],
          workConditions: {
            employmentType: "정규직",
            workType: "",
            salary: "",
            benefits: ["입사일로부터 3개월 수습기간 적용"],
            deadline: "2026-07-03",
            deadlineType: "fixed_date",
          },
        },
        {
          id: "b07667cb3eb79ffd3139",
          companyName: "CJ ENM",
          title: "Mnet Plus Product Designer 경력채용",
          url: "https://www.catch.co.kr/NCS/RecruitInfoDetails/549296",
          job: {
            name: "Product Designer",
            headcount: "00명",
            locations: ["서울"],
            responsibilities: [
              "Mnet Plus 사용자 중심 제품 및 서비스 설계",
              "사용자 조사와 테스트를 통한 고객 니즈 파악",
              "정량·정성 데이터 분석 및 개선 기회 도출",
              "와이어프레임과 프로토타입 제작",
              "UX/UI 및 디자인 시스템 개선",
              "개발팀과 협업하여 디자인 품질과 일관성 보장",
            ],
            requirements: [
              "프로덕트 디자인 경력 5년 이상 또는 이에 준하는 역량",
              "Android, iOS, Web 실무 환경 이해",
              "디자인 시스템 기반 UI/UX 설계 경험",
              "논리적 설득력과 협업 능력",
            ],
            preferred: [
              "제품 설계부터 시장 출시까지 수행한 경험",
              "데이터 기반 제품 개선 경험",
              "패션, 방송, K-POP 플랫폼 디자인 경험",
              "우선순위와 마감 관리 능력",
            ],
          },
          qualification: {
            education: "",
            major: "",
            documents: ["포트폴리오 제출 필수"],
          },
          process: ["서류전형", "1·2차 면접", "평판조회", "채용검진", "처우협의", "합격자 발표"],
          workConditions: {
            employmentType: "정규직",
            workType: "상세 불명",
            salary: "",
            benefits: [],
            deadline: "2026-06-26",
            deadlineType: "fixed_date",
          },
        },
        {
          id: "62945315cd3b3c07da52",
          companyName: "CJ ENM",
          title: "[Mnet Plus] Web/App Lead 경력채용",
          url: "https://www.jobkorea.co.kr/Recruit/GI_Read_Comt_Ifrm?Gno=49016807",
          job: {
            name: "Mnet Plus Web/App Lead",
            headcount: "○명",
            locations: ["서울특별시 마포구 상암산로 66"],
            responsibilities: [
              "Web/App 프론트엔드 아키텍처와 기술 방향성 리딩",
              "라이브스트리밍, 투표, 결제 등 글로벌 핵심 기능 개발 주도",
              "안정적인 서비스 운영 체계 구축",
              "App 및 Web 개발 파트 매니징",
            ],
            requirements: [
              "프론트엔드 또는 모바일 테크 리드 경험 5년 이상",
              "개발 프로세스와 품질 기준을 설계하고 정착시킨 경험",
              "React Native 기반 서비스 개발 및 기술 리딩 경험",
              "JavaScript, TypeScript와 렌더링·성능·보안 이해",
              "다양한 직군과 협업 가능한 커뮤니케이션 역량",
            ],
            preferred: [
              "글로벌·다국어 서비스 개발 및 운영 경험",
              "초기 팀 빌딩과 개발 프로세스 구축 경험",
            ],
          },
          qualification: {
            education: "",
            major: "",
            documents: [],
          },
          process: ["2025.12.18부터 채용 시까지 상시채용"],
          workConditions: {
            employmentType: "정규직 (협의)",
            workType: "",
            salary: "회사 내규에 따름",
            benefits: [],
            deadline: null,
            deadlineType: "rolling",
          },
        },
        {
          id: "3c3fa750ba51bce320ea",
          companyName: "CJ ENM",
          title: "커머스부문 [개인정보보호 담당자] 경력사원 채용",
          url: "https://www.catch.co.kr/NCS/RecruitInfoDetails/555048",
          job: {
            name: "개인정보보호 담당자",
            headcount: "",
            locations: ["서울"],
            responsibilities: [
              "개인정보보호 관리체계 운영 및 고도화",
              "개인정보보호 인증 관리",
              "임직원 정보보호 교육과 인식 제고",
              "개인정보 Life-Cycle 현황 점검 및 개선",
              "개인정보 관련 보안성 검토",
            ],
            requirements: [
              "개인정보보호 관리체계 구축 및 운영 경력 3~7년",
              "개인정보보호법 등 규제 영향도 분석 및 대응 경험",
              "규제기관 실태점검과 ISMS-P 인증 심사 대응 경험",
              "개인정보보호 관련 법률 이해",
              "다양한 조직과 협업하는 커뮤니케이션 역량",
            ],
            preferred: [
              "정보보호 관련 석사 학위",
              "ISMS-P 인증심사원",
              "Cloud 보안 관련 자격 또는 인증 관리 경험",
              "웹 및 오픈소스 개발 언어 활용 역량",
            ],
          },
          qualification: {
            education: "학사 이상",
            major: "전공 무관",
            documents: [],
          },
          process: ["서류전형", "면접전형"],
          workConditions: {
            employmentType: "정규직",
            workType: "",
            salary: "",
            benefits: [],
            deadline: "2026-06-14",
            deadlineType: "fixed_date",
          },
        },
      ],
    },
    insight: {
      headline:
        "K콘텐츠 글로벌 1위 역량을 갖췄지만 콘텐츠 투자로 단기 수익성은 부담입니다. 안정보다 성장·도전을 원하는 지원자에게 잘 맞습니다.",
      keyPoints: [
        "1분기 흑자 전환으로 실적 회복 국면에 진입했어요",
        "IT·데이터·디자인 등 기술 직군 경력 채용이 활발해요",
        "인재상은 독창성·공감력·사명감 — 자소서에 녹여보세요",
      ],
      vision:
        "K콘텐츠의 글로벌 경쟁력을 바탕으로 티빙(TVING)을 축으로 한 OTT 사업 확장과 IP 기반 부가 사업(음악·공연·커머스) 결합이 중장기 성장의 핵심으로 보입니다. 단기적으로는 콘텐츠 투자 부담으로 수익성 회복 속도가 관건입니다.",
      // 업계·경쟁사는 ②(AI 추론)이며, 더미는 보유 뉴스에 언급된 사실에 한정해 작성했습니다.
      industry:
        "국내외 OTT 시장은 넷플릭스가 독주하는 가운데 국내 사업자 간 경쟁이 치열합니다. CJ ENM은 티빙을 중심으로 대응하며, 웨이브와의 합병 논의가 지지부진하자 왓챠 인수를 검토하는 등 규모 확대를 모색하고 있습니다. 동시에 K콘텐츠의 글로벌 수요 확대와 생성형 AI 콘텐츠 제작이라는 새로운 흐름이 산업 전반을 재편하고 있습니다.",
      competitors: [
        {
          name: "넷플릭스",
          description: "글로벌 OTT 1위 사업자로, 티빙과 국내 가입자를 두고 직접 경쟁",
        },
        {
          name: "웨이브",
          description: "지상파 3사 기반 국내 OTT, 티빙과 합병이 논의됐으나 진전은 더딘 상태",
        },
        {
          name: "스튜디오드래곤",
          description: "드라마 제작 부문 경쟁자(다만 CJ ENM 계열사로 협력 관계이기도 함)",
        },
      ],
      swot: {
        strengths: [
          "압도적인 콘텐츠 제작·IP 역량",
          "방송·음악·영화·커머스 수직 계열화",
          "글로벌 K콘텐츠 브랜드 인지도",
        ],
        weaknesses: ["콘텐츠 투자에 따른 수익성 변동성", "높은 부채비율", "OTT 시장 내 후발 주자"],
        opportunities: ["글로벌 K콘텐츠 수요 확대", "티빙 가입자 성장", "IP 활용 신사업 확장"],
        threats: ["넷플릭스 등 글로벌 OTT와의 경쟁 심화", "제작비 상승", "광고 시장 둔화"],
      },
    },
    generatedAt: "2026-06-21T00:00:00.000Z",
  }
}
