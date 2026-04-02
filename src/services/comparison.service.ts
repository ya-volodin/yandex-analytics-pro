/**
 * Comparison Service
 * Сравнение периодов и кампаний
 */

import {
  PeriodComparison,
  CampaignComparison,
  SegmentedComparison,
  Campaign,
  Metrics,
  Forecast,
} from '@/types'
import { metricsService } from './metrics.service'
import { forecastService } from './forecast.service'

class ComparisonService {
  /**
   * Compare two periods
   */
  comparePeriods(
    currentMetrics: Metrics,
    currentStart: Date,
    currentEnd: Date,
    previousMetrics: Metrics,
    previousStart: Date,
    previousEnd: Date
  ): PeriodComparison {
    const changes = metricsService.compareMetrics(currentMetrics, previousMetrics)

    // Generate recommendations
    const recommendations = this.generateRecommendations(changes, currentMetrics)

    // Detect anomalies
    const anomalies = this.detectAnomalies(changes)

    // Generate forecasts
    const forecasts = forecastService.generateQuickForecasts(currentMetrics)

    return {
      currentPeriod: {
        startDate: currentStart,
        endDate: currentEnd,
        metrics: currentMetrics,
      },
      previousPeriod: {
        startDate: previousStart,
        endDate: previousEnd,
        metrics: previousMetrics,
      },
      changes,
      forecast: forecasts,
      recommendations,
      anomalies,
    }
  }

  /**
   * Compare campaigns
   */
  compareCampaigns(campaigns: Campaign[]): CampaignComparison {
    const metricsToCompare: (keyof Metrics)[] = [
      'ctr',
      'roas',
      'cost',
      'conversions',
      'cpc',
      'conversionRate',
    ]

    const campaignData = campaigns.map((c) => ({
      campaignId: c.id,
      campaignName: c.name,
      metrics: c.metrics,
    }))

    // Generate rankings for each metric
    const rankings = metricsToCompare.map((metric) => ({
      metric,
      order: campaignData
        .map((c) => ({
          campaignId: c.campaignId,
          value: c.metrics[metric] as number,
        }))
        .sort((a, b) => b.value - a.value),
    }))

    // Detect anomalies
    const anomalies = this.detectCampaignAnomalies(campaigns)

    // Generate recommendations
    const recommendations = campaigns.map((c) => ({
      campaignId: c.id,
      action: this.recommendAction(c),
      expectedImpact: this.estimateImpact(c),
    }))

    return {
      campaigns: campaignData,
      rankings,
      anomalies,
      recommendations,
    }
  }

  /**
   * Segment comparison by device, day of week, hour, etc.
   */
  segmentComparison(
    data: any[],
    segmentBy: 'device' | 'dayOfWeek' | 'hour' | 'geography'
  ): SegmentedComparison {
    const segmentMap = new Map<string, Metrics[]>()

    // Group by segment
    data.forEach((item) => {
      const label = this.extractSegmentLabel(item, segmentBy)
      if (!segmentMap.has(label)) {
        segmentMap.set(label, [])
      }
      segmentMap.get(label)!.push(item.metrics)
    })

    // Aggregate metrics per segment
    const segmentData = Array.from(segmentMap.entries()).map(([label, metrics]) => ({
      label,
      metrics: this.aggregateMetrics(metrics),
    }))

    // Find top performer
    let topPerformer = segmentData[0]?.label || ''
    let topValue = 0
    segmentData.forEach((seg) => {
      if (seg.metrics.roas > topValue) {
        topValue = seg.metrics.roas
        topPerformer = seg.label
      }
    })

    return {
      segment: segmentBy,
      data: segmentData,
      topPerformer,
      topPerformerMetric: topValue,
    }
  }

  // ========== PRIVATE HELPERS ==========

  private generateRecommendations(
    changes: any[],
    currentMetrics: Metrics
  ): string[] {
    const recommendations: string[] = []

    // Check CTR
    const ctrChange = changes.find((c) => c.metricName === 'ctr')
    if (ctrChange && ctrChange.changePercent < -15) {
      recommendations.push(
        `CTR упал на ${Math.abs(ctrChange.changePercent).toFixed(1)}%. Проверьте релевантность объявлений`
      )
    }

    // Check CPC
    const cpcChange = changes.find((c) => c.metricName === 'cpc')
    if (cpcChange && cpcChange.changePercent > 25) {
      recommendations.push(
        `CPC вырос на ${cpcChange.changePercent.toFixed(1)}%. Рассмотрите уменьшение ставок`
      )
    }

    // Check ROAS
    if (currentMetrics.roas < 2) {
      recommendations.push('ROAS ниже 2x. Рассмотрите улучшение целевой страницы или объявлений')
    }

    // Check conversion rate
    if (currentMetrics.conversionRate < 1) {
      recommendations.push('Conversion rate ниже 1%. Проверьте качество трафика')
    }

    return recommendations
  }

  private detectAnomalies(changes: any[]): string[] {
    const anomalies: string[] = []

    changes.forEach((change) => {
      if (Math.abs(change.changePercent) > 50) {
        anomalies.push(
          `Значительное изменение ${change.metricName}: ${change.changePercent > 0 ? '+' : ''}${change.changePercent.toFixed(1)}%`
        )
      }
    })

    return anomalies
  }

