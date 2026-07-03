export type FieldType = "text" | "textarea" | "number" | "boolean"

export type FieldDef = {
  key: string
  label: string
  type?: FieldType
}

export type SectionDef = {
  key: string // formData 내 배열 키 (예: "school", "items")
  label: string
  fields: FieldDef[]
  itemDefaults?: Record<string, unknown> // 항목 추가 시 초기값
  hasItemEtc?: boolean // 항목마다 etc: {custom_key, custom_content} 존재
  strListKey?: string // 항목 내 List[str] 필드 키 (예: "responsibilities")
  strListLabel?: string
  subKey?: string // 항목 내 중첩 배열 키 (예: "projects")
  subLabel?: string
  subFields?: FieldDef[]
  subHasItemEtc?: boolean
}

export type DocConfig = { sections: SectionDef[] }

const PROJECT_FIELDS: FieldDef[] = [
  { key: "name", label: "프로젝트명" },
  { key: "role", label: "역할" },
  { key: "start_date", label: "시작일" },
  { key: "end_date", label: "종료일" },
  { key: "members", label: "팀원 수", type: "number" },
  { key: "tools_skills", label: "기술스택" },
  { key: "description", label: "설명", type: "textarea" },
  { key: "content", label: "내용", type: "textarea" },
  { key: "result", label: "결과", type: "textarea" },
]

export const DOC_SCHEMAS: Record<string, DocConfig> = {
  resume: {
    sections: [
      {
        key: "school",
        label: "학력",
        fields: [
          { key: "name", label: "학교명" },
          { key: "major", label: "전공" },
          { key: "start_date", label: "입학일" },
          { key: "end_date", label: "졸업일" },
          { key: "graduate", label: "졸업구분" },
          { key: "score", label: "학점" },
          { key: "location", label: "소재지" },
        ],
      },
      {
        key: "career",
        label: "경력",
        fields: [
          { key: "name", label: "회사명" },
          { key: "department", label: "부서" },
          { key: "position", label: "직책" },
          { key: "responsibilities", label: "담당업무", type: "textarea" },
          { key: "leaving_reason", label: "퇴직사유" },
          { key: "start_date", label: "입사일" },
          { key: "end_date", label: "퇴사일" },
        ],
      },
      {
        key: "certifications",
        label: "자격증",
        fields: [
          { key: "name", label: "자격증명" },
          { key: "organization", label: "발급기관" },
          { key: "date", label: "취득일" },
        ],
      },
      {
        key: "awards",
        label: "수상",
        fields: [
          { key: "name", label: "수상명" },
          { key: "organization", label: "수여기관" },
          { key: "date", label: "수상일" },
          { key: "description", label: "내용", type: "textarea" },
        ],
      },
      {
        key: "education",
        label: "교육",
        fields: [
          { key: "name", label: "교육명" },
          { key: "organization", label: "기관" },
          { key: "start_date", label: "시작일" },
          { key: "end_date", label: "종료일" },
          { key: "description", label: "내용", type: "textarea" },
        ],
      },
      {
        key: "tools_skills",
        label: "기술/도구",
        fields: [
          { key: "name", label: "기술명" },
          { key: "proficiency", label: "숙련도" },
        ],
      },
    ],
  },

  cover_letter: {
    sections: [
      {
        key: "items",
        label: "문항",
        fields: [
          { key: "category", label: "카테고리" },
          { key: "title", label: "제목" },
          { key: "content", label: "내용", type: "textarea" },
        ],
      },
    ],
  },

  portfolio: {
    sections: [
      {
        key: "portfolio",
        label: "프로젝트",
        fields: PROJECT_FIELDS,
        hasItemEtc: true,
        itemDefaults: { members: null, etc: [] },
      },
    ],
  },

  work_experience: {
    sections: [
      {
        key: "work_experience",
        label: "경력",
        fields: [
          { key: "company_name", label: "회사명" },
          { key: "department", label: "부서" },
          { key: "position", label: "직책" },
          { key: "start_date", label: "입사일" },
          { key: "end_date", label: "퇴사일" },
          { key: "is_current_job", label: "재직 중", type: "boolean" },
          { key: "reason_for_leaving", label: "퇴직사유" },
        ],
        hasItemEtc: true,
        itemDefaults: { is_current_job: false, responsibilities: [], projects: [], etc: [] },
        strListKey: "responsibilities",
        strListLabel: "담당업무 (줄바꿈으로 구분)",
        subKey: "projects",
        subLabel: "수행 프로젝트",
        subFields: PROJECT_FIELDS,
        subHasItemEtc: true,
      },
    ],
  },
}
