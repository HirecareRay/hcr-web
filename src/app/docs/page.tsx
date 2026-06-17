import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { getApiDocs } from "@/lib/swagger"

export default async function DocsPage() {
  const spec = await getApiDocs()

  return <SwaggerUI spec={spec} />
}
