import { NextResponse } from "next/server"

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: 채용공고 목록 조회
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 직무 카테고리 필터
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: 채용공고 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobListItem'
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      {
        id: "a63f1ca8292ecdd80c30",
        companyId: "4c6a2dc35bec6d932b68",
        companyName: "CJ ENM",
        title: "Data Scientist 채용",
        category: "데이터",
        location: "서울",
        employmentType: "정규직",
        deadline: "2026.07.03",
        status: "open",
        tags: ["데이터분석", "머신러닝", "Python"],
        bookmarked: false,
      },
      {
        id: "62945315cd3b3c07da52",
        companyId: "4c6a2dc35bec6d932b68",
        companyName: "CJ ENM",
        title: "[Mnet Plus] Web/App Lead 경력채용",
        category: "개발",
        location: "서울 마포구",
        employmentType: "정규직 (협의)",
        deadline: "상시채용",
        status: "rolling",
        tags: ["React", "Next.js", "리더십"],
        bookmarked: true,
      },
    ],
    pagination: { page: 1, limit: 20, total: 2 },
  })
}
