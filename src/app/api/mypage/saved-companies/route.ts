import { NextResponse } from "next/server"

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
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      {
        id: "4c6a2dc35bec6d932b68",
        name: "CJ ENM",
        category: "엔터테인먼트·커머스",
        openJobs: 3,
      },
    ],
  })
}

export async function POST(req: Request) {
  const { companyId } = await req.json()
  return NextResponse.json({ success: true, data: { companyId, saved: true } })
}
