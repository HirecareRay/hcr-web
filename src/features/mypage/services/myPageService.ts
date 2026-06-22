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
