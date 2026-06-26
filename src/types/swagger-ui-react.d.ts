/**
 * swagger-ui-react 타입 선언.
 *
 * 이 패키지는 공식 타입(@types)을 제공하지 않아 import 시 implicit any 로 빌드가 막힙니다.
 * /docs(Swagger) 페이지에서 쓰는 최소 형태만 선언해 타입 검사를 통과시킵니다.
 */
declare module "swagger-ui-react" {
  import type { ComponentType } from "react"

  interface SwaggerUIProps {
    spec?: object
    url?: string
    [key: string]: unknown
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>
  export default SwaggerUI
}

declare module "swagger-ui-react/swagger-ui.css"
