import { Metrics } from './Metrics'

export interface AdPerformance {
  adId: string
  campaignId: string
  adGroupId: string
  headline: string
  description: string
  
  metrics: Metrics
  
  // A/B Testing
  testVariant: 'control' | 'variant' | 'challenger'
  pValue?: number // Statistical significance
  winner?: boolean
  confidence?: number // %
  
  // Analysis
  copyAnalysis?: {
    headlineLength: number
    descriptionLength: number
    keywordDensity: number
    emotionalWords: number
  }
  
  creativePerformance?: {
    imageUrl?: string
    videoUrl?: string
    rating?: number
  }
}

export interface AdComparison {
  ads: AdPerformance[]
  bestPerformer: string
  worstPerformer: string
  winnerBy: string
  recommendations: string[]
}
