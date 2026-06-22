import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"

/**
 * @swagger
 * /api/mypage/interview/{interviewId}:
 *   get:
 *     summary: AI 면접 상세 조회
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 면접 상세 (질문별 답변·점수·피드백)
 *       404:
 *         description: 기록 없음
 *       500:
 *         description: 서버 오류
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ interviewId: string }> }
) {
  try {
    const { interviewId } = await params
    logger.api("GET", `/api/mypage/interview/${interviewId}`)

    const records: Record<string, object> = {
      "1": {
        id: "1",
        companyName: "CJ ENM",
        jobName: "Data Scientist",
        date: "2026.06.10",
        score: 82,
        overallFeedback:
          "논리적 답변 구성이 우수하나 구체적 수치 활용이 부족합니다. 실무 프로젝트 경험을 수치와 함께 제시하면 설득력이 높아집니다.",
        questions: [
          {
            question: "데이터 사이언티스트로서 가장 자신 있는 역량은 무엇인가요?",
            answer:
              "저는 머신러닝 모델 설계와 데이터 전처리에 강점이 있습니다. 이전 프로젝트에서 추천 알고리즘을 구축해 사용자 체류 시간을 개선한 경험이 있습니다.",
            feedback:
              "강점을 잘 어필했으나 구체적인 수치(몇 % 개선)가 빠져 있어 임팩트가 약합니다.",
            score: 78,
          },
          {
            question: "대용량 데이터를 처리할 때 어떤 방식으로 접근하나요?",
            answer:
              "Spark와 Pandas를 상황에 따라 선택하며, 메모리 효율을 위해 청크 단위 처리와 인덱싱을 활용합니다.",
            feedback: "기술 스택 선택 근거가 명확하고 논리적인 답변입니다.",
            score: 88,
          },
          {
            question: "협업 과정에서 데이터 분석 결과를 비전문가에게 어떻게 설명하나요?",
            answer:
              "시각화 도구(Tableau, Matplotlib)를 활용해 핵심 인사이트 위주로 요약하고, 전문 용어 대신 비즈니스 언어로 풀어 설명합니다.",
            feedback: "커뮤니케이션 역량이 잘 드러납니다. 실제 사례를 추가하면 더욱 좋습니다.",
            score: 80,
          },
        ],
      },
      "2": {
        id: "2",
        companyName: "CJ ENM",
        jobName: "Web/App Lead",
        date: "2026.06.03",
        score: 76,
        overallFeedback:
          "기술 역량은 충분하나 리더십 경험 어필이 아쉽습니다. 팀을 이끈 구체적인 사례와 성과를 준비하면 리드 포지션에 더 적합한 인상을 줄 수 있습니다.",
        questions: [
          {
            question: "리드 개발자로서 팀을 이끌었던 경험을 말씀해 주세요.",
            answer:
              "소규모 스타트업에서 프론트엔드 팀을 리드하며 코드 리뷰 문화를 도입하고 배포 자동화를 구축했습니다.",
            feedback: "경험은 있으나 팀 규모와 구체적 성과 수치가 부족합니다.",
            score: 70,
          },
          {
            question: "Web과 App 개발을 동시에 진행할 때 기술적 고려사항은?",
            answer:
              "React Native와 Next.js를 함께 사용하며 공통 컴포넌트 라이브러리를 구축해 재사용성을 높였습니다.",
            feedback: "실용적인 접근 방식으로 기술 이해도가 높습니다.",
            score: 84,
          },
        ],
      },
    }

    const record = records[interviewId]
    if (!record) {
      return NextResponse.json(
        { success: false, message: "면접 기록을 찾을 수 없어요." },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: record }, { status: 200 })
  } catch (error) {
    logger.error("GET /api/mypage/interview/[interviewId] 실패", error)
    return NextResponse.json({ success: false, message: "서버 오류" }, { status: 500 })
  }
}
