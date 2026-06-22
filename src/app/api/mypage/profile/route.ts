import { NextRequest, NextResponse } from "next/server"

/**
 * @swagger
 * /api/mypage/profile:
 *   get:
 *     summary: 내 프로필 조회
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 프로필 정보
 *   put:
 *     summary: 프로필 수정
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               companySize:
 *                 type: array
 *                 items:
 *                   type: string
 *               careerLevel:
 *                 type: array
 *                 items:
 *                   type: string
 *               interestJobs:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      id: "1",
      name: "김취준",
      email: "getajob@example.com",
      companySize: ["스타트업"],
      careerLevel: ["신입"],
      interestJobs: ["프론트엔드"],
      completionRate: 65,
    },
  })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({
    success: true,
    data: { ...body },
  })
}
