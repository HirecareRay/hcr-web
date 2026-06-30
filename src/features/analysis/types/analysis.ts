export type DimensionEval = {
  label: string
  summary: string
  isStrength: boolean
}

export type FitAnalysis = {
  overallSummary: string
  strengths: string[]
  gaps: string[]
  recommendations: string[]
  dimensions: DimensionEval[]
}
