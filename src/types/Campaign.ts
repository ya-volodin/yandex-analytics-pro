import { Metrics } from './Metrics'

export type CampaignStatus = 'active' | 'paused' | 'ended' | 'archived'

export interface Campaign {
  id: string
  name: string
  status: CampaignStatus
  type: 'search' | 'display' | 'video' | 'shopping'
  budget: number
  budgetType: 'daily' | 'total'
  startDate: Date
  endDate?: Date
  metrics: Metrics
  createdAt: Date
  updatedAt: Date
  
  // Additional fields
  deviceTargeting?: {
    desktop: boolean
    mobile: boolean
    tablet: boolean
  }
  geoTargeting?: string[]
  timezone?: string
  defaultBid?: number
  
  // Hierarchical
  adGroups?: AdGroup[]
}

export interface AdGroup {
  id: string
  campaignId: string
  name: string
  status: CampaignStatus
  defaultBid: number
  metrics: Metrics
  
  ads?: Ad[]
  keywords?: Keyword[]
}

export interface Ad {
  id: string
  adGroupId: string
  campaignId: string
  headline: string
  description: string
  finalUrl: string
  displayUrl?: string
  status: CampaignStatus
  type: 'text' | 'display' | 'video' | 'responsive'
  
  metrics: Metrics
  createdAt: Date
  updatedAt: Date
  
  // A/B test info
  testVariant?: string
  originalAdId?: string
}

export interface Keyword {
  id: string
  adGroupId: string
  campaignId: string
  text: string
  matchType: 'exact' | 'phrase' | 'broad' | 'broad_modified'
  bid: number
  status: CampaignStatus
  
  metrics: Metrics
  qualityScore: number
  createdAt: Date
  updatedAt: Date
  
  // Recommendations
  recommendedBid?: number
  recommendation?: string
}

export interface SearchTerm {
  text: string
  matchType: string
  impressions: number
  clicks: number
  conversions: number
  cost: number
  conversionValue: number
}
