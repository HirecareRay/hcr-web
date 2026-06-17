import { createSwaggerSpec } from "next-swagger-doc"

export const getApiDocs = async () => {
  return createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "My API",
        version: "1.0.0",
      },
    },
  })
}
