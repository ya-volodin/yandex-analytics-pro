import { Metrics } from './Metrics'

export interface KeywordAnalysis {
  keywordId: string
  text: string
  matchType: 'exact' | 'phrase' | 'broad'
  
  metrics: Metrics
  qualityScore: number
  
  // Bidding
  currentBid: number
  recommendedBid?: number
  bidChange?: number
  
  // Search terms
  searchTerms?: {
    term: string
    count: number
    metrics: Metrics
  }[]
  
  // Recommendations
  recommendation?: 'increase_bid' | 'decrease_bid' | 'pause' | 'good_performance' | 'low_quality_score'
  reason?: string
  
  negativeKeywordSuggestions?: string[]
}

export interface KeywordPerformanceMatrix {
  keywords: KeywordAnalysis[]
  sorting: 'ctr' | 'conversions' | 'cpc' | 'quality_score'
  topPerformers: KeywordAnalysis[]
  underperformers: KeywordAnalysis[]
}
