import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"

/**
 * @swagger
 * /api/jobs/{jobId}:
 *   get:
 *     summary: 채용공고 상세 조회
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 채용공고 상세
 *       404:
 *         description: 공고 없음
 *       500:
 *         description: 서버 오류
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const { jobId } = await params
    logger.api("GET", `/api/jobs/${jobId}`)

    const jobs: Record<string, object> = {
      "5e9cabd040c307d7aa142e73": {
        id: "5e9cabd040c307d7aa142e73",
        companyId: "6a3ca079d7da326c0781963c",
        companyName: "CJ ENM",
        title: "Data Scientist 채용",
        category: "데이터",
        location: "서울",
        employmentType: "정규직",
        deadline: "2026.07.03",
        status: "open",
        tags: ["데이터분석", "머신러닝", "Python"],
        bookmarked: false,
        description: "CJ ENM 데이터 사이언티스트를 모집합니다.",
        responsibilities: ["데이터 분석 및 모델링", "추천 알고리즘 개발", "비즈니스 인사이트 도출"],
        requirements: ["Python 또는 R 활용 능력", "머신러닝 관련 프로젝트 경험"],
        preferredQualifications: ["추천 시스템 개발 경험", "대용량 데이터 처리 경험 (Spark 등)"],
        hiringProcess: ["서류 전형", "코딩 테스트", "1차 기술 면접", "2차 임원 면접", "최종 합격"],
        documents: ["이력서", "포트폴리오 (선택)"],
        companyWebsite: "https://www.cjenm.com",
      },
      "500116c9eb165c7a8f97fbd3": {
        id: "500116c9eb165c7a8f97fbd3",
        companyId: "6a3ca079d7da326c0781963c",
        companyName: "CJ ENM",
        title: "[Mnet Plus] Web/App Lead 경력채용",
        category: "개발",
        location: "서울 마포구",
        employmentType: "정규직 (협의)",
        deadline: "상시채용",
        status: "rolling",
        tags: ["React", "Next.js", "리더십"],
        bookmarked: true,
        description: "Mnet Plus 서비스를 이끌 Web/App 리드 개발자를 모집합니다.",
        responsibilities: ["Web/App 서비스 설계 및 개발 리드", "코드 리뷰 및 기술 의사결정"],
        requirements: ["React/Next.js 5년 이상 경력", "팀 리딩 경험"],
        preferredQualifications: ["React Native 경험", "스트리밍 서비스 개발 경험"],
        hiringProcess: ["서류 전형", "1차 기술 면접", "2차 임원 면접", "최종 합격"],
        documents: ["이력서", "경력기술서"],
        companyWebsite: "https://www.cjenm.com",
      },
    }

    const job = jobs[jobId]
    if (!job) {
      return NextResponse.json(
        { success: false, message: "공고를 찾을 수 없어요." },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: job }, { status: 200 })
  } catch (error) {
    logger.error("GET /api/jobs/[jobId] 실패", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}
