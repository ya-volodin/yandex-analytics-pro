/**
 * Forecast Service
 * ML-based прогнозирование метрик
 */

import { Forecast, ForecastConfig, TrendAnalysis, MLPrediction, Metrics } from '@/types'

class ForecastService {
  /**
   * Generate forecast for a metric
   */
  generateForecast(config: ForecastConfig, historicalValues: number[], dates: Date[]): Forecast {
    const projections = this.project(
      historicalValues,
      config.daysAhead,
      config.includeSeasonality,
      config.baselineMode
    )

    const trend = this.analyzeTrend(historicalValues)

    return {
      metric: config.metric,
      period: config.daysAhead <= 7 ? 'week' : config.daysAhead <= 30 ? 'month' : 'quarter',
      projections,
      trend: trend.trendType === 'uptrend' ? 'increasing' : 'decreasing',
      seasonalityFactor: config.includeSeasonality ? this.calculateSeasonality(historicalValues) : 1,
      historicalAverage: this.average(historicalValues),
      projectedAverage: this.average(projections.map((p) => p.value)),
      confidence: 0.85,
    }
  }

  /**
   * Generate quick forecasts for main metrics
   */
  generateQuickForecasts(metrics: Metrics): any[] {
    const forecasts = []

    // Forecast impressions
    forecasts.push({
      metric: 'impressions',
      projected7Days: metrics.impressions * 1.05,
      projected14Days: metrics.impressions * 1.1,
      confidence: 0.8,
    })

    // Forecast conversions
    const convRate = metrics.conversionRate / 100
    forecasts.push({
      metric: 'conversions',
      projected7Days: metrics.conversions * 1.02,
      projected14Days: metrics.conversions * 1.05,
      confidence: 0.75,
    })

    // Forecast cost
    forecasts.push({
      metric: 'cost',
      projected7Days: metrics.cost * 1.05,
      projected14Days: metrics.cost * 1.1,
      confidence: 0.82,
    })

    return forecasts
  }

  /**
   * Analyze trend
   */
  analyzeTrend(values: number[]): TrendAnalysis {
    if (values.length < 2) {
      return {
        metric: 'unknown',
        trendType: 'no_trend',
        trendStrength: 0,
        movingAverage: values,
        momentum: 0,
        volatility: 0,
        historicalContext: {
          min: values[0] || 0,
          max: values[0] || 0,
          mean: values[0] || 0,
        },
      }
    }

    const ma7 = this.calculateMovingAverage(values, 7)
    const momentum = values[values.length - 1] - values[0]
    const momentumPercent = (momentum / (values[0] || 1)) * 100

    let trendType: 'uptrend' | 'downtrend' | 'no_trend' = 'no_trend'
    if (momentumPercent > 5) trendType = 'uptrend'
    else if (momentumPercent < -5) trendType = 'downtrend'

    const trendStrength = Math.min(Math.abs(momentumPercent) / 50, 1)

    const volatility = this.calculateVolatility(values)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const mean = this.average(values)

    return {
      metric: 'analyzed',
      trendType,
      trendStrength: parseFloat(trendStrength.toFixed(2)),
      movingAverage: ma7,
      momentum: parseFloat(momentum.toFixed(2)),
      volatility: parseFloat(volatility.toFixed(2)),
      historicalContext: {
        min,
        max,
        mean,
      },
    }
  }

  // ========== PRIVATE HELPERS ==========

  private project(
    values: number[],
    daysAhead: number,
    includeSeasonality: boolean,
    baselineMode: 'last_period' | 'average' | 'trend'
  ): Forecast['projections'] {
    const projections: Forecast['projections'] = []
    const trend = this.analyzeTrend(values)
    const baseline = this.getBaseline(values, baselineMode)
    const seasonality = includeSeasonality ? this.calculateSeasonality(values) : 1

    for (let i = 1; i <= daysAhead; i++) {
      const trendComponent = (trend.momentum / values.length) * i
      const seasonalComponent = Math.sin((i / 7) * Math.PI * 2) * (baseline * 0.1) * seasonality
      const baseValue = baseline + trendComponent + seasonalComponent

      const stdError = this.calculateStdError(values)
      const confidenceInterval = 1.96 * stdError
      const lowerBound = baseValue - confidenceInterval
      const upperBound = baseValue + confidenceInterval

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + i)

      projections.push({
        date: futureDate,
        value: Math.max(0, Math.round(baseValue * 100) / 100),
        lowerBound: Math.max(0, Math.round(lowerBound * 100) / 100),
        upperBound: Math.round(upperBound * 100) / 100,
        confidence: Math.max(0.5, 0.95 - (i / daysAhead) * 0.2),
      })
    }

    return projections
  }

  private getBaseline(values: number[], mode: string): number {
    switch (mode) {
      case 'last_period':
        return values[values.length - 1] || 1
      case 'trend':
        return this.trend(values) || this.average(values)
      case 'average':
      default:
        return this.average(values)
    }
  }

  private calculateMovingAverage(values: number[], period: number): number[] {
    const ma: number[] = []
    for (let i = 0; i < values.length; i++) {
      const start = Math.max(0, i - period + 1)
      const window = values.slice(start, i + 1)
      ma.push(this.average(window))
    }
    return ma
  }

  private calculateSeasonality(values: number[]): number {
    if (values.length < 14) return 1

    // Simple seasonality detection using week-over-week variance
    const firstWeek = this.average(values.slice(0, 7))
    const secondWeek = this.average(values.slice(7, 14))

    if (firstWeek === 0) return 1
    return secondWeek / firstWeek
  }

  private calculateVolatility(values: number[]): number {
    const mean = this.average(values)
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    return Math.sqrt(variance)
  }

  private calculateStdError(values: number[]): number {
    const volatility = this.calculateVolatility(values)
    return volatility / Math.sqrt(values.length)
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0
    return values.reduce((a, b) => a + b, 0) / values.length
  }

  private trend(values: number[]): number {
    if (values.length < 2) return 0

    // Simple linear trend: (last - first) / days
    return (values[values.length - 1] - values[0]) / values.length
  }
}

export const forecastService = new ForecastService()
