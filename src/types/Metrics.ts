export interface Metrics {
  // Basic
  impressions: number
  clicks: number
  ctr: number // Click-Through Rate %
  cpc: number // Cost Per Click
  cpm: number // Cost Per Mille (1000 impressions)
  
  // Conversions
  conversions: number
  conversionRate: number // %
  conversionValue: number
  cpa: number // Cost Per Acquisition
  roas: number // Return On Ad Spend
  
  // Quality
  qualityScore: number // 1-10
  avgPosition: number
  
  // Share metrics
  impressionShare: number // %
  clickShare: number // %
  
  // Budget
  cost: number
  budgetSpent: number
  budgetRemaining: number
  budgetUtilization: number // %
  
  // Additional
  effectiveCPM: number
  bounceRate: number
  avgSessionDuration: number
  
  // Engagement
  engagementRate: number
  viewThroughRate: number
}

export interface MetricsSnapshot {
  timestamp: Date
  metrics: Metrics
  period: 'day' | 'week' | 'month'
}

export interface MetricsTrend {
  metric: keyof Metrics
  values: number[]
  dates: Date[]
  trend: 'up' | 'down' | 'stable'
  changePercent: number
}

export type MetricComparison = {
  metricName: keyof Metrics
  current: number
  previous: number
  change: number
  changePercent: number
  isPositive: boolean
}
