import { create } from "zustand"
import { UploadItem, UploadType } from "../types/upload"

interface UploadState {
  items: UploadItem[]
  setFile: (type: UploadType, file: File) => void
  setExists: (type: UploadType, exists: boolean) => void
}

export const useUploadStore = create<UploadState>((set) => ({
  items: [
    {
      id: "resume",
      title: "이력서",
      description: "학력·경력을 정리한 기본 이력서",
      required: false,
      file: null,
    },
    {
      id: "coverLetter",
      title: "자기소개서",
      description: "지원 동기와 강점을 담은 글",
      required: false,
      file: null,
    },
    {
      id: "portfolio",
      title: "포트폴리오",
      description: "작업물·프로젝트 결과물",
      required: false,
      file: null,
    },
    {
      id: "workExperience",
      title: "경력기술서",
      description: "담당 업무와 성과 정리",
      required: false,
      file: null,
    },
  ],

  setFile: (type, file) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === type ? { ...item, file } : item)),
    })),

  setExists: (type, exists) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === type ? { ...item, exists } : item)),
    })),
}))