  private detectCampaignAnomalies(campaigns: Campaign[]): any[] {
    const anomalies: any[] = []

    campaigns.forEach((campaign) => {
      // Check for low CTR
      if (campaign.metrics.ctr < 0.5) {
        anomalies.push({
          campaignId: campaign.id,
          message: `Низкий CTR: ${campaign.metrics.ctr.toFixed(2)}%`,
          severity: 'warning',
        })
      }

      // Check for high CPC
      if (campaign.metrics.cpc > 5) {
        anomalies.push({
          campaignId: campaign.id,
          message: `Высокий CPC: $${campaign.metrics.cpc.toFixed(2)}`,
          severity: 'info',
        })
      }

      // Check for no conversions
      if (campaign.metrics.conversions === 0 && campaign.metrics.cost > 100) {
        anomalies.push({
          campaignId: campaign.id,
          message: 'Нет конверсий при существенных расходах',
          severity: 'critical',
        })
      }
    })

    return anomalies
  }

  private recommendAction(campaign: Campaign): string {
    if (campaign.metrics.roas > 3) {
      return 'Увеличьте бюджет на 20-30%'
    } else if (campaign.metrics.roas < 1) {
      return 'Снизьте бюджет или паузируйте кампанию'
    } else if (campaign.metrics.ctr < 1) {
      return 'Проверьте релевантность объявлений'
    } else {
      return 'Кампания работает стабильно, мониторьте'
    }
  }

  private estimateImpact(campaign: Campaign): string {
    if (campaign.metrics.roas > 3) {
      return 'Потенциально +$' + (campaign.metrics.cost * 0.25).toFixed(0) + ' в ROI'
    }
    return 'Оптимизируйте перед расширением'
  }

  private extractSegmentLabel(item: any, segmentBy: string): string {
    switch (segmentBy) {
      case 'device':
        return item.device || 'Unknown'
      case 'dayOfWeek':
        return item.dayOfWeek || 'Unknown'
      case 'hour':
        return `${item.hour}:00` || 'Unknown'
      case 'geography':
        return item.geography || 'Unknown'
      default:
        return 'Unknown'
    }
  }

  private aggregateMetrics(metricsArray: Metrics[]): Metrics {
    if (metricsArray.length === 0) {
      return this.getEmptyMetrics()
    }

    const sum = metricsArray.reduce(
      (acc, m) => ({
        impressions: acc.impressions + m.impressions,
        clicks: acc.clicks + m.clicks,
        cost: acc.cost + m.cost,
        conversions: acc.conversions + m.conversions,
        conversionValue: acc.conversionValue + m.conversionValue,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        conversionRate: 0,
        cpa: 0,
        roas: 0,
        qualityScore: acc.qualityScore + m.qualityScore,
        avgPosition: acc.avgPosition + m.avgPosition,
        impressionShare: 0,
        clickShare: 0,
        budgetSpent: acc.budgetSpent + m.budgetSpent,
        budgetRemaining: acc.budgetRemaining + m.budgetRemaining,
        budgetUtilization: 0,
        effectiveCPM: 0,
        bounceRate: acc.bounceRate + m.bounceRate,
        avgSessionDuration: acc.avgSessionDuration + m.avgSessionDuration,
        engagementRate: acc.engagementRate + m.engagementRate,
        viewThroughRate: acc.viewThroughRate + m.viewThroughRate,
      }),
      this.getEmptyMetrics()
    )

    // Recalculate derived metrics
    const count = metricsArray.length
    return {
      ...sum,
      ctr: (sum.clicks / (sum.impressions || 1)) * 100,
      cpc: sum.cost / (sum.clicks || 1),
      cpm: (sum.cost / (sum.impressions || 1)) * 1000,
      conversionRate: (sum.conversions / (sum.clicks || 1)) * 100,
      cpa: sum.cost / (sum.conversions || 1),
      roas: sum.conversionValue / (sum.cost || 1),
      qualityScore: sum.qualityScore / count,
      avgPosition: sum.avgPosition / count,
      budgetUtilization: (sum.budgetSpent / (sum.budgetSpent + sum.budgetRemaining || 1)) * 100,
      effectiveCPM: (sum.conversionValue / (sum.impressions || 1)) * 1000,
      bounceRate: sum.bounceRate / count,
      avgSessionDuration: sum.avgSessionDuration / count,
      engagementRate: sum.engagementRate / count,
      viewThroughRate: sum.viewThroughRate / count,
    }
  }

  private getEmptyMetrics(): Metrics {
    return {
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
      conversions: 0,
      conversionRate: 0,
      conversionValue: 0,
      cpa: 0,
      roas: 0,
      qualityScore: 0,
      avgPosition: 0,
      impressionShare: 0,
      clickShare: 0,
      cost: 0,
      budgetSpent: 0,
      budgetRemaining: 0,
      budgetUtilization: 0,
      effectiveCPM: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      engagementRate: 0,
      viewThroughRate: 0,
    }
  }
}

export const comparisonService = new ComparisonService()
