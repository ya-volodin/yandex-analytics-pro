export interface Forecast {
  metric: string
  period: 'week' | 'month' | 'quarter'
  
  projections: {
    date: Date
    value: number
    lowerBound: number // 95% CI
    upperBound: number // 95% CI
    confidence: number
  }[]
  
  trend: 'increasing' | 'decreasing' | 'stable'
  seasonalityFactor?: number
  
  historicalAverage?: number
  projectedAverage?: number
  confidence: number
}

export interface ForecastConfig {
  metric: string
  daysAhead: number // 7, 14, 30
  includeSeasonality: boolean
  includeConfidenceInterval: boolean
  baselineMode: 'last_period' | 'average' | 'trend'
}

export interface TrendAnalysis {
  metric: string
  trendType: 'uptrend' | 'downtrend' | 'no_trend'
  trendStrength: number // 0-1
  movingAverage: number[]
  momentum: number // rate of change
  volatility: number // standard deviation
  
  historicalContext: {
    min: number
    max: number
    mean: number
  }
}

export interface MLPrediction {
  metric: string
  predictedValue: number
  confidence: number
  factors: {
    factor: string
    contribution: number // %
  }[]
  modelType: 'linear_regression' | 'arima' | 'prophet'
}
