import type {
  CareerDocumentFixture,
  MyPageActivityFixture,
  UserProfileFixture,
} from "../types/mypage"

export const userProfileFixture: UserProfileFixture = {
  name: "김취준",
  email: "getajob@example.com",
  statusMessage: "프론트엔드 개발자를 준비하고 있어요",
  completionRate: 65,
}

export const jobCategories = [
  {
    label: "개발",
    jobs: ["프론트엔드", "백엔드", "풀스택", "iOS", "Android", "DevOps", "QA"],
  },
  {
    label: "데이터",
    jobs: ["데이터 분석", "머신러닝", "데이터 엔지니어", "BI 분석"],
  },
  {
    label: "디자인",
    jobs: ["UI/UX", "그래픽 디자인", "제품 디자인", "브랜드 디자인"],
  },
  {
    label: "기획",
    jobs: ["서비스 기획", "PM", "콘텐츠 기획", "마케팅"],
  },
  {
    label: "보안",
    jobs: ["정보보안", "클라우드 보안", "개인정보보호", "침해 대응"],
  },
]

export const defaultInterestJobs = ["프론트엔드", "스타트업", "신입"]

export const careerDocumentFixtures: CareerDocumentFixture[] = [
  {
    id: "resume",
    type: "resume",
    label: "이력서",
    count: 1,
    description: "경력과 학력 정보를 관리해요",
  },
  {
    id: "cover-letter",
    type: "coverLetter",
    label: "자기소개서",
    count: 2,
    description: "지원 기업별 자소서를 관리해요",
  },
  {
    id: "portfolio",
    type: "portfolio",
    label: "포트폴리오",
    count: 1,
    description: "링크와 파일을 모아 관리해요",
  },
  {
    id: "project",
    type: "project",
    label: "프로젝트",
    count: 3,
    description: "주요 프로젝트 경험을 정리해요",
  },
]

export const myPageActivityFixture: MyPageActivityFixture = {
  recentlyViewedCompanies: 4,
  recentlyViewedJobs: 7,
  bookmarkedCompanies: 2,
  bookmarkedJobs: 5,
  interviewResults: 3,
}
