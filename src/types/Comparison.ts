import { Metrics } from './Metrics'

export interface PeriodComparison {
  currentPeriod: {
    startDate: Date
    endDate: Date
    metrics: Metrics
  }
  previousPeriod: {
    startDate: Date
    endDate: Date
    metrics: Metrics
  }
  
  changes: {
    metric: keyof Metrics
    previous: number
    current: number
    change: number
    changePercent: number
    trend: 'up' | 'down' | 'stable'
  }[]
  
  forecast?: {
    metric: keyof Metrics
    projected7Days: number
    projected14Days: number
    confidence: number
  }[]
  
  recommendations: string[]
  anomalies: string[]
}

export interface CampaignComparison {
  campaigns: {
    campaignId: string
    campaignName: string
    metrics: Metrics
  }[]
  
  rankings: {
    metric: keyof Metrics
    order: Array<{ campaignId: string; value: number }>
  }[]
  
  anomalies: Array<{
    campaignId: string
    message: string
    severity: 'info' | 'warning' | 'critical'
  }>
  
  recommendations: Array<{
    campaignId: string
    action: string
    expectedImpact: string
  }>
}

export interface SegmentedComparison {
  segment: 'device' | 'dayOfWeek' | 'hour' | 'geography'
  data: {
    label: string
    metrics: Metrics
  }[]
  topPerformer: string
  topPerformerMetric: number
}
