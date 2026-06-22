import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

/**
 * @swagger
 * /api/mypage/saved-jobs:
 *   get:
 *     summary: 저장 공고 목록
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 저장한 채용공고 목록
 *       500:
 *         description: 서버 오류
 *   post:
 *     summary: 공고 저장/취소 토글
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 저장 상태 변경 성공
 *       500:
 *         description: 서버 오류
 */
export async function GET() {
  try {
    logger.api("GET", "/api/mypage/saved-jobs")
    return NextResponse.json(
      {
        success: true,
        data: [
          {
            id: "a63f1ca8292ecdd80c30",
            companyName: "CJ ENM",
            title: "Data Scientist 채용",
            location: "서울",
            employmentType: "정규직",
            deadline: "2026.07.03",
            status: "open",
          },
          {
            id: "62945315cd3b3c07da52",
            companyName: "CJ ENM",
            title: "[Mnet Plus] Web/App Lead 경력채용",
            location: "서울 마포구",
            employmentType: "정규직 (협의)",
            deadline: "상시채용",
            status: "rolling",
          },
        ],
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error("GET /api/mypage/saved-jobs 실패", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { jobId } = await req.json()
    logger.api("POST", "/api/mypage/saved-jobs", { jobId })
    return NextResponse.json({ success: true, data: { jobId, bookmarked: true } }, { status: 200 })
  } catch (error) {
    logger.error("POST /api/mypage/saved-jobs 실패", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}
