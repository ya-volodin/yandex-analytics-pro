export type AlertSeverity = 'info' | 'warning' | 'critical'
export type AlertType =
  | 'ctr_drop'
  | 'cost_spike'
  | 'quality_score_drop'
  | 'budget_warning'
  | 'low_performance'
  | 'anomaly_detected'
  | 'recommendation'

export interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  details?: {
    metric?: string
    currentValue?: number
    previousValue?: number
    changePercent?: number
    affectedItems?: string[]
  }
  
  timestamp: Date
  read: boolean
  acknowledged: boolean
  
  // Action
  actionUrl?: string
  actionLabel?: string
  
  campaignId?: string
  adGroupId?: string
  keywordId?: string
  adId?: string
}

export interface AlertConfig {
  ctrDropThreshold: number // %
  costSpikeThreshold: number // %
  qualityScoreDropThreshold: number
  budgetWarningDaysLeft: number
  performanceDegradationThreshold: number // %
  
  emailNotification: boolean
  slackNotification: boolean
  inAppNotification: boolean
}

export interface AnomalyDetection {
  metricName: string
  anomalyScore: number // 0-1
  isAnomaly: boolean
  expectedRange: [number, number]
  actualValue: number
  explanation: string
}
