/**
 * Anomaly Detection Service
 * Выявление аномалий в данных
 */

import { AnomalyDetection, Alert, AlertSeverity } from '@/types'
import { metricsService } from './metrics.service'

class AnomalyDetectionService {
  /**
   * Detect anomalies in metric values
   */
  detectMetricAnomalies(values: number[], threshold: number = 2): AnomalyDetection {
    const result = metricsService.detectAnomaly(values, threshold)

    return {
      metricName: 'analyzed',
      anomalyScore: result.score,
      isAnomaly: result.isAnomaly,
      expectedRange: result.expectedRange,
      actualValue: values[values.length - 1],
      explanation: this.explainAnomaly(result.isAnomaly, result.score, values),
    }
  }

  /**
   * Generate alerts from anomalies
   */
  generateAlerts(anomalies: AnomalyDetection[], context: any = {}): Alert[] {
    const alerts: Alert[] = []

    anomalies.forEach((anomaly) => {
      if (anomaly.isAnomaly) {
        const severity = this.determineSeverity(anomaly.anomalyScore)
        const alert = this.createAlert(anomaly, severity, context)
        alerts.push(alert)
      }
    })

    return alerts
  }

  /**
   * Detect performance degradation
   */
  detectPerformanceDegradation(
    currentMetrics: any,
    historicalMetrics: any[]
  ): { isDegraded: boolean; metrics: string[]; severity: AlertSeverity } {
    const degradedMetrics: string[] = []
    const threshold = 15 // % change threshold

    Object.keys(currentMetrics).forEach((key) => {
      const current = currentMetrics[key]
      if (typeof current === 'number' && historicalMetrics.length > 0) {
        const avg =
          historicalMetrics.reduce((sum, m) => sum + (m[key] || 0), 0) / historicalMetrics.length

        const changePercent = avg ? ((current - avg) / avg) * 100 : 0

        // Check if negative change exceeds threshold
        if (changePercent < -threshold) {
          degradedMetrics.push(key)
        }
      }
    })

    const isDegraded = degradedMetrics.length > 0
    const severity = this.determineSeverityByCount(degradedMetrics.length)

    return {
      isDegraded,
      metrics: degradedMetrics,
      severity,
    }
  }

  /**
   * Detect budget issues
   */
  detectBudgetIssues(spent: number, budget: number, daysLeft: number): Alert | null {
    const utilizationRate = (spent / budget) * 100

    // If more than 90% spent and less than 3 days left
    if (utilizationRate > 90 && daysLeft <= 3) {
      return {
        id: `budget_warning_${Date.now()}`,
        type: 'budget_warning',
        severity: 'warning',
        title: 'Бюджет заканчивается',
        message: `Использовано ${utilizationRate.toFixed(1)}% бюджета. Осталось ${daysLeft} дней`,
        details: {
          currentValue: spent,
          previousValue: budget,
          changePercent: utilizationRate,
        },
        timestamp: new Date(),
        read: false,
        acknowledged: false,
      }
    }

    return null
  }

  /**
   * Detect quality score drops
   */
  detectQualityScoreDrop(
    currentScore: number,
    historicalScores: number[],
    threshold: number = 2
  ): boolean {
    if (historicalScores.length === 0) return false

    const avgScore = historicalScores.reduce((a, b) => a + b, 0) / historicalScores.length
    return currentScore < avgScore - threshold
  }

  /**
   * Detect CTR anomalies
   */
  detectCTRAnomaly(
    currentCTR: number,
    historicalCTRs: number[],
    dropThreshold: number = 20
  ): boolean {
    if (historicalCTRs.length === 0) return false

    const avgCTR = historicalCTRs.reduce((a, b) => a + b, 0) / historicalCTRs.length
    const changePercent = ((currentCTR - avgCTR) / avgCTR) * 100

    return changePercent < -dropThreshold
  }

  // ========== PRIVATE HELPERS ==========

  private explainAnomaly(isAnomaly: boolean, score: number, values: number[]): string {
    if (!isAnomaly) {
      return 'No anomaly detected - metric is within normal range'
    }

    const lastValue = values[values.length - 1]
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length
    const deviation = ((lastValue - avgValue) / avgValue) * 100

    if (Math.abs(deviation) > 100) {
      return `Критическое отклонение: значение отличается на ${Math.abs(deviation).toFixed(0)}% от среднего`
    } else if (Math.abs(deviation) > 50) {
      return `Значительное отклонение: значение отличается на ${Math.abs(deviation).toFixed(0)}% от среднего`
    } else {
      return `Умеренное отклонение: значение отличается на ${Math.abs(deviation).toFixed(0)}% от среднего`
    }
  }

  private determineSeverity(anomalyScore: number): AlertSeverity {
    if (anomalyScore > 0.8) return 'critical'
    if (anomalyScore > 0.5) return 'warning'
    return 'info'
  }

  private determineSeverityByCount(count: number): AlertSeverity {
    if (count >= 5) return 'critical'
    if (count >= 3) return 'warning'
    return 'info'
  }

  private createAlert(anomaly: AnomalyDetection, severity: AlertSeverity, context: any): Alert {
    return {
      id: `anomaly_${Date.now()}`,
      type: 'anomaly_detected',
      severity,
      title: `Аномалия в ${anomaly.metricName}`,
      message: anomaly.explanation,
      details: {
        metric: anomaly.metricName,
        currentValue: anomaly.actualValue,
        expectedRange: anomaly.expectedRange,
      },
      timestamp: new Date(),
      read: false,
      acknowledged: false,
      campaignId: context.campaignId,
      adGroupId: context.adGroupId,
    }
  }
}

export const anomalyDetectionService = new AnomalyDetectionService()
