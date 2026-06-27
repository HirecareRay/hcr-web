// "use client"

// import { useEffect, useState } from "react"

// export default function DocumentDetailPage() {
//   const [docKey, setDocKey] = useState<string | null>(null)

//   useEffect(() => {
//     // 세션에서 노출되지 않았던 진짜 식별 Key 값을 꺼냅니다.
//     const savedKey = sessionStorage.getItem("current_document_key")
//     if (savedKey) {
//       setDocKey(savedKey)
//       // fetchDocumentData(savedKey) <- 이 키값으로 API 단일 조회 요청 진행
//     }
//   }, [])

//   // ...
// }
// // 예시 코드
