/**
 * Metrics Service
 * Расчёт всех метрик
 */

import { Metrics, MetricsTrend, MetricComparison } from '@/types'

class MetricsService {
  /**
   * Calculate all metrics from raw data
   */
  calculateMetrics(rawData: any): Metrics {
    const impressions = rawData.impressions || 0
    const clicks = rawData.clicks || 0
    const cost = rawData.cost || 0
    const conversions = rawData.conversions || 0
    const conversionValue = rawData.conversionValue || 0

    return {
      impressions,
      clicks,
      ctr: this.calculateCTR(clicks, impressions),
      cpc: this.calculateCPC(cost, clicks),
      cpm: this.calculateCPM(cost, impressions),
      conversions,
      conversionRate: this.calculateConversionRate(conversions, clicks),
      conversionValue,
      cpa: this.calculateCPA(cost, conversions),
      roas: this.calculateROAS(conversionValue, cost),
      qualityScore: rawData.qualityScore || 0,
      avgPosition: rawData.avgPosition || 0,
      impressionShare: rawData.impressionShare || 0,
      clickShare: rawData.clickShare || 0,
      cost,
      budgetSpent: cost,
      budgetRemaining: (rawData.budget || 0) - cost,
      budgetUtilization: this.calculateBudgetUtilization(cost, rawData.budget),
      effectiveCPM: this.calculateEffectiveCPM(conversionValue, impressions),
      bounceRate: rawData.bounceRate || 0,
      avgSessionDuration: rawData.avgSessionDuration || 0,
      engagementRate: rawData.engagementRate || 0,
      viewThroughRate: rawData.viewThroughRate || 0,
    }
  }

  /**
   * Calculate metric trend
   */
  calculateTrend(
    metric: keyof Metrics,
    historicalValues: number[],
    dates: Date[]
  ): MetricsTrend {
    if (historicalValues.length < 2) {
      return {
        metric,
        values: historicalValues,
        dates,
        trend: 'stable',
        changePercent: 0,
      }
    }

    const firstValue = historicalValues[0]
    const lastValue = historicalValues[historicalValues.length - 1]
    const changePercent = ((lastValue - firstValue) / (firstValue || 1)) * 100

    let trend: 'up' | 'down' | 'stable' = 'stable'
    if (changePercent > 5) trend = 'up'
    else if (changePercent < -5) trend = 'down'

    return {
      metric,
      values: historicalValues,
      dates,
      trend,
      changePercent: parseFloat(changePercent.toFixed(2)),
    }
  }

  /**
   * Compare two metric sets
   */
  compareMetrics(current: Metrics, previous: Metrics): MetricComparison[] {
    const comparisons: MetricComparison[] = []
    const metricKeys = Object.keys(current) as (keyof Metrics)[]

    for (const key of metricKeys) {
      const currentVal = current[key] as number
      const prevVal = previous[key] as number

      if (typeof currentVal === 'number' && typeof prevVal === 'number') {
        const change = currentVal - prevVal
        const changePercent = prevVal ? ((change / prevVal) * 100) : 0
        const isPositive = this.isPositiveMetricChange(key, change)

        comparisons.push({
          metricName: key,
          current: currentVal,
          previous: prevVal,
          change,
          changePercent: parseFloat(changePercent.toFixed(2)),
          isPositive,
        })
      }
    }

    return comparisons
  }

  /**
   * Detect anomalies in metric
   */
  detectAnomaly(
    values: number[],
    threshold: number = 2 // standard deviations
  ): { isAnomaly: boolean; score: number; expectedRange: [number, number] } {
    if (values.length < 3) {
      return {
        isAnomaly: false,
        score: 0,
        expectedRange: [Math.min(...values), Math.max(...values)],
      }
    }

    const mean = values.reduce((a, b) => a + b) / values.length
    const variance =
      values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)

    const lastValue = values[values.length - 1]
    const zScore = Math.abs((lastValue - mean) / (stdDev || 1))
    const isAnomaly = zScore > threshold

    return {
      isAnomaly,
      score: Math.min(zScore / threshold, 1),
      expectedRange: [mean - threshold * stdDev, mean + threshold * stdDev],
    }
  }

  // ========== PRIVATE HELPERS ==========

  private calculateCTR(clicks: number, impressions: number): number {
    return impressions > 0 ? (clicks / impressions) * 100 : 0
  }

  private calculateCPC(cost: number, clicks: number): number {
    return clicks > 0 ? cost / clicks : 0
  }

  private calculateCPM(cost: number, impressions: number): number {
    return impressions > 0 ? (cost / impressions) * 1000 : 0
  }

  private calculateConversionRate(conversions: number, clicks: number): number {
    return clicks > 0 ? (conversions / clicks) * 100 : 0
  }

  private calculateCPA(cost: number, conversions: number): number {
    return conversions > 0 ? cost / conversions : 0
  }

  private calculateROAS(conversionValue: number, cost: number): number {
    return cost > 0 ? conversionValue / cost : 0
  }

  private calculateBudgetUtilization(spent: number, budget: number): number {
    return budget > 0 ? (spent / budget) * 100 : 0
  }

  private calculateEffectiveCPM(conversionValue: number, impressions: number): number {
    return impressions > 0 ? (conversionValue / impressions) * 1000 : 0
  }

  private isPositiveMetricChange(metric: keyof Metrics, change: number): boolean {
    // Metrics where increase is positive
    const positiveMetrics: (keyof Metrics)[] = [
      'impressions',
      'clicks',
      'conversions',
      'conversionValue',
      'conversionRate',
      'ctr',
      'roas',
      'impressionShare',
      'clickShare',
      'avgSessionDuration',
      'engagementRate',
      'viewThroughRate',
    ]

    if (positiveMetrics.includes(metric)) {
      return change > 0
    } else {
      return change < 0
    }
  }
}

export const metricsService = new MetricsService()
