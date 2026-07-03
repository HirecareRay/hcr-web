"use client"

import { useUploadFiles } from "../hooks/useUpload"
import UploadStepCard from "./UploadStepCard"

export default function UploadList() {
  const { items, upload } = useUploadFiles()
  const anyUploading = items.some((item) => item.uploading)

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <UploadStepCard
          key={item.id}
          item={item}
          onUpload={(file) => upload(item.id, file)}
          disabled={anyUploading && !item.uploading}
        />
      ))}
    </div>
  )
}
