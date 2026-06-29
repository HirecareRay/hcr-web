import { create } from "zustand"
import { UploadItem, UploadType } from "../types/upload"

interface UploadState {
  items: UploadItem[]
  setFile: (type: UploadType, file: File) => void
}

export const useUploadStore = create<UploadState>((set) => ({
  items: [
    {
      id: "resume",
      title: "이력서",
      description: "PDF",
      required: false,
      file: null,
    },
    {
      id: "coverLetter",
      title: "자기소개서",
      description: "PDF",
      required: false,
      file: null,
    },
    {
      id: "portfolio",
      title: "포트폴리오",
      description: "PDF",
      required: false,
      file: null,
    },
    {
      id: "workExperience",
      title: "경력기술서",
      description: "PDF",
      required: false,
      file: null,
    },
  ],

  setFile: (type, file) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === type ? { ...item, file } : item)),
    })),
}))
