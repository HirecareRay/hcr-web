import { z } from "zod"

export const ParsedPdfSchema = z.object({
  title: z.string(),
  pages: z.number(),
  content: z.string(),
  tables: z
    .array(
      z.object({
        headers: z.array(z.string()),
        rows: z.array(z.array(z.string())),
      })
    )
    .optional(),
})

export type ParsedPdf = z.infer<typeof ParsedPdfSchema>
