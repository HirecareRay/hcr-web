import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

/**
 * @swagger
 * /api/mypage/saved-companies:
 *   get:
 *     summary: 관심 기업 목록
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 찜한 기업 목록
 *       500:
 *         description: 서버 오류
 *   post:
 *     summary: 기업 찜/취소 토글
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
 *               companyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 찜 상태 변경 성공
 *       500:
 *         description: 서버 오류
 */
export async function GET() {
  try {
    logger.api("GET", "/api/mypage/saved-companies")
    return NextResponse.json(
      {
        success: true,
        data: [
          {
            id: "4c6a2dc35bec6d932b68",
            name: "CJ ENM",
            category: "엔터테인먼트·커머스",
            openJobs: 3,
          },
        ],
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error("GET /api/mypage/saved-companies 실패", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { companyId } = await req.json()
    logger.api("POST", "/api/mypage/saved-companies", { companyId })
    return NextResponse.json({ success: true, data: { companyId, saved: true } }, { status: 200 })
  } catch (error) {
    logger.error("POST /api/mypage/saved-companies 실패", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}
