"use client"

import { useUploadFiles } from "../hooks/useUpload"
import UploadStepCard from "./UploadStepCard"

export default function UploadList() {
  const { items, upload } = useUploadFiles()

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <UploadStepCard key={item.id} item={item} onUpload={(file) => upload(item.id, file)} />
      ))}
    </div>
  )
}
